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

streamSyncControllers.controller('NavCtrl', ['$scope', '$location', 'user', 
  function($scope, $location, user) {
    $scope.logout = function() {
      user.logout();
    };
    $scope.base_path = $location.path().split('/')[1];
  }]);

streamSyncControllers.controller('EventCreateCtrl', ['$scope', 'event', 'user',
    function($scope, event, user) {
        //paramaters to request
        $scope.name = "";
        $scope.date = new Date();
        $scope.time = new Date();
        user.logged_in();

        //request server to perform action
        $scope.submit = function() {
           event.create(this.name, this.date, this.time);
        };
    }]); 

streamSyncControllers.controller('ProfileCtrl', ['$scope', 'user', 'event',
    function($scope, user, event) {
        $scope.current_user = {};
        user.logged_in()
            .success(function(data, status) {
                $scope.current_user = data.user;
            });

        $scope.current_user_created_events = [];
        // returns the events created by the current user
        $scope.get_events_by_creator = function(){
            event.get_events_by_creator()
                .success(function(data, status){
                    $scope.current_user_created_events = data.events;
                });
            };
        $scope.get_events_by_creator();

    }]); 

streamSyncControllers.controller('EventListCtrl', ['$scope', 'user', 'event',
    function($scope, user, event) {

        //List of events to display
        $scope.events = [];
        $scope.query = '';

        $scope.user = {};

        user.logged_in()
          .success(function(data, status) {
              $scope.user = data.user;
          });

        //Function to fetch lists from database
        $scope.search = function() {
          event.search(this.query)
            .success(function(data, status) {
              $scope.events = data.events;
            });
        };

        //Calls the function to populate the event list
        $scope.search('');

    }]); 

streamSyncControllers.controller('PlayBackCtrl', ['$scope', '$routeParams', 'event', 'song', 'playlist', 'memberlist', 'user', 'socket',
  function($scope, $routeParams, event, song, playlist, memberlist, user, socket) {
    // get logged in user
    $scope.user = {};
        user.logged_in()
            .success(function(data, status) {
                $scope.user = data.user;
            });

    $scope.event = {};
    $scope.memberlist = {};
    $scope.playlist = {};
    $scope.isHost = false;

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
    event.join($routeParams.eventSlug)
      .success(function (data, status) {
          $scope.event = data.event;
          $scope.memberlist = data.event.memberlist;
          $scope.playlist = data.event.playlist;
          $scope.playlist.isPlaying = $scope.playlist.current > -1;
          $scope.isHost = data.event.isHost;
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
              $scope.unselectResult();
              $scope.searchModeOff();
          });
    };

    $scope.socketFuncs = {
      'playlist': {
        song_added: function(data) {
          $scope.playlist.songs = data.songs;
        },
        initialized: function(data) {
          $scope.playlist.current = 0;
          $scope.initializeTrack();
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

    $scope.controls = {
      play: function() { 
        $scope.playlist.isPlaying = true;
        song.play($scope.isHost); 
      },
      pause: function() { 
        $scope.playlist.isPlaying = false;
        song.pause($scope.isHost); 
      }
    };

    $scope.$on('$destroy', function() {
      song.stop();
    });

  }]);
