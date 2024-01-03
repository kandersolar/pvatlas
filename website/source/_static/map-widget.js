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
        });
      }
    });
    return layers;
  }
});


function rasterToLayer(georaster, metadata){
  // console.log(chroma.brewer);
  var scale = chroma.scale("Viridis");

  const min = georaster.mins[0];
  const max = georaster.maxs[0];
  const range = georaster.ranges[0];

  var description = null;
  if(metadata !== null){
      description = (
          "<br>" +
          "File Date: " + metadata["CREATION_DATE"] + "<br>" +
          "Description: " + metadata["DESCRIPTION"]
      );
  }

  var layer = new GeoRasterLayer({
    georaster: georaster,
    opacity: 0.7,
    pixelValuesToColorFn: function(pixelValues) {
      var pixelValue = pixelValues[0]; // use value in first band
      if (pixelValue === -9999) return null;
      var scaledPixelValue = (pixelValue - min) / range;
      var color = scale(scaledPixelValue).hex();
      return color;
    },
    resolution: 512,
    attribution: description  // TODO: put layer description somewhere nicer?
  });
  return layer;
}


function addLayer(filename, layerControl, name, order){
  fetch("./geotiffs/" + filename)
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

        var layer = rasterToLayer(georaster, metadata);
        layer.options.order = order;
        layer.options.filename = filename;
        layerControl.addBaseLayer(layer, name);
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


function init(id, geotiffs){
  var map = L.map('map-' + id, {
      fullscreenControl: {
        pseudoFullscreen: true
      }
    }
  ).setView([38, -97], 4);

  var sidebar = L.control.sidebar({
    container: 'sidebar-' + id,
    position: 'left',
  }).addTo(map);

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

  var selectOptions = [];
  geotiffs.forEach(function(fn, i){  // maintain order from the original layer list
    var name = fn.split("/").pop();  // only show the filename, not the full path
    addLayer(fn, layerControl, name, i);
    selectOptions.push("<option value='" + name + "'>" + name + "</option>");
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


  // mousemove / hover interaction
  map.on('mousemove', function(evt) {
    var latlng = map.mouseEventToLatLng(evt.originalEvent);
    var text = "<p>Coordinates: (" + latlng.lat.toFixed(3) + ", " + latlng.lng.toFixed(3) + ")</p>"

    text += "<table style='border-spacing: 5px;'><tr><th>Layer</th><th>Pixel value</th></tr>";
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
        value = value.toFixed(3);
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
