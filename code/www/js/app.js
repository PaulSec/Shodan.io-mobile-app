// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
// angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'uiGmapgoogle-maps'])
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:
    // search feature
    .state('tab.dash', {
        url: '/dash',
        cache: false,
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    })

  .state('intro', {
    url: '/intro',
    templateUrl: 'templates/intro-app.html',
    cache: false,
    controller: 'IntroductionCtrl'
  })

    // results
    .state('tab.results', {
        url: '/search/:searchTerms',
        cache: false,
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-results-search.html',
                controller: 'ResultsSearchCtrl'
            }
        }
    })

    // specific match
    .state('tab.match', {
        url: '/results/:resultId',
        cache: false,
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-match.html',
                controller: 'MatchCtrl'
            }
        }
    })

    // queries features
    .state('tab.queries', {
        url: '/queries',
        cache: false,
        views: {
            'tab-queries': {
                templateUrl: 'templates/tab-queries.html',
                controller: 'QueriesCtrl'
            }
        }
    })

    // results
    .state('tab.results2', {
        url: '/search2/:searchTerms',
        cache: false,
        views: {
            'tab-queries': {
                templateUrl: 'templates/tab-results-queries-search.html',
                controller: 'ResultsSearchCtrl'
            }
        }
    })

    // specific match
    .state('tab.match2', {
        url: '/results2/:resultId',
        cache: false,
        views: {
            'tab-queries': {
                templateUrl: 'templates/tab-match.html',
                controller: 'MatchCtrl'
            }
        }
    })

    // information
    .state('tab.information', {
        url: '/information',
        views: {
            'tab-information': {
                templateUrl: 'templates/tab-information.html',
                controller: 'InformationCtrl'
            }
        }
    })

    .state('tab.account', {
        url: '/account',
        cache: false,
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    })

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'IntroCtrl'
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('intro');

});