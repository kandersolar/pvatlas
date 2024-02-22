const COLORSCALE_OPACITY = 0.7;

L.Control.Layers.include({
  getOverlays: function() {
    var control = this;
    var layers = [];

    control._layers.forEach(function(obj) {
      if (!obj.overlay) {  // technically they are base layers, not overlays
        layers.push({
          "name": obj.name,
          "visible": control._map.hasLayer(obj.layer),
          "georasters": obj.layer.georasters,
          "metadata": obj.layer.options.metadata,
        });
      }
    });
    return layers;
  }
});


function rasterToLayer(georaster, metadata, options){
  // console.log(chroma.brewer);

  // default values, to be optionally overridden by configuration in RST
  var min = georaster.mins[0];
  var max = georaster.maxs[0];
  var name = 'Viridis';
  // overrides:
  if(options.colorscale_min != ''){
    min = options.colorscale_min;
  }
  if(options.colorscale_max != ''){
    max = options.colorscale_max;
  }
  if(options.colorscale_name != ''){
    name = options.colorscale_name;
  }

  var range = max - min;
  var scale = chroma.scale(name);

  var description = null;

  var layer = new GeoRasterLayer({
    georaster: georaster,
    opacity: COLORSCALE_OPACITY,
    pixelValuesToColorFn: function(pixelValues) {
      var pixelValue = pixelValues[0]; // use value in first band
      if (pixelValue === -9999) return null;
      var scaledPixelValue = (pixelValue - min) / range;
      var color = scale(scaledPixelValue).hex();
      return color;
    },
    resolution: 512,
  });
  return layer;
}


function addLayer(filename, map, layerControl, name, order, options){
  fetch(filename)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
      parseGeoraster(arrayBuffer).then(async georaster => {

        // TODO: see if there is some way to get the GDAL metadata without
        // having to parse the entire Array Buffer.  Could also get rid of
        // the geotiff.js import at the top of this file.
        // https://github.com/GeoTIFF/georaster/issues/86

        var metadata = await GeoTIFF.fromArrayBuffer(georaster._data).then(geotiff => {
            return geotiff.getImage().then(image => {
                return image.getGDALMetadata();
            });
        });

        var layer = rasterToLayer(georaster, metadata, options);
        layer.options.order = order;
        layer.options.filename = filename;
        layer.options.metadata = metadata;
        layerControl.addBaseLayer(layer, name);
        if(order == 0){
          // make the first layer visible by default
          layer.addTo(map);
        }
    });
  });
}


async function doArithmetic(operation, layer1, layer2){
  // geoblaze can only do arithmetic between bands within a single raster
  var merged = [layer1, layer2].reduce((result, georaster) => ({
    ...georaster,
    maxs: [...result.maxs, ...georaster.maxs],
    mins: [...result.mins, ...georaster.mins],
    ranges: [...result.ranges, georaster.ranges],
    values: [...result.values, ...georaster.values],
    numberOfRasters: result.values.length + georaster.values.length
  }));

  var result = await geoblaze.bandArithmetic(merged, operation);
  return result;
}


function makeColorBarSVG(stops, ticks, description, container, id){

  var gradientHTML = '<svg width="100%" height="0%"><linearGradient id="lg-' + id + '">';
  for(var i = 0; i < stops.x.length; i++){
    var percentage = stops.x[i] * 100;
    var color = stops.c[i];
    gradientHTML += "<stop offset=" + percentage + "% stop-color='" + color + "'/>"
  }
  gradientHTML += "</linearGradient></svg>";
  
  var titleHTML = '<svg width="100%" height="30%" y="0%"><text fill="#000000" x="50%" y="80%" font-family="sans-serif" font-size="14px" text-anchor="middle">' + description + '</text></svg>';

  var colorBarHTML = '<svg width="100%" height="20%" y="30%"><rect fill-opacity="' + COLORSCALE_OPACITY + '" fill="url(#lg-' + id + ')" x="5%" y="0%" width="90%" height="100%"/></svg>';

  var tickLabelHTML = '<svg width="100%" height="60%" y="50%">';
  for(var i = 0; i < ticks.x.length; i++){
    var fraction = ticks.x[i];
    var label = ticks.labels[i];
    var position = 100 * (0.05 + fraction * 0.9);
    tickLabelHTML += '<rect fill="#000000" x="' + (position - 0.25/2) + '%" y="0%" width="0.25%" height="20%"/>';
    tickLabelHTML += '<text fill="#000000" x="' + position + '%" y="60%" font-family="sans-serif" font-size="14px" text-anchor="middle">' + label + '</text>';
  }
  tickLabelHTML += '</svg>';
  
  var html = '<svg width="100%" height="100%"">' + gradientHTML + titleHTML + colorBarHTML + tickLabelHTML + "</svg>";
  return html;
}

function makeColorScale(vmin, vmax, name, colorscale_label_digits, description, container, id){
  var scale = chroma.scale(name);
  var nstops = 10;
  var xs = [];
  var cs = [];
  for(var i = 0; i < nstops; i++){
    var x = i / (nstops - 1);
    var c = scale(x).hex();
    xs.push(x);
    cs.push(c);
  }
  var stops = {x: xs, c: cs};
  
  var nticks = 3;
  var xs = [];
  var labels = [];
  for(var i = 0; i < nticks; i++){
    var x = i / (nticks - 1);
    var label = (vmin + x * (vmax - vmin)).toFixed(colorscale_label_digits);
    xs.push(x);
    labels.push(label);
  }
  var ticks = {x: xs, labels: labels};
  return makeColorBarSVG(stops, ticks, description, container, id);
}


