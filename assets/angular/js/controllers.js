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

streamSyncControllers.controller('LogoutCtrl', ['$scope', '$http', '$location',
  function($scope,$http,$location){
    $scope.logout = function() {
      $http.post('/logout')
        .success(function (data, status){
          console.log("SUCCESS");
          $location.path('/login');
        })
        .error(function (data, status){
          console.log("ERROR");
        });
    };
  }]);

streamSyncControllers.controller('EventCreateCtrl', ['$scope', 'event', 'user',
    function($scope, event, user) {
        //paramaters to request
        $scope.eventName = "";
        user.logged_in();

        //request server to perform action
        $scope.submit = function() {
           event.create(this.eventName);
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

streamSyncControllers.controller('EventListCtrl', ['$scope', '$http', 'user',
    function($scope, $http, user) {
        //List of events to display
        $scope.events = [];
        user.logged_in();
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

streamSyncControllers.controller('PlayBackCtrl', ['$scope', '$routeParams', 'event', 'song', 'playlist', 'memberlist', 'user', 'socket',
  function($scope, $routeParams, event, song, playlist, memberlist, user, socket) {
    // get logged in user
    $scope.user = {};
        user.logged_in()
            .success(function(data, status) {
                $scope.user = data.user;
            });

    $scope.initializePlayers = function() {
      song.initializePlayers($scope.initializeTrack);
    };

    // initialize track
    $scope.initializeTrack = function() {
      var current = $scope.playlist.current;
      if (current > -1) {
        song.initializeTrack($scope.playlist.songs[current]);
      }
    };

    // initialize event
    $scope.event = {};
    $scope.memberlist = {};
    $scope.playlist = {};
    event.join($routeParams.eventSlug)
      .success(function (data, status) {
          $scope.event = data.event;
          $scope.memberlist = data.event.memberlist;
          $scope.playlist = data.event.playlist;
          $scope.initializePlayers();
      });

    // Search objects
    $scope.query = "";
    $scope.results = null;
    $scope.selectedResult = null;

    // Toggle Search Modes
    $scope.searchModeOn = function() { $scope.results = []; };
    $scope.searchModeOff = function() { $scope.results = null; };

    //Request to server to search for a song
    $scope.search = function() {
        $scope.results = [];
        song.search.youtube(this.query)
            .success(function (data, status) {
                $scope.results = $scope.results.concat(song.process.youtube(data.list.items));
            });
        song.search.soundcloud(this.query)
            .success(function (data, status) {
                $scope.results = $scope.results.concat(song.process.soundcloud(data.list));
            });
    };

    // Select a Result
    $scope.selectResult = function(index) { $scope.selectedResult = $scope.results[index]; };
    $scope.unselectResult = function() { $scope.selectedResult = null; };

    // Adding Song
    $scope.addSelectedSong = function() {
        var db_song;
        song.createRemoteSong(this.selectedResult)
          .success(function (data, status) {
              playlist.addSong($scope.playlist.id, data.song);
          });
    };

    $scope.socketFuncs = {
      'playlist': {
        song_added: function(data) {
          $scope.playlist.songs = data.songs;
        }
      },
      'memberlist': {
        user_added: function(data) {
          $scope.memberlist.members = data.members;
        }
      }
    };

    // socket stuff
    socket.on('message', function(message) {
      $scope.socketFuncs[message.model][message.data.meta](message.data);
    });

  }]);
