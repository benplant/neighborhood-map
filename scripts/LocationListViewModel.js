(function () {
    'use strict';

    // Represent a single location
    var Location = function (title, lat, lng) {
        this.title = title;
        this.lat = lat;
        this.lng = lng;
    };

    // The Location List ViewModel
    var LocationListViewModel = function (locations) {
        // Array of passed in locations -- mapped to an observableArray of Location objects
        this.locations = ko.observableArray(locations.map(function (location) {
            return new Location(location.title, location.lat, location.lng);
        }));

        // Store the current search filter entered by the user
        this.currentFilter = ko.observable();

        // Filter locations array based on search input
        this.filteredLocations = ko.computed(function () {
            if (!this.currentFilter()) {
                return this.locations();
            } else {
                return ko.utils.arrayFilter(this.locations(), function(location) {
                    return location.title.indexOf(this.currentFilter()) > -1;
                }.bind(this));
            }
        }.bind(this));

        this.filter = function() {
            this.currentFilter();
        };


        //this.selectedItems = ko.observableArray(["Second"]);

        //this.sortItems = function() {
        //    this.items.sort();
        //}.bind(this);
    };



    // Load example data from FourSquare
    //var queryURL = 'https://api.foursquare.com/v2/venues/search?near="Vancouver, BC"?client_id=VKUTCSNJXF00HDNE5ZMBMPFU0SG3MDJUXVAUOGMJQKOOCJA1&client_secret=1SDCLMDOJEYT13I4S4TRGDADKZD3XE0VL0RH32J0MELJFAKQ';

    var queryURL = 'https://api.foursquare.com/v2/venues/search?near="Vancouver, BC"&oauth_token=XWDKSEKZ0FTNFJMOJ1SA5MSSA1HZVCMPTTZ5DYJUX0YFI3K4&v=20150509';

    var locations = [];

    $.getJSON(queryURL, function( data ) {

        var venues = data.response.venues;

        for (var i = 0; i < venues.length; i++) {
            locations.push(new Location(venues[i].name, venues[i].location.lat, venues[i].location.lng));
        }

        console.log(locations);

        // Bind an instance of our viewModel to the page
        var viewModel = new LocationListViewModel(locations || []);
        ko.applyBindings(viewModel);
    });

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