function init(id, options){
  
  var map = L.map('map-' + id, {
      fullscreenControl: {
        pseudoFullscreen: true
      },
      minZoom: 4,
      maxZoom: 6,
    }
  ).setView([37, -97], 4);

  var sidebar = L.control.sidebar({
    container: 'sidebar-' + id,
    position: 'left',
  }).addTo(map);

  // colorbar
  if(options.colorscale_name !== '' && options.colorscale_min !== '' && options.colorscale_name !== ''){
    L.Control.colorbar = L.Control.extend({
       onAdd: function(map) {
         var container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');
         container.id = "colorbar-" + id;
         container.style = "height:60px; width:300px";
         container.innerHTML = makeColorScale(options.colorscale_min, options.colorscale_max, 
                                              options.colorscale_name, options.colorscale_label_digits,
                                              options.short_description, container, id);
         return container;
      },
      onRemove: function(map) {
        // Nothing to do here
      }
    });
    L.control.colorbar = function(opts) { return new L.Control.colorbar(opts);}
    L.control.colorbar({ position: 'topright' }).addTo(map);
  }

  var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  })
  osm.addTo(map);

  // note: we are using "base layers" for the data layers so that only
  // one data layer is selectable at a time (base layers use radio buttons,
  // overlays use checkboxes).  We always want the OSM layer active, so
  // just add it to the map, not the layer control.

  var layerControl = L.control.layers({}, {}, {
    sortLayers: true,
    sortFunction: function (layerA, layerB){
      return layerA.options.order - layerB.options.order;
    }
  }).addTo(map);

  if(options.layers_title !== undefined && options.layers_title != ''){
    var titleElement = L.DomUtil.create('label');
    titleElement.setAttribute("style", "text-align:center;");
    titleElement.innerHTML = options.layers_title;
    var layerControlElement = layerControl.getContainer().querySelector('.leaflet-control-layers-list');
    layerControlElement.insertBefore(titleElement, layerControlElement.firstChild);
  }
  
  var selectOptions = [];
  options.geotiffSpecs.forEach(function(spec, i){  // maintain order from the original layer list
    var uri = spec.filename;
    var label = spec.label;  // layer label defined in RST file
    addLayer(uri, map, layerControl, label, i, options);
    selectOptions.push("<option value='" + label + "'>" + label + "</option>");
  });


  // layer difference calculation
  document.getElementById("select-layer1-" + id).innerHTML = selectOptions.join();
  document.getElementById("select-layer2-" + id).innerHTML = selectOptions.join();

  var calculationLayer = null;  // populated based on user interaction

  async function onSelectChange(){

    function getGeoraster(name){
      var layers = layerControl.getOverlays();
      for(var i = 0; i < layers.length; i++){
        var layer = layers[i];
        if(layer.name == name){
          return layer.georasters[0];
        }
      }
    }
    var georaster1 = getGeoraster(document.getElementById("select-layer1-" + id).value);
    var georaster2 = getGeoraster(document.getElementById("select-layer2-" + id).value);
    var georasterDifference = await doArithmetic("a - b", georaster1, georaster2);

    if(calculationLayer !== null){
      layerControl.removeLayer(calculationLayer);
      map.removeLayer(calculationLayer);
    }
    // TODO: metadata for calculated layer?
    calculationLayer = rasterToLayer(georasterDifference, {});
    calculationLayer.addTo(map);
    layerControl.addBaseLayer(calculationLayer, "Calculated");
  }
  document.getElementById("select-layer1-" + id).onchange = onSelectChange;
  document.getElementById("select-layer2-" + id).onchange = onSelectChange;

  // change selected layer interaction
  map.on('baselayerchange', function(e) {
    var text = "";
    var layers = layerControl.getOverlays();
    for(var i = 0; i < layers.length; i++){
      var layer = layers[i];
      console.log(layer);
      if(layer.name == e.name){
        text = "Description: " + layer.metadata['DESCRIPTION'] + " File date: " + layer.metadata["CREATION_DATE"] + ".";
        break;
      }
    }

    document.getElementById("map-caption-" + id).innerHTML = text;
  });

  // mousemove / hover interaction
  map.on('mousemove', function(evt) {
    var latlng = map.mouseEventToLatLng(evt.originalEvent);
    var text = "<p>Coordinates: (" + latlng.lat.toFixed(3) + ", " + latlng.lng.toFixed(3) + ")</p>"

    text += "<table style='border-spacing: 5px;'><tr><th>Layer</th><th>" + options.short_description + "</th></tr>";
    layerControl.getOverlays().forEach(function(layer){
      var prefix = "";
      var suffix = "";
      if(layer.visible){
        prefix = "<strong>";
        suffix = "</strong>";
      }
      var pixelValues = geoblaze.identify(layer.georasters[0], [latlng.lng, latlng.lat]);
      var value = "-";
      if(pixelValues !== null && pixelValues[0] != -9999){
        value = pixelValues[0];
        value = value.toFixed(4);
      }
      text = text + (
         "<tr>" + "<td>" + prefix + layer.name + suffix + "</td>" +
         "<td>" + value + "</td>" + "</tr>"
      );
    });
    text = text + "</table>";
    $("#selection-content-" + id)[0].innerHTML = text;
  });

  L.Control.textbox = L.Control.extend({
     onAdd: function(map) {
       var text = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');
       text.id = "selection-content-" + id;
       text.innerHTML = "hover over the map";
       return text;
    },
    onRemove: function(map) {
      // Nothing to do here
    }
  });
  L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
  L.control.textbox({ position: 'bottomright' }).addTo(map);
}
