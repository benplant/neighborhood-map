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
        }

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
        }
    };



    // The Location List ViewModel
    var LocationListViewModel = function (locationModel) {
        var self = this;

        self.map = initializeMap();

        // Observable Array of Locations
        self.locations = ko.observableArray([]);

        // Location Categories
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

        function initializeMap() {
            var mapOptions = {
                center: {lat: 49.2739952, lng: -123.1403072},
                zoom: 14
            };
            return new google.maps.Map(document.getElementById('map'), mapOptions);
        }

        // Load example data from FourSquare
        function loadFourSquareData() {

            //var queryURL = 'https://api.foursquare.com/v2/venues/search?near="Vancouver, BC"?client_id=VKUTCSNJXF00HDNE5ZMBMPFU0SG3MDJUXVAUOGMJQKOOCJA1&client_secret=1SDCLMDOJEYT13I4S4TRGDADKZD3XE0VL0RH32J0MELJFAKQ';
            var queryURL = 'https://api.foursquare.com/v2/venues/explore?ll=49.2739952,-123.1403072&limit=20&oauth_token=XWDKSEKZ0FTNFJMOJ1SA5MSSA1HZVCMPTTZ5DYJUX0YFI3K4&v=20150509';

            $.getJSON(queryURL, function(data) {

                var places = data.response.groups[0].items;
                for (var i = 0; i < places.length; i++) {
                    console.log(places[i].venue);
                    var location = createLocation(places[i].venue);
                    console.log(location);
                    location.addToMap(self.map);
                    self.locations.push(location);
                }
            });
        }

        function createLocation(locationData) {
            var name = locationData.name;
            var category = locationData.categories[0].name;
            var info = '<div id="content">'+
                '<div id="siteNotice">'+category+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">' + name + '</h1>'+
                '<div id="bodyContent">'+
                '<p>other stuff</p>'+
                '</div>'+
                '</div>';
            var lat = locationData.location.lat;
            var lng = locationData.location.lng;

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
