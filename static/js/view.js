'use strict';
var clientId, clientSecret, map;
function ViewModel() {
    var _this = this;

    this.searchString = ko.observable("");
    this.markers = [];

    this.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker !== marker) {
            // Foursquare API Client
            clientId = "KAAVYNCJU5GQAVL2SVQO3EQIFJ0K0DYEOA031O3UAR4VULRD";
            clientSecret =
                "W3DDWRFH245XWRBYTTKRQBB1ZTD0FS0WRIXMWYQSUCPQRRZM";

            // URL scheme for Foursquare API
            var fsUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +
                marker.lat + ',' + marker.lng + '&client_id=' + clientId +
                '&client_secret=' + clientSecret + '&query=' + marker.name +
                '&v=20180130' + '&m=foursquare';

            console.log(fsUrl)
            // Get Data From Foursquare
            $.getJSON(fsUrl).done(function(marker) {
                // Assuming the First One is the Right One
                var response = marker.response.venues[0];
                _this.street = response.location.formattedAddress[0]==='undefined' ? "" : response.location.formattedAddress[0];
                _this.city = response.location.formattedAddress[1];
                _this.htmlContentFoursquare ='<div id="bodyContent"><p>'+_this.street+'</p><p>'+_this.city+'</p></div>'
                infowindow.setContent(_this.htmlContent + _this.htmlContentFoursquare);
            }).fail(function() {
                alert("There was an issue with the Foursquare API. Please refresh your page to try again.");
            });

            this.htmlContent = '<div id="content">' + '<h4 id="firstHeading" class="firstHeading">' + marker.name + '</h4>';
            infowindow.open(map, marker);
            marker.anim = marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            },2000)
        }
    };

    this.kapil = function() {
        _this.populateInfoWindow(this, _this.Inf);
    };

    this.initMap = function() {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: {lat: 33.809549, lng: -84.239643},
            zoom: 17,
            styles: styles
        };

        map = new google.maps.Map(mapCanvas, mapOptions);

        // Set InfoWindow
        this.Inf = new google.maps.InfoWindow();
        $.map(LocationList, function(item, idx ){
            _this.marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: item.lat,
                    lng: item.lng
                },
                name: item.name,
                lat: item.lat,
                lng:item.lng,
                id: idx,
                animation: google.maps.Animation.DROP
            });
            _this.markers.push(_this.marker);
            _this.marker.addListener('click', _this.kapil);

        });
    };

    this.initMap();

    this.FilteredLocation = ko.computed(function() {
        var result = [];
        $.map(_this.markers, function(marker, idx){
            if (marker.name.toLowerCase().includes(_this.searchString().toLowerCase())) {
                result.push(marker);
                marker.setVisible(true);
            } else {
                marker.setVisible(false);
            }
        });
        return result;
    }, this);
}

function googleError() {
    $('#map').html("<div class='alert alert-danger'> There was an Error Loading the Google Maps.</div>")
};

function LunchApp() {
    ko.applyBindings(new ViewModel());
}
