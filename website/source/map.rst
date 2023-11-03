
Interactive Map
===============

Click on the map to display information about the location.
Different layers can be displayed using the selection widget
in the upper right of the map.

.. raw:: html
   
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css"/>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-sidebar-v2/css/leaflet-sidebar.css"/>
    <link rel="stylesheet" href="https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css"/>

    <script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet.js"></script>
    <script src="https://unpkg.com/georaster"></script>
    <script src="https://unpkg.com/chroma-js"></script>
    <script src="https://unpkg.com/georaster-layer-for-leaflet"></script>
    <script src="https://unpkg.com/geoblaze"></script>
    <script src="https://unpkg.com/leaflet-sidebar-v2"></script>
    <script src="https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/Leaflet.fullscreen.min.js"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"/>

    
    <div id="sidebar" class="leaflet-sidebar collapsed">
        <!-- Nav tabs -->
        <div class="leaflet-sidebar-tabs">
            <ul role="tablist"> <!-- top aligned tabs -->
                <li><a href="#location-info" role="tab"<i class="fa-solid fa-location-dot"></i></a></li>
                <li><a href="#calculations" role="tab"><i class="fa-solid fa-calculator"></i></i></a></li>
            </ul>
        </div>
     
        <!-- Tab panes -->
        <div class="leaflet-sidebar-content">
            <div class="leaflet-sidebar-pane" id="location-info">
                <h1 class="leaflet-sidebar-header" style="color: #fff">
                    Selected location
                    <div class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></div>
                </h1>
                <div id="selection-content">
                <p>Select a location on the map to display its information here.
                </div>
            </div>
            
            <div class="leaflet-sidebar-pane" id="calculations">
                <h1 class="leaflet-sidebar-header" style="color: #fff">
                  Calculations
                  <div class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></div>
                </h1>
                
                <p>Calculate and show the difference between two layers:
                
                <p>Layer 1: <select id="select-layer1"></select></p>
                <p>Layer 2: <select id="select-layer2"></select></p>
            </div>
        </div>
    </div>

    
    <div id="map" style="height: 580px; width: 100%"></div>

    <script src="_static/map.js"></script>

