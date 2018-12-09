(function () {

    // ============
    // Esri-Leaflet 
    // ============

    var options = {
        center: [40.723, -74.00],
        zoom: 10.4,
        zoomSnap: .1,
        zoomControl: false
    }

    var map = L.map('map', options);

    // Add map tiles
    var tiles = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
    });

    tiles.addTo(map);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    //var searchControl = L.esri.Geocoding.Controls.geosearch({expanded: true, collapseAfterResult: false, zoomToResult: false}).addTo(map);
    var searchControl = L.esri.Geocoding.geosearch({
        expanded: true,
        collapseAfterResult: false,
        zoomToResult: true
    }).addTo(map);

    // Home Button
    var homeZoom = document.getElementById('homeZoom');

    homeZoom.onclick = function () {
        map.setView([40.723, -74.00], 10.4);
    }

    searchControl.on('results', function (data) {
        if (data.results.length > 0) {
            var popup = L.popup()
                .setLatLng(data.results[0].latlng)
                .setContent(data.results[0].text)
                .openOn(map);
            map.setView(data.results[0].latlng)
        }
    })

    $(document).ready(function () {

        // Basemap changed
        $("#selectStandardBasemap").on("change", function (e) {
            setBasemap($(this).val());
        });

        // Search
        var input = $(".geocoder-control-input");
        input.focus(function () {
            $("#panelSearch .panel-body").css("height", "150px");
        });
        input.blur(function () {
            $("#panelSearch .panel-body").css("height", "auto");
        });

        // Attach search control for desktop or mobile
        function attachSearch() {
            var parentName = $(".geocoder-control").parent().attr("id"),
                geocoder = $(".geocoder-control"),
                width = $(window).width();
            if (width <= 767 && parentName !== "geocodeMobile") {
                geocoder.detach();
                $("#geocodeMobile").append(geocoder);
            } else if (width > 767 && parentName !== "geocode") {
                geocoder.detach();
                $("#geocode").append(geocoder);
            }
        }

        $(window).resize(function () {
            attachSearch();
        });

        attachSearch();

    }); <!-- jQuery -->


})();
