(function (global) {

    // Store a reference to the application object
    var app = global.app = global.app || {};

    // // create an object to store the models for each view
    // window.APP = {
    //   models: {
    //     home: {
    //       title: 'Home'
    //     },
    //     settings: {
    //       title: 'Settings'
    //     },
    //     contacts: {
    //       title: 'Contacts',
    //       ds: new kendo.data.DataSource({
    //         data: [{ id: 1, name: 'Bob' }, { id: 2, name: 'Mary' }, { id: 3, name: 'John' }]
    //       }),
    //       alert: function(e) {
    //         alert(e.data.name);
    //       }
    //     }
    //   }
    // };

    var onViewResize = function () {
        if (window.device && device.platform === 'iOS') {
            setTimeout(function () {
                $(document.body).height(window.innerHeight);
            }, 10);
        }
    };

    if (isMobilePlatform()) {
        // Called by Cordova when the application is loaded by the device
        document.addEventListener("deviceready", function () {
            // Hide the splash screen as soon as the app is ready. otherwise
            // Cordova will wait 5 very long seconds to do it for you.
            navigator.splashscreen.hide();

            new kendo.mobile.Application(document.body, {
                // skin: "flat",
                transition: 'slide',
                loading: "<h1></h1>",
                initial: 'views/home.html'
            });

            onViewResize();

        }, false);
	}

    app.angular = angular.module('geoProto', ["kendo.directives"]);

    // Explicitly whitelist URL protocols for AngularJS to prevent AppBuilder simulator errors in Chrome
    app.angular.config(['$compileProvider', function ($compileProvider) {
    	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension|local):/);
    	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension|local):/);
    }]);


    if (isMobilePlatform()) {
        document.addEventListener('orientationchange', onViewResize);
    }

}(window));
