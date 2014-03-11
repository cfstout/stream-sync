'use strict';

/* Services */

var streamSyncServices = angular.module('streamSyncServices', []);

streamSyncServices.factory('socket', ['$rootScope', 
    function($rootScope) {
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            execute: function(url) {
                socket.get(url, function(res){});
            }
        };
    }]);

streamSyncServices.factory('user', ['$http', '$location',
	function($http, $location) {
		return {
            logged_in: function() {
                    return $http.get('user/logged_in')
                        .error(function(data, status){
                            $location.path('/login');
                        });
                },
            login: function (username, password) {
                    var params = {
                        username: username,
                        password: password
                    };
                    return $http.post('/login/local', params)
                        .success(function (data, status) {
                            $location.path('/profile');
                        })
                        .error(function (data, status) {
                            console.log(data);
                        });
                },
            signup: function(username, password, loc) {
                var params = {
                    username: username,
                    password: password,
                    loc: loc
                };
                $http.post('/signup', params)
                    .success(function (data, status) {
                        $location.path('/profile');
                    })
                    .error(function (data, status) {
                        console.log("ERROR");
                    });
                }
            };
	}]);

streamSyncServices.factory('event', ['$http','$location', 'socket',
    function($http, $location, socket){
        return {
            create: function(eventName) {
                var params = {
                    eventName: eventName
                };
                return $http.post('event/create',params)
                    .success(function (data, status){
                        $location.path('event/list');
                    })
                    .error(function (data, status){
                        console.log("ERROR");
                    });
            },
            join: function(slug) {
                socket.execute('/event/' + slug + '/subscribe');
                return $http.put('event/' + slug + '/join');
            }
        };
    }]);

streamSyncServices.factory('song', ['$http', 'track',
    function($http, track) {

        var cur_track;

        function processTitle(title) {
            var segments = title.split(' - ');
            var result = {};
            if (segments.length < 2) {
                result = {
                    title: title,
                    artist: ''
                };
            } else if (segments.length > 2) {
                result = {
                    title: segments.splice(1, segments.length).join(' - '),
                    artist: segments[0]
                };
            } else {
                result = {
                    title: segments[1],
                    artist: segments[0]
                };
            }
            return result;
        }

        return {
            initializePlayers: function(callback) {
                var youtube_tag = document.createElement('script');
                youtube_tag.src = "https://www.youtube.com/iframe_api";
                var soundcloud_tag = document.createElement('script');
                soundcloud_tag.src = "https://connect.soundcloud.com/sdk.js";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(youtube_tag, firstScriptTag);
                firstScriptTag.parentNode.insertBefore(soundcloud_tag, firstScriptTag);

                var players_check = setInterval(function() {
                    if (youtube_player_ready && typeof SC != 'undefined') {
                        clearInterval(players_check);
                        SC.initialize({
                            client_id: '9be920a0587219cd0d35a351b4366c5d'
                        });
                        callback();
                    }
                }, 100);
                setTimeout(function() {
                    clearInterval(players_check);
                }, 10000);
            },
            search: {
                    youtube: function(query) {
                        return $http.get('song/search/youtube/'+query);
                    },
                    soundcloud: function(query) {
                        return $http.get('song/search/soundcloud/'+query);
                    }
                },
            process: {
                    youtube: function(items) {
                        var results = [];
                        var track = {};
                        for (var i = 0; i < 5; i++) {
                            track = processTitle(items[i].snippet.title);
                            results[i] = {
                                title: track.title,
                                artist: track.artist,
                                source: 'youtube',
                                source_id: items[i].id.videoId
                            };
                        }
                        return results;
                    },
                    soundcloud: function(items) {
                        var results = [];
                        var track = {};
                        for (var i = 0; i < 5; i++) {
                            track = processTitle(items[i].title);
                            results[i] = {
                                title: track.title,
                                artist: track.artist,
                                source: 'soundcloud',
                                source_id: items[i].id
                            };
                        }
                        return results;
                    }
                },
            createRemoteSong: function(song) {
                    return $http.post('song/create/remote', song);
                },

            initializeTrack: function(song) {
                    switch (song.source) {
                        case 'youtube':
                            cur_track = new track.youtube(song);
                            break;
                        case 'soundcloud':
                            cur_track = new track.soundcloud(song);
                            break;
                        default:
                            console.log(song.source + ' is and invalid source');
                            break;
                    }
                }
            };
    }]);

streamSyncServices.factory('playlist', ['$http','$location',
    function($http, $location){
        return {
            addSong: function(playlist_id, song) {
                return $http.put('/playlist/'+playlist_id+'/addSong', {song: song});
            }
        };
    }]);

streamSyncServices.factory('memberlist', ['$http','$location',
    function($http, $location){
        return {
            
        };
    }]);

streamSyncServices.factory('track', [
    function () {

        function YTtrack(song) {
            this.song = song;
            this.isReady = false;
            this.player = new YT.player('ytplayer', {
                height: 0,
                width: 0,
                videoId: song.source_id
            });
        }

        YTtrack.prototype.play = function() {
            this.player.play();
        };

        function SCtrack(song) {
            this.song = song;
            this.isReady = false;
            var track = this;
            SC.stream('/tracks/'+song.source_id, function(player) {
                track.player = player;
                track.isReady = true;
                track.play();
            });
        }

        SCtrack.prototype.play = function() {
            this.player.play();
        };

        return {
            youtube: YTtrack,
            soundcloud: SCtrack
        };

    }]);