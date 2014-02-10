'use strict';

/* Front End Controllers served through AngularJS */

var streamSyncControllers = angular.module('streamSyncControllers', []);

/**
*   Login form [templates/user/login]
*/
streamSyncControllers.controller('LoginCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
    // Parameters to Request
    $scope.username;
    $scope.password;

    //Request to server to perform action
    $scope.submit = function() {
    	var params = {
    		username: this.username,
    		password: this.password
    	};
    	$http.post('/login/local', params)
    		.success(function (data, status) {
    			$location.path('/');
    		})
    		.error(function (data, status) {
    			console.log("ERROR");
    		});
    };

  }]);

/**
*   Signup form [templates/user/signup]
*/
streamSyncControllers.controller('SignupCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
    // Parameters to Request
    $scope.username;
    $scope.password;

    //Request to server to perform action
    $scope.submit = function() {
    	var params = {
    		username: this.username,
    		password: this.password
    	};
    	$http.post('/signup', params)
    		.success(function (data, status) {
    			$location.path('/');
    		})
    		.error(function (data, status) {
    			console.log("ERROR");
    		});
    };

  }]);

