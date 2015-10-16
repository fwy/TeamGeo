(function (global) {

    // Store a reference to the application object
    var app = global.app = global.app || {};

    var onViewResize = function () {
        if (window.device && device.platform === 'iOS') {
            setTimeout(function () {
                $(document.body).height(window.innerHeight);
            }, 10);
        }
    };

//    if (isMobilePlatform()) {
//        // Called by Cordova when the application is loaded by the device
//        document.addEventListener("deviceready", function () {
//            // Hide the splash screen as soon as the app is ready. otherwise
//            // Cordova will wait 5 very long seconds to do it for you.
//            navigator.splashscreen.hide();
//
//            new kendo.mobile.Application(document.body, {
//                // skin: "flat",
//                transition: 'slide',
//                loading: "<h1></h1>",
//                initial: 'views/mapTest.html'
//            });
//
//            onViewResize();
//
//        }, false);
//	}

    app.angular = angular.module('geoProto', ["kendo.directives"]);

    // Explicitly white-list URL protocols for AngularJS to prevent AppBuilder simulator errors in Chrome
    app.angular.config(['$compileProvider', function ($compileProvider) {
    	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension|local):/);
    	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension|local):/);
    }]);

    if (isMobilePlatform()) {
        document.addEventListener('orientationchange', onViewResize);
    }

}(window));
