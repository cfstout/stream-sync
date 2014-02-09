'use strict';

/* Controllers */

var streamSyncControllers = angular.module('streamSyncControllers', []);

streamSyncControllers.controller('LoginCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
    $scope.username;
    $scope.password;
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

streamSyncControllers.controller('SignupCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
    $scope.username;
    $scope.password;
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

