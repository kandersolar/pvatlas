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
 
function addLayer(url, layerControl, name){
  // console.log(chroma.brewer);
  var scale = chroma.scale("Viridis");
  
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
      parseGeoraster(arrayBuffer).then(georaster => {
        const min = georaster.mins[0];
        const max = georaster.maxs[0];
        const range = georaster.ranges[0];
        console.log({"min": min, "max": max, "range": range});

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
          resolution: 256
        });
        console.log("layer:", layer);
        layerControl.addOverlay(layer, name);
    });
  });
}

function calcDifference(layer1, layer2){
  // geoblaze can only do arithmetic between bands within a single raster
  var merged = [layer1, layer2].reduce((result, georaster) => ({
    ...georaster,
    maxs: [...result.maxs, ...georaster.maxs],
    mins: [...result.mins, ...georaster.mins],
    ranges: [...result.ranges, georaster.ranges],
    values: [...result.values, ...georaster.values],
    numberOfRasters: result.values.length + georaster.values.length
  }));
  var difference = geoblaze.bandArithmetic(merged, "a - b");
  return difference;
}

function init(){
  var map = L.map('map', {
      fullscreenControl: {
        pseudoFullscreen: true
      }
    }
  ).setView([40, -95], 4);

  var sidebar = L.control.sidebar('sidebar', {
      position: 'left'
  });
  map.addControl(sidebar);

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

  map.on('click', function(evt) {
     var latlng = map.mouseEventToLatLng(evt.originalEvent);
     console.log(latlng);
     var text = "<p>Selected location: (" + latlng.lat.toFixed(3) + ", " + latlng.lng.toFixed(3) + ")</p>"
     
     layerControl.getOverlays().forEach(function(layer){
       console.log(layer);
       //if(layer.visible){
         var pixelValues = geoblaze.identify(layer.georasters[0], [latlng.lng, latlng.lat]);
         text = text + "<p>" + layer.name + ": " + pixelValues[0] + "</p>";
       //}
     });
     $("#selection-content").html(text);
     sidebar.show();
     console.log(text);
  });
}

$(window).on('load', function() {
    init();
});
