(function () {
    'use strict';

    // Represent a single location
    var Location = function (title, category, info, lat, lng) {
        var self = this;
        self.title = title;
        self.category = category;
        self.info = info;
        self.lat = lat;
        self.lng = lng;

        self.log = function() {
            console.log(self);
        };

        self.addToMap = function(googleMap) {
            // Create a marker
            self.marker = new google.maps.Marker({
                position: {lat: self.lat, lng: self.lng},
                map: googleMap,
                title: self.title
            });

            google.maps.event.addListener(self.marker, 'click', function() {
                self.marker.map.panTo(self.marker.position);
                console.log(googleMap.infoWindow);
                console.log(self.info);
                googleMap.infoWindow.setContent(self.info);
                console.log(googleMap.infoWindow);
                googleMap.infoWindow.open(googleMap, self.marker);

                // Add a brief bounce animation
                self.marker.setAnimation(google.maps.Animation.BOUNCE);
                window.setTimeout(function() {
                    // Stop bounce animation
                    self.marker.setAnimation(null);
                }, 1440);
            });

            self.clicked = function() {
                google.maps.event.trigger(self.marker, 'click');
            };

            self.hide = function() {
                // Remove this marker from the map
                // https://developers.google.com/maps/documentation/javascript/examples/marker-remove
                self.marker.setMap(null);
            };

            self.show = function() {
                self.marker.setMap(googleMap);
            }
        };
    };

    // The Location List ViewModel
    var LocationListViewModel = function (locationModel) {
        var self = this;

        self.mapCenter = {lat: 49.2739952, lng: -123.1403072};
        self.map = initializeMap();
        self.locations = ko.observableArray([]);
        self.categories = ko.observableArray([]);

        function initializeMap() {
            // Uses global google variable
            // If internet is not connected, google is not defined.
            if (typeof google === 'undefined') {
                console.log("No google variable");
                return null;
            } else {
                var mapOptions = {
                    center: self.mapCenter,
                    zoom: 14,
                    // Disable Google controls/UI
                    disableDefaultUI: true
                };
                var map = new google.maps.Map(document.getElementById('map'), mapOptions);
                map.infoWindow = new google.maps.InfoWindow();
                return map;
            }
        }

        function addCategory(name, pluralName) {

            // Check to see if this category already exists
            var match = ko.utils.arrayFirst(self.categories(), function(item) {
                return name === item.categoryName;
            });

            if (!match) {
                // Add the new category
                var category = { categoryName: name, pluralName: pluralName, isSelected: true };
                self.categories.push(category);
            }
        }

        // Load data from FourSquare
        function loadFourSquareData() {
            // Return the top interesting results from FourSquare
            var queryURL = 'https://api.foursquare.com/v2/venues/explore?ll=49.2739952,-123.1403072&limit=30&oauth_token=XWDKSEKZ0FTNFJMOJ1SA5MSSA1HZVCMPTTZ5DYJUX0YFI3K4&v=20150509';

            $.getJSON(queryURL, function(data) {
                //console.log(data);
                var places = data.response.groups[0].items;
                for (var i = 0; i < places.length; i++) {
                    //console.log(places[i].venue);
                    var location = createLocation(places[i].venue);
                    //console.log(location);
                    location.addToMap(self.map);
                    self.locations.push(location);
                }
            }).fail(function() {
                console.log("Unable to complete FourSquare request");
            });
        }

        function createLocation(locationData) {
            var name = locationData.name;
            var category = locationData.categories[0].name;
            var phoneNumber = locationData.contact.formattedPhone;
            var info = '<div id="content">'+
                '<div id="siteNotice">'+category+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">' + name + '</h1>'+
                '<div id="bodyContent">'+
                '<p>' + phoneNumber + '</p>'+
                '</div>'+
                '</div>';
            var lat = locationData.location.lat;
            var lng = locationData.location.lng;

            addCategory(locationData.categories[0].name, locationData.categories[0].pluralName);

            return new Location(name, category, info, lat, lng);
        }

        loadFourSquareData();

        // Store the current search filter entered by the user
        self.currentFilter = ko.observable();

        // Filter locations array based on search input
        self.filteredLocations = ko.computed(function () {
            if (!self.currentFilter()) {
                // Show all location markers on map
                ko.utils.arrayForEach(self.locations(), function(location) {
                    location.show();
                });
                return self.locations();
            } else {
                // Show filtered locations on map & hide others
                return ko.utils.arrayFilter(self.locations(), function(location) {
                    if (location.title.toLowerCase().indexOf(self.currentFilter().toLowerCase()) > -1) {
                        location.show();
                        return true;
                    } else {
                        location.hide();
                        return false;
                    }
                });
            }
        });

        self.filter = function() {
            self.currentFilter();
        };

        self.searchResultsClicked = function(location) {
            console.log(location);
            location.clicked();
        };

        // Center and resize map when window resized
        window.addEventListener('resize', function() {
            self.map.setCenter(self.mapCenter);
            google.maps.event.trigger(map, "resize");
        });
    };

    // Bind an instance of our viewModel to the page
    var viewModel = new LocationListViewModel();
    ko.applyBindings(viewModel);
}());