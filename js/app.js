/**
 * Google Maps layer
 */

var map;

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

    vm.locations = ko.observableArray();

    // Init the app, fetching
    vm.init = function () {

        $.ajax({
            url: config.foursquare.endpoint+"search" + "?" + config.foursquare.params,
            data: {
                format: 'json',
                near: 'San Francisco, CA',
                query: 'Coworking'
            },
            dataType: 'json'
        }).done(function(data){

            data.response.venues.forEach(function(venue){

                vm.locations.push(venue);

                var marker = new google.maps.Marker({
                    position: {lat: venue.location.lat, lng: venue.location.lng},
                    animation: google.maps.Animation.DROP,
                    map: map,
                    title: venue.name
                });

            });

        }).fail(function(err){
            console.log(err);
            // console.log( 'Foursquare API failed for ' + restObj.name );
            // self.errorMessage( 'Foursquare', 'Failed request for ' + restObj.name )
        });

    };


    vm.init();

};

var app = new ViewModel();
ko.applyBindings( app );