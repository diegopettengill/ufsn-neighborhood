/**
 * Google Maps layer
 */

var map;
var markers = [];

// Configuration object for the project
var config = {
    foursquare: {
        endpoint: "https://api.foursquare.com/v2/venues/",
        params: $.param({
            client_id: 'J0XBH2Z3UUUID3JEGDGBLJQ3AHHVXTQZLC0MN3UQVP3VZFVY',
            client_secret: 'DVYJLTUCAQINHCN0EBZV4FWVHQK24AV2IUWDPFEJSDSUVAEQ',
            v: '20170625'
        })
    }
};

window.initMap = function () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.7572654, lng: -122.420143},
        zoom: 13,
        mapTypeControl: false
    });
};


var ViewModel = function () {

    var vm = this;

    vm.locations = ko.observableArray([]);

    vm.query = ko.observable("");

    // Init the app, fetching the coworking locations in San Francisco
    vm.init = function () {

        $.ajax({
            url: config.foursquare.endpoint + "search" + "?" + config.foursquare.params,
            data: {
                format: 'json',
                near: 'San Francisco, CA',
                query: 'Coworking'
            },
            dataType: 'json'
        }).done(function (data) {

            data.response.venues.forEach(function (venue) {

                vm.locations.push(venue);

                var infoWindow = new google.maps.InfoWindow({
                    content: venue.name
                });

                var marker = new google.maps.Marker({
                    position: {lat: venue.location.lat, lng: venue.location.lng},
                    animation: google.maps.Animation.DROP,
                    map: map,
                    title: venue.name
                });

                marker.addListener('click', function () {

                    if (marker.getAnimation() !== null) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    }

                    infoWindow.open(map, marker);
                });

                markers.push(marker);

            });

            // vm.getLocations();

        }).fail(function (err) {

            //@TODO Add other type of message
            alert(err);

        });

    };


    vm.getLocations = ko.computed(function () {
        
        var texto = vm.query();

        var filter = texto.toLocaleLowerCase();

        if (filter === "") {
            return vm.locations();
        } else {
            return ko.utils.arrayFilter(vm.locations(), function (item) {
                return item.name.toLowerCase().indexOf(filter) !== -1;
            });
        }

    });


    vm.showMarker = function (location) {


    };


    vm.init();

};

var app = new ViewModel();
ko.applyBindings(app);


// $(document).ready(function(){
//
//     $("#filter").keyup(function(){
//
//         var filterString = $(this).val();
//
//         app.getLocations(filterString);
//
//     });
//
// });