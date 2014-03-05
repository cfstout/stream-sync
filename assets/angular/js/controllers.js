'use strict';

/* Front End Controllers served through AngularJS */

var streamSyncControllers = angular.module('streamSyncControllers', []);

/**
*   Login form [templates/user/login]
*/
streamSyncControllers.controller('LoginCtrl', ['$scope', 'user',
  function($scope, user) {
    // Parameters to Request
    $scope.username = "";
    $scope.password = "";

    //Request to server to perform action
    $scope.submit = function() {
        user.login(this.username, this.password);
    };

  }]);

/**
*   Signup form [templates/user/signup]
*/
streamSyncControllers.controller('SignupCtrl', ['$scope', 'user',
  function($scope, user) {
    // Parameters to Request
    $scope.username = "";
    $scope.password = "";
    $scope.loc = "";

    //Request to server to perform action
    $scope.submit = function() {
    	user.signup(this.username, this.password, this.loc);
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

streamSyncControllers.controller('ProfileCtrl', ['$scope', '$http', 'user',
    function($scope, $http, user) {
        $scope.current_user = {};
        user.logged_in()
            .success(function(data, status) {
                $scope.current_user = data.user;
            });

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

streamSyncControllers.controller('DatePickerDemoCtrl', ['$scope',
    function($scope) {
      $scope.today = function() {
        $scope.dt = new Date();
      };
      $scope.today();

      $scope.showWeeks = true;
      $scope.toggleWeeks = function () {
        $scope.showWeeks = ! $scope.showWeeks;
      };

      $scope.clear = function () {
        $scope.dt = null;
      };

      // Disable weekend selection
      $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.toggleMin = function() {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
      };
      $scope.toggleMin();

      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
      };

      $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
      $scope.format = $scope.formats[0];
    }]);

