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
    $scope.email = "";

    //Request to server to perform action
    $scope.submit = function() {
    	user.signup(this.username, this.password, this.loc, this.email);
    };

  }]);

streamSyncControllers.controller('NavCtrl', ['$scope', '$location', '$rootScope', 'user',
  function($scope, $location, $rootScope, user) {
    $scope.logout = function() {
      user.logout();
    };
    $scope.base_path = $location.path().split('/')[1];

    $rootScope.hints = false;
    $scope.toggleHints = function(){
      $rootScope.hints = !$rootScope.hints;
    };
  }]);

streamSyncControllers.controller('EventCreateCtrl', ['$scope', 'event', 'user',
    function($scope, event, user) {
        //paramaters to request
        $scope.name = "";
        $scope.datetime = new Date();
        user.logged_in();

        //request server to perform action
        $scope.submit = function() {
           event.create(this.name, this.datetime);
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

streamSyncControllers.controller('PlayBackCtrl', ['$scope', '$routeParams', 'event', 'playlist', 'memberlist', 'user', 'song', 'time',
  function($scope, $routeParams, event, playlist, memberlist, user, song, time) {
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

    $scope.updateTime = function() {
      if ($scope.playlist.curTime) {
        $scope.playlist.percentPlayed = (100 * $scope.playlist.curTime.real / $scope.playlist.curDuration.real);
        $scope.playlist.curTime.pretty = time.prettify($scope.playlist.curTime.real);
      }
    };

    $scope.updatePlaylist = function() {
      $scope.playlist = playlist.instance;
      $scope.updateTime();
    };

    $scope.updateMemberlist = function() {
      $scope.memberlist = memberlist.instance;
    };

    // initialize event
    event.join($routeParams.eventSlug)
      .success(function (data, status) {
          $scope.event = data.event;
          $scope.isHost = data.event.isHost;
          // set playlist
          playlist.set.call(playlist, data.event.playlist, $scope.isHost);
          playlist.watch($scope.updatePlaylist);
          // set memberlist
          memberlist.set.call(memberlist, data.event.memberlist, $scope.user);
          memberlist.watch($scope.updateMemberlist);

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
        song.createRemoteSong(this.selectedResult)
          .success(function (data, status) {
              playlist.addSong(data.song);
              $scope.unselectResult();
              $scope.searchModeOff();
          });
    };

    song.initializePlayers();

    $scope.controls = {
      play: function() { 
        playlist.play(); 
      },
      pause: function() { 
        playlist.pause(); 
      },
      seek: function(click) {
        if ($scope.isHost) {
          var newTime = (click.offsetX / click.target.offsetWidth) * $scope.playlist.curDuration.real;
          playlist.seek(newTime);
        }
      }
    };

    $scope.$on('$destroy', function() {
      playlist.stop();
      memberlist.leave();
    });

  }]);
