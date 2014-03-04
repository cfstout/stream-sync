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
    			$location.path('/profile');
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
    			$location.path('/profile');
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
        // returns the User object of the currently logged in User
        $scope.logged_in = function(){ 
            $http.get('user/logged_in')
                .success(function(data, status){
                    console.log(data);
                    $scope.current_user = data.user;
                })
                .error(function(data, status){
                    console.log("ERROR");
                });
            };
        $scope.logged_in();

        $scope.current_user_created_events = [];
        // returns the events created by the current user
        $scope.get_events_by_creator = function(){
            $http.get('event/get_events_by_creator')
                .success(function(data, status){
                    console.log(data);
                    $scope.current_user_created_events = data.events;
                });
            };
        $scope.get_events_by_creator();

    }]); 

streamSyncControllers.controller('EventListCtrl', ['$scope', '$http', 
    function($scope, $http) {
        //List of events to display
        $scope.events = [];
        //Function to fetch lists from database
        $scope.getList = function() {
            var params = {};
            $http.get('event/list', params)
                .success(function (data, status) {
                    console.log("SUCCESS");
                    //set events list to data returned
                    $scope.events = data.event;
                })
                .error(function (data, status) {
                    console.log("ERROR");
                });
        };
        //Calls the function to populate the event list
        $scope.getList();

    }]); 

