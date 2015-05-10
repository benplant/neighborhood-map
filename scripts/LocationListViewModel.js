var LocationListViewModel = function(items) {
    this.items = ko.observableArray(items);
    this.itemToAdd = ko.observable("");

    this.addItem = function() {
        if (this.itemToAdd() != "") {
            this.items.push(this.itemToAdd());
            this.itemToAdd("");
        }
    }.bind(this);

    //this.selectedItems = ko.observableArray(["Second"]);

    //this.sortItems = function() {
    //    this.items.sort();
    //}.bind(this);

};

var viewModel = new LocationListViewModel(['item1']);
viewModel.addItem('newItem');

ko.applyBindings(viewModel);




var addLocationsFromFourSquare = function(items) {

    //var queryURL = 'https://api.foursquare.com/v2/venues/search?near="Vancouver, BC"?client_id=VKUTCSNJXF00HDNE5ZMBMPFU0SG3MDJUXVAUOGMJQKOOCJA1&client_secret=1SDCLMDOJEYT13I4S4TRGDADKZD3XE0VL0RH32J0MELJFAKQ';

    var queryURL = 'https://api.foursquare.com/v2/venues/search?ll=40.7,-74&oauth_token=PO0JFFBQVVOQPTELEBK2KXKKMUOCNOUX0FFL43UQBAMTI1N0&v=20150509';

    var locations = [];

    $.getJSON(queryURL, function( data ) {

        console.log(data);

        var venues = data.response.venues;

        for (var i = 0; i < venues.length; i++) {
            locations.push(venues[i].name);
        }
    });

    return locations;
};




var queryYelp = function() {

    var queryURL = "http://api.yelp.com/v2/search?location=Vancouver, BC&cc=CA&category_filter=gluten_free";



    //$.getJSON(queryURL, function( data ) {



    var auth = {
        consumerKey: "nfcsACjrebEVCPG64xgyXQ",
        consumerSecret: "Q9GiWQ6dAEv3eR2d02Hn6D_5Hyc",
        accessToken: "V2Sb2E5N8urFb0apHO2_XkFG20xvbLWb",
        // You wouldn't actually want to expose your access token secret like this in a real application.
        accessTokenSecret: "us5uLE1OJFKyGYzxstTPD4OpRuA",
        serviceProvider: {
            signatureMethod: "HMAC-SHA1"
        }
    };

    var terms = 'food';
    var near = 'Vancouver, BC';

    var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
    };

    parameters = [];
    parameters.push(['term', terms]);
    parameters.push(['location', near]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

    var message = {
        'action': 'http://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
    console.log(parameterMap);

    var bestRestaurant = "Some random restaurant";

    $.ajax({
        'url': message.action,
        'data': parameterMap,
        'cache': true,
        'dataType': 'jsonp',
        'jsonpCallback': 'cb',
        'success': function (data, textStats, XMLHttpRequest) {
            console.log(data);
            var output = prettyPrint(data);

            document.write("<h1>The 3 best restaurants are listed for the following city: </h1>");
            document.write("<h1>");
            document.write(near);
            document.write("<\h1>");
            var i;
            for (i = 0; i <= 10; i = i + 1) {
                document.write("<p>");
                document.write(data.businesses[i].name);
                document.write("   Rated   ");
                document.write(data.businesses[i].rating);
                document.write("      ");
                document.write(data.businesses[i].phone);
                document.write("<\p>");
            }

        }
    });
};

//queryYelp();