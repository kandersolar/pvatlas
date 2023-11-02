
Interactive Map
===============

Click on the map to display information about the location.
Different layers can be displayed using the selection widget
in the upper right of the map.

.. raw:: html
   
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css"/>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-sidebar/src/L.Control.Sidebar.css"/>

    <script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet.js"></script>
    <script src="https://unpkg.com/georaster"></script>
    <script src="https://unpkg.com/chroma-js"></script>
    <script src="https://unpkg.com/georaster-layer-for-leaflet"></script>
    <script src="https://unpkg.com/geoblaze"></script>
    <script src="https://unpkg.com/leaflet-sidebar"></script>
    <script src='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/Leaflet.fullscreen.min.js'></script>
    <link href='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css' rel='stylesheet' />
    
    <div id="sidebar">
      <h2>Calculations</h2>
      <div id="manipulation-controls">Controls here</div>
      <h2>Selected location</h2>
      <div id="selection-content">Select a location on the map.</div>
    </div>
    <div id="map" style="height: 580px; width: 100%"></div>

    <script src="_static/map.js"></script>
