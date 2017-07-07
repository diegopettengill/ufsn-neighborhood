/**
 * Google Maps layer
 */

var map;
var markers = [];
var openedInfo = null;

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

window.googleError = function(){
    alert("An error while loading Google Maps ocurred, please try to reload the page.");
};

var infoWindowTemplate = function (coworking) {

    var infoHtml = '<h5>' + coworking.name + '</h5>';

    if (coworking.contact.hasOwnProperty('formattedPhone')) {
        infoHtml += '<p class="info-phone">';
        infoHtml += '<i class="glyphicon glyphicon-earphone"></i> ';
        infoHtml += '<a href="tel:'+coworking.contact.formattedPhone+'" title="Call Now!">'+coworking.contact.formattedPhone+'</a>';
        infoHtml += '</p>';
    }

    infoHtml += '<p class="info-address">';
    infoHtml += '<i class="glyphicon glyphicon-pushpin"></i> ' + coworking.location.formattedAddress[0]+'<br>';
    infoHtml += coworking.location.formattedAddress[1]+'<br>';
    infoHtml += '</p>';

    if (coworking.hasOwnProperty('twitter')) {
        infoHtml += '<p class="info-twitter">' + coworking.contact.twitter + '</p>';
    }

    return infoHtml;

};


var ViewModel = function () {

    var vm = this;

    vm.locations = ko.observableArray([]);
    vm.query = ko.observable("");

    /**
     * Init the app, fetching cowrking places near San Francisco
     * using the Foursquare API
     */
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

            // iterate over the return data
            data.response.venues.forEach(function (venue) {

                var infoTemplate = infoWindowTemplate(venue);

                venue.infoWindow = new google.maps.InfoWindow({
                    content: infoTemplate
                });

                venue.marker = new google.maps.Marker({
                    position: {lat: venue.location.lat, lng: venue.location.lng},
                    animation: google.maps.Animation.DROP,
                    map: map,
                    title: venue.name,
                    icon: 'img/marker.png'
                });

                venue.marker.addListener('click', function () {
                    vm.showInfo(venue);
                });

                vm.locations.push(venue);

                markers.push(venue.marker);

            });

            // vm.getLocations();

        }).fail(function (err) {

            //@TODO Add other type of message
            alert("Oops! An error ocurred while trying to fetch the awesome Coworking places near San Francisco :(");

        });

    };

    /**
     * Filter the current locations by the term typed in the search box
     */
    vm.getLocations = ko.computed(function () {

        //Our desired term
        var term = vm.query();

        //Lowercase the search term to get better results and final UX
        var filter = term.toLocaleLowerCase();
        
        //If no term typed, then return all the locations
        if (filter === "") {

            ko.utils.arrayForEach(vm.locations(), function (item) {
                item.marker.setMap(map);
            });

            return vm.locations();

        } else {
            return ko.utils.arrayFilter(vm.locations(), function (item) {
                if (item.name.toLowerCase().indexOf(filter) !== -1) {
                    item.marker.setMap(map);
                    return true;
                } else {
                    item.marker.setMap(null);
                    return false;
                }
            });
        }

    });

    /**
     * Select a coworking place in the map
     * @param coworking
     */
    vm.selectCoworking = function (coworking) {

        if (coworking.marker.getAnimation() !== null) {
            coworking.marker.setAnimation(null);
        } else {

            coworking.marker.setAnimation(google.maps.Animation.BOUNCE);

            setTimeout(function () {
                coworking.marker.setAnimation(null);
            }, 700);
        }

        vm.toggleNavbar();
        vm.closeAll();
        coworking.infoWindow.open(map, coworking.marker);
    };

    /**
     * Show info windows on marker cliok
     * @param coworking
     */
    vm.showInfo = function (coworking) {

        if (coworking.marker.getAnimation() !== null) {
            coworking.marker.setAnimation(null);
        } else {

            coworking.marker.setAnimation(google.maps.Animation.BOUNCE);

            setTimeout(function () {
                coworking.marker.setAnimation(null);
            }, 700);
        }

        vm.closeAll();
        coworking.infoWindow.open(map, coworking.marker);
    };

    /**
     * Close all the opened infoWindows
     */
    vm.closeAll = function () {
        ko.utils.arrayForEach(vm.locations(), function (coworking) {
            coworking.infoWindow.close();
        });
    };

    vm.toggleNavbar = function () {
        $("#list-coworking").toggleClass('hidden-xs hidden-sm');
    };

    // Run the init function 1 time
    vm.init();

};

var app = new ViewModel();
ko.applyBindings(app);