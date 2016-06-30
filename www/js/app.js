// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var app = angular.module('app', ['ionic','ionic.service.core', 'ion-autocomplete',   'ngCordova',  'ionic.service.push', 'app.routes', 'app.services', 'app.directives', 'angularMoment'])
.constant('ApiEndpoint', {
  //url:'http://localhost:8100/ionic'
    url:'https://mark.smsvoip.nscook.net/ionic'
})
.constant('ScaleDronePush', {
    channel_id: 'Not4yRVrFtQgNuDL'
})

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

    });

})



var controllers = {};

controllers.parentController = function($scope, $state, $http, $rootScope, $ionicUser, $ionicPush, ApiEndpoint, ScaleDronePush) {

    
}
