'use strict';

/* App Module */

var streamSyncApp = angular.module('streamSyncApp', [
  'ngRoute',
  // 'angularFileUpload',
  'streamSyncDirectives',
  'streamSyncServices',
  'streamSyncControllers'
]);

/* Routing */

streamSyncApp.config(['$routeProvider', 
  function($routeProvider) {
    $routeProvider
      .when('/',{
        templateUrl: 'views/user/home',
        controller:'HomeCtrl'
      })
      .when('/login', {
        templateUrl: 'views/user/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/user/signup',
        controller: 'SignupCtrl'
      })
      .when('/event/create', {
        templateUrl: 'views/event/create',
        controller: 'EventCreateCtrl'
      })
      .when('/profile', {
        templateUrl: 'views/user/profile',
        controller: 'ProfileCtrl'
      })
      .when('/event/list', {
        templateUrl: 'views/event/list',
        controller: 'EventListCtrl'
      })
      .when('/event/:eventSlug', {
        templateUrl: 'views/event/playback',
        controller: 'PlayBackCtrl'
      })
      .otherwise({
        redirectTo: '/login'
      });
  }]);
