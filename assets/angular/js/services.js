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
                    return $http.get(root + 'user/logged_in')
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
                $http.post(root + 'signup', params)
                    .success(function (data, status) {
                        $location.path('/profile');
                    })
                    .error(function (data, status) {
                        console.log("ERROR");
                    });
                },
            logout: function() {
                    return $http.post(root + 'logout')
                        .success(function (data, status){
                            $location.path('/login');
                        })
                        .error(function (data, status){
                            console.log("error: " + data);
                        });
                }
            };
	}]);

streamSyncServices.factory('event', ['$http','$location', 'socket',
    function($http, $location, socket){
        return {
            search: function(query) {
                return $http.get(root + 'event/list/'+query)
                    .error(function (data, status) {
                        console.log("ERROR");
                    });
            },
            get_events_by_creator: function() {
                return $http.get(root + 'event/get_events_by_creator');
            },
            create: function(eventName, date, time) {
                //console.log(time);
                var params = {
                    eventName: eventName,
                    date: date,
                    time: time
                };
                return $http.post(root + 'event/create',params)
                    .success(function (data, status){
                        $location.path('event/' + data.event.slug);
                    })
                    .error(function (data, status){
                        console.log("ERROR");
                    });
            },
            join: function(slug) {
                socket.execute(root + 'event/' + slug + '/subscribe');
                return $http.put(root + 'event/' + slug + '/join');
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
                        return $http.get(root + 'song/search/youtube/'+query);
                    },
                    soundcloud: function(query) {
                        return $http.get(root + 'song/search/soundcloud/'+query);
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
                    return $http.post(root + 'song/create/remote', song);
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
                },
            play: function(isHost) {
                    cur_track.play();
                },
            pause: function(isHost) {
                    cur_track.pause();
                },
            stop: function() {
                    cur_track.stop();
                }
            };
    }]);

streamSyncServices.factory('playlist', ['$http','$location',
    function($http, $location){
        return {
            addSong: function(playlist_id, song) {
                return $http.put(root + 'playlist/'+playlist_id+'/addSong', {song: song});
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

        var track;

        function YTtrack(song) {
            track = this;
            this.song = song;
            this.isReady = false;
            this.player = new YT.Player('ytplayer', {
                height: 0,
                width: 0,
                videoId: song.source_id,
                events: {
                    'onReady': track.onReady
                }
            });
        }

        YTtrack.prototype = {
            onReady: function() {
                track.isReady = true;
                track.play();
            },
            play: function() {
                if (this.isReady) {
                    this.player.playVideo();
                }
            },
            pause: function() {
                if (this.isReady) {
                    this.player.pauseVideo();
                }
            },
            stop: function() {
                this.player.stopVideo();
            }
        };

        function SCtrack(song) {
            track = this;
            this.song = song;
            this.isReady = false;
            this.isPlaying = false;
            SC.stream('/tracks/'+song.source_id, function(player) {
                track.player = player;
                track.isReady = true;
                track.play();
            });
        }

        SCtrack.prototype = {
            play: function() {
                if (!this.isPlaying && this.isReady) {
                    this.isPlaying = true;
                    this.player.play();
                }
            },
            pause: function() {
                this.isPlaying = false;
                if (this.isReady) {
                    this.player.pause();
                }
            },
            stop: function() {
                this.player.stop();
            }
        };

        return {
            youtube: YTtrack,
            soundcloud: SCtrack
        };

    }]);