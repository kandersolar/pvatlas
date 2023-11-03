L.Control.Layers.include({
  getOverlays: function() {
    var control = this;
    var layers = [];

    control._layers.forEach(function(obj) {
      if (obj.overlay) {
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

function rasterToLayer(georaster){
  // console.log(chroma.brewer);
  var scale = chroma.scale("Viridis");

  const min = georaster.mins[0];
  const max = georaster.maxs[0];
  const range = georaster.ranges[0];

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
    resolution: 512
  });
  return layer;
}

function addLayer(url, layerControl, name){
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
      parseGeoraster(arrayBuffer).then(georaster => {
        var layer = rasterToLayer(georaster);
        layerControl.addOverlay(layer, name);
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

function init(){
  var map = L.map('map', {
      fullscreenControl: {
        pseudoFullscreen: true
      }
    }
  ).setView([40, -100], 4);

  var sidebar = L.control.sidebar({
    container: 'sidebar',
    position: 'left',
  }).addTo(map);
  
  var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  })
  osm.addTo(map);
  var layerControl = L.control.layers({"OpenStreetMap": osm}, {}).addTo(map);

  var geotiffs = [
    "ft-20_all-sky_0.00.tiff", "ft-20_all-sky_0.85.tiff", "ft-lat_all-sky_0.00.tiff",
    "ft-lat_all-sky_0.85.tiff", "sat_all-sky_0.00.tiff", "sat_all-sky_0.85.tiff"
  ];

  geotiffs.forEach(function(fn){
    addLayer(fn, layerControl, fn);
  });
  var calculationLayer = null;  // populated based on user interaction

  var selectOptions = [];
  geotiffs.forEach(function(fn){
    selectOptions.push("<option value='" + fn + "'>" + fn + "</option>");
  });
  document.getElementById("select-layer1").innerHTML = selectOptions.join();
  document.getElementById("select-layer2").innerHTML = selectOptions.join();
  
  map.on('click', function(evt) {
     var latlng = map.mouseEventToLatLng(evt.originalEvent);
     var text = "<p></p><p>Coordinates: (" + latlng.lat.toFixed(3) + ", " + latlng.lng.toFixed(3) + ")</p>"
     
     layerControl.getOverlays().forEach(function(layer){
       //if(layer.visible){
         var pixelValues = geoblaze.identify(layer.georasters[0], [latlng.lng, latlng.lat]);
         text = text + "<p>" + layer.name + ": " + pixelValues[0] + "</p>";
       //}
     });
     $("#selection-content").html(text);
     sidebar.open("location-info");
  });
  
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
    var georaster1 = getGeoraster(document.getElementById("select-layer1").value);
    var georaster2 = getGeoraster(document.getElementById("select-layer2").value);
    var georasterDifference = await doArithmetic("a - b", georaster1, georaster2);

    if(calculationLayer !== null){
      layerControl.removeLayer(calculationLayer);
      map.removeLayer(calculationLayer);
    }
    calculationLayer = rasterToLayer(georasterDifference);
    calculationLayer.addTo(map);
    layerControl.addOverlay(calculationLayer, "Calculated");
  }
  document.getElementById("select-layer1").onchange = onSelectChange; 
  document.getElementById("select-layer2").onchange = onSelectChange; 
}

$(window).on('load', function() {
    init();
});
