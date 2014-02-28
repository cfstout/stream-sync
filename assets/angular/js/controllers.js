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

streamSyncControllers.controller('EventCreateCtrl', ['$scope', '$http', 
    function($scope, $http) {
        $scope.name = "";
        $scope.submit = function() {
            var params = {
                name: this.name
            };
            $http.post('event/create', params)
                .success(function (data, status) {
                    console.log("SUCCESS");
                })
                .error(function (data, status) {
                    console.log("ERROR");
                });
        };
    }]); 

streamSyncControllers.controller('ProfileCtrl', ['$scope', '$http', 
    function($scope, $http) {
        $scope.current_user = {};
        $scope.logged_in = function(){
            $http.get('user/logged_in')
                .success(function(data, status){
                    console.log("SUCCESS");
                })
                .error(function(data, status){
                    console.log("ERROR");
                });
            };
    }]); 