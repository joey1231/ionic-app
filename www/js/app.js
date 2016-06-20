// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('app', ['ionic','ionic.service.core','ngCordova', 'ionic.service.push', 'app.routes', 'app.services', 'app.directives', 'angularMoment'])

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

.config(['$ionicAppProvider', function($ionicAppProvider) {
  $ionicAppProvider.identify({
    app_id: '372e908c',
    api_key: 'e90699fa88f36c1746c0c5b020083dc5529bfd09749fbe37',
    dev_push: true
  });
}])

var controllers = {};

controllers.parentController = function($scope, $rootScope, $ionicUser, $ionicPush) {

  var user = $ionicUser.get();
  if(!user.user_id) {
    // Set your user_id here, or generate a random one.
    user.user_id = $ionicUser.generateGUID();
  };
 
  // Metadata
  angular.extend(user, {
    name: 'SMSVoip Guest'
  });
 
  // Identify your user with the Ionic User Service
  $ionicUser.identify(user).then(function(){
    $scope.identified = true;
    console.log('Identified user ' + user.name + '\n ID ' + user.user_id);
  });
}