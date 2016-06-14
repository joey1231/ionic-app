angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.setting', {
    url: '/page7',
    views: {
      'tab4': {
        templateUrl: 'templates/setting.html',
        controller: 'settingCtrl'
      }
    }
  })

  .state('tabsController.inbox', {
    url: '/inbox',
    views: {
      'tab1': {
        templateUrl: 'templates/inbox.html',
        controller: 'inboxCtrl'
      }
    }
  })

  .state('tabsController.conversation', {
    url: '/conversation/:thread_key',
    views: {
      'tab1': {
        templateUrl: 'templates/conversation.html',
        controller: 'inboxCtrl'
      }
    }
  })

  .state('tabsController.contacts', {
    url: '/contacts',
    views: {
      'tab2': {
        templateUrl: 'templates/contacts.html',
        controller: 'contactsCtrl'
      }
    }
  })

  .state('tabsController.profile', {
    url: '/page10',
    views: {
      'tab3': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('tabsController.messages', {
    url: '/page11',
    views: {
      'tab1': {
        templateUrl: 'templates/messages.html',
        controller: 'messagesCtrl'
      }
    }
  })

  .state('tabsController.newContact', {
    url: '/page12',
    views: {
      'tab2': {
        templateUrl: 'templates/newContact.html',
        controller: 'contactsCtrl'
      }
    }
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/page14',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

$urlRouterProvider.otherwise('/login')

  

});