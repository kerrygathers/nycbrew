(function () {

    // ============
    // Esri-Leaflet 
    // ============

    // hide info panel on page load
    var info = $('#brewery-info').hide();

    var options = {
        center: [40.752, -74.00],
        zoom: 10.8,
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
        map.setView([40.752, -74.00], 10.8);
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


    // load brewery data form csv
    omnivore.csv('data/breweries.csv')
        .on('ready', function (e) {
            drawMap(e.target.toGeoJSON());
        })
        .on('error', function (e) {
            console.log(e.error[0].message);
        });

    function drawMap(data) {

        var options = {
            pointToLayer: function (feature, ll) {
                return L.circleMarker(ll, {
                    opacity: 1,
                    weight: 2,
                    fillOpacity: 0,
                })
            }
        }

        // create separate layers from GeoJSON data
        var breweryLayer = L.geoJson(data, {
            filter: function (feature) {
                if (feature.properties.taproom == "y") {
                    return feature;
                }
            },
            pointToLayer: function (feature, latlng) {
                var beerIcon = new L.icon({
                    iconUrl: "./images/svg/beer-15.svg",
                    iconSize: [20, 20],
                    popupAnchor: [-22, -22],
                    className: "icon"
                });
                return L.marker(latlng, {
                    icon: beerIcon
                });
            }
        }).addTo(map);

        breweryLayer.eachLayer(function (layer) {

            var props = layer.feature.properties;

            var tooltip = "<span class='tooltip-title'>" + props.name + "</span>" +
                "<p class='tooltip-body'>" + props.neighborhood + ", " + props.boro + "</p>" +
                "<p class='click-call'>" + "Click for more info" + "</p>"

            layer.bindTooltip(tooltip);
        });

        $('#info-close').click(function () {
            $('#brewery-info').hide();
        });

        retrieveInfo(breweryLayer);

    }

    function retrieveInfo(breweryLayer) {

        breweryLayer.on('click', function (e) {

            var props = e.layer.feature.properties;

            // make info window visible
            $('#brewery-info').fadeIn(150);

            // populate HTML elements with relevant info
            $(".brewery-logo span:first-child").html(
                "<img src='" + props.logo + "' class='logo-pic'>");
            $(".brewery-name span:first-child").html(props.name);
            $(".brewery-location span:first-child").html(props.neighborhood);
            $(".brewery-location span:last-child").html(props.boro);
            $(".brewery-links span:first-child").html(props.website);
            $(".brewery-links span:last-child").html(props.beers);
            $(".sunday span:first-child").html(props.sun);
            $(".monday span:first-child").html(props.mon);
            $(".tuesday span:first-child").html(props.tue);
            $(".wednesday span:first-child").html(props.wed);
            $(".thursday span:first-child").html(props.thu);
            $(".friday span:first-child").html(props.fri);
            $(".saturday span:first-child").html(props.sat);

        });

    }

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
