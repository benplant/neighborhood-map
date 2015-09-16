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
                position: new google.maps.LatLng(self.lat,self.lng),
                map: googleMap,
                title: self.title
            });

            var infowindow = new google.maps.InfoWindow({ content: self.info});

            google.maps.event.addListener(self.marker, 'click', function() {
                infowindow.open(googleMap, self.marker);
            });
        };
    };

    // The Location List ViewModel
    var LocationListViewModel = function (locationModel) {
        var self = this;

        self.map = initializeMap();

        // Observable Array of Locations
        self.locations = ko.observableArray([]);

        // Location Categories
        self.categories = ko.observableArray([]);

        // Location Categories
        /*
        self.categories = [
            { categoryName: "Coffee Shops" },
            { categoryName: "Restaurants" },
            { categoryName: "Book Stores" },
            { categoryName: "Parks" }
        ];

        self.selectedCategories = [
            { categoryName: "Coffee Shops", isSelected: false },
            { categoryName: "Restaurants", isSelected: false },
            { categoryName: "Book Stores", isSelected: false },
            { categoryName: "Parks", isSelected: false }
        ];
        */

        function initializeMap() {
            // Uses global google variable
            // If internet is not connected, google is not defined.
            if (typeof google === 'undefined') {
                console.log("No google variable");
                return null;
            } else {
                var mapOptions = {
                    center: {lat: 49.2739952, lng: -123.1403072},
                    zoom: 14,
                    // Disable Google controls/UI
                    disableDefaultUI: true
                };
                var map = new google.maps.Map(document.getElementById('map'), mapOptions);
                // Fix map height
                // document.getElementById('map').height($(window).height());
                // Not necessary --> set parent elements of #map (body and html) to
                // 100% height and width in CSS to solve the issue.
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
                console.log(data);
                var places = data.response.groups[0].items;
                for (var i = 0; i < places.length; i++) {
                    console.log(places[i].venue);
                    var location = createLocation(places[i].venue);
                    console.log(location);
                    location.addToMap(self.map);
                    self.locations.push(location);
                }
            }).fail(function() {
                console.log("Unable to complete FourSquare request");
            });

                //done(function() { alert('getJSON request succeeded!'); })
                //.fail(function() { alert('getJSON request failed! '); })
                //.always(function() { alert('getJSON request ended!'); });
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

        // Array of passed in locations -- mapped to an observableArray of Location objects
        //self.locations = ko.observableArray(locationModel.locations.map(function (location) {
        //    return new Location(location.title, location.lat, location.lng);
        //}));

        console.log("Mapped locations: " + self.locations());

        // Store the current search filter entered by the user
        self.currentFilter = ko.observable();

        // Filter locations array based on search input
        self.filteredLocations = ko.computed(function () {
            if (!self.currentFilter()) {
                return self.locations();
            } else {
                return ko.utils.arrayFilter(self.locations(), function(location) {
                    return location.title.indexOf(self.currentFilter()) > -1;
                });
            }
        });

        self.filter = function() {
            self.currentFilter();
        };

        // Console Log the JSON form of the ViewModel
        //console.log(ko.toJSON(self));



    };

    // Bind an instance of our viewModel to the page
    var viewModel = new LocationListViewModel();
    ko.applyBindings(viewModel);
}());


//var queryYelp = function() {
//
//    var queryURL = "http://api.yelp.com/v2/search?location=Vancouver, BC&cc=CA&category_filter=gluten_free";
//
//
//
//    //$.getJSON(queryURL, function( data ) {
//
//
//
//    var auth = {
//        consumerKey: "nfcsACjrebEVCPG64xgyXQ",
//        consumerSecret: "Q9GiWQ6dAEv3eR2d02Hn6D_5Hyc",
//        accessToken: "V2Sb2E5N8urFb0apHO2_XkFG20xvbLWb",
//        // You wouldn't actually want to expose your access token secret like this in a real application.
//        accessTokenSecret: "us5uLE1OJFKyGYzxstTPD4OpRuA",
//        serviceProvider: {
//            signatureMethod: "HMAC-SHA1"
//        }
//    };
//
//    var terms = 'food';
//    var near = 'Vancouver, BC';
//
//    var accessor = {
//        consumerSecret: auth.consumerSecret,
//        tokenSecret: auth.accessTokenSecret
//    };
//
//    parameters = [];
//    parameters.push(['term', terms]);
//    parameters.push(['location', near]);
//    parameters.push(['callback', 'cb']);
//    parameters.push(['oauth_consumer_key', auth.consumerKey]);
//    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
//    parameters.push(['oauth_token', auth.accessToken]);
//    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
//
//    var message = {
//        'action': 'http://api.yelp.com/v2/search',
//        'method': 'GET',
//        'parameters': parameters
//    };
//
//    OAuth.setTimestampAndNonce(message);
//    OAuth.SignatureMethod.sign(message, accessor);
//
//    var parameterMap = OAuth.getParameterMap(message.parameters);
//    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
//    console.log(parameterMap);
//
//    var bestRestaurant = "Some random restaurant";
//
//    $.ajax({
//        'url': message.action,
//        'data': parameterMap,
//        'cache': true,
//        'dataType': 'jsonp',
//        'jsonpCallback': 'cb',
//        'success': function (data, textStats, XMLHttpRequest) {
//            console.log(data);
//            var output = prettyPrint(data);
//
//            document.write("<h1>The 3 best restaurants are listed for the following city: </h1>");
//            document.write("<h1>");
//            document.write(near);
//            document.write("<\h1>");
//            var i;
//            for (i = 0; i <= 10; i = i + 1) {
//                document.write("<p>");
//                document.write(data.businesses[i].name);
//                document.write("   Rated   ");
//                document.write(data.businesses[i].rating);
//                document.write("      ");
//                document.write(data.businesses[i].phone);
//                document.write("<\p>");
//            }
//
//        }
//    });
//};
