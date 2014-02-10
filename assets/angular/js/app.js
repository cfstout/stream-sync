'use strict';

/* App Module */

var streamSyncApp = angular.module('streamSyncApp', [
  'ngRoute',
  'streamSyncControllers'
]);

/* Routing */

streamSyncApp.config(['$routeProvider', 
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/test/test',
        controller: 'TestCtrl'
      })
      .when('/login', {
        templateUrl: 'views/user/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/user/signup',
        controller: 'SignupCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);