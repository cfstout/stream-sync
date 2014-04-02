'use strict';

/* Services */

var streamSyncServices = angular.module('streamSyncServices', []);

/*  To get rid of annoying errors in JSLint 
    @TODO delete in production */

if (typeof console == 'undefined') { var console = {}; }
if (typeof $initializers == 'undefined') { var $initializers = {}; }
if (typeof $settings == 'undefined') { var $settings = {}; }

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
            execute: function(url, data, callback) {
                if (typeof callback === 'undefined') {
                    callback = function(response){};
                }
                if (typeof data === 'undefined') {
                    data = {};
                }
                socket.post(url, data, callback);
            },
            emit: function(name, data) {
                if (typeof data == 'undefined') {
                    data = {};
                }
                socket.emit(name, data);
            }
        };
    }]);

streamSyncServices.factory('user', ['$http', '$location',
	function($http, $location) {
		return {
            logged_in: function() {
                    return $http.get($settings.root + 'user/logged_in')
                        .error(function(data, status){
                            $location.path('/login');
                        });
                },
            login: function (username, password) {
                    var params = {
                        username: username,
                        password: password
                    };
                    return $http.post($settings.root + 'login/local', params)
                        .success(function (data, status) {
                            $location.path('/event/list');
                        })
                        .error(function (data, status) {
                            console.log(data);
                        });
                },
            signup: function(username, password, loc, email) {
                var params = {
                    username: username,
                    password: password,
                    loc: loc,
                    email: email
                };
                $http.post($settings.root + 'signup', params)
                    .success(function (data, status) {
                        $location.path('/event/list');
                    })
                    .error(function (data, status) {
                        console.log("ERROR");
                    });
                },
            logout: function() {
                    return $http.post($settings.root + 'logout')
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
                return $http.get($settings.root + 'event/list/'+query)
                    .error(function (data, status) {
                        console.log("ERROR");
                    });
            },
            get_events_by_creator: function() {
                return $http.get($settings.root + 'event/get_events_by_creator');
            },
            create: function(eventName, datetime) {

                //console.log(time);
                var params = {
                    eventName: eventName,
                    datetime: datetime
                };
                return $http.post($settings.root + 'event/create',params)
                    .success(function (data, status){
                        $location.path('event/' + data.event.slug);
                    })
                    .error(function (data, status){
                        console.log("ERROR");
                    });
            },
            join: function(slug) {
                socket.execute($settings.root + 'event/' + slug + '/subscribe');
                return $http.put($settings.root + 'event/' + slug + '/join');
            }
        };
    }]);

streamSyncServices.factory('song', ['$http', 'track', 'playersAPI',
    function($http, track, playersAPI) {

        var cur_track;
        var playlist = {
            isHost: false,
            id: 0
        };

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
            initializePlayers: function() {
                if (!playersAPI.youtube.isReady()) {
                    playersAPI.youtube.loadScript();
                }
                if (!playersAPI.soundcloud.isReady()) {
                    playersAPI.soundcloud.loadScript();
                }
            },
            search: {
                    youtube: function(query) {
                        return $http.get($settings.root + 'song/search/youtube/'+query);
                    },
                    soundcloud: function(query) {
                        return $http.get($settings.root + 'song/search/soundcloud/'+query);
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
                    return $http.post($settings.root + 'song/create/remote', song);
                },

            initializeTrack: function(song, callback) {
                    switch (song.source) {
                        case 'youtube':
                            playersAPI.youtube.doWhenReady(function() {
                                cur_track = new track.youtube(song, callback);
                            });
                            break;
                        case 'soundcloud':
                            playersAPI.soundcloud.doWhenReady(function() {
                                cur_track = new track.soundcloud(song, callback);
                            });
                            break;
                        default:
                            console.log(song.source + ' is and invalid source');
                            break;
                    }
                },
            play: function() {
                    cur_track.play();
                },
            pause: function() {
                    cur_track.pause();
                },
            stop: function() {
                    cur_track.stop();
                },
            seek: function(ms) {
                    cur_track.seek(ms);
                },
            getTime: function() {
                    return cur_track.getTime();
                }
        };
    }]);

streamSyncServices.factory('playlist', ['$http', '$location', 'socket', 'song', 'time', 'ntp',
    function($http, $location, socket, song, time, ntp){

        ntp.init();

        var observerCallback = false;
        function notifyObserver() {
            if (observerCallback) {
                observerCallback();
            }
        }

        var isHost = false;

        var timeUpdate = {
            happening: false,
            playlist: null,
            publish: {
                update: function(ms) {
                var updatedTime = typeof ms == 'undefined' ? this.playlist.curTime.real : ms;
                socket.execute($settings.root + 'playlist/' + this.playlist.id + '/sync', {
                        songTime: updatedTime,
                        hostTime: ntp.getTime(),
                        current: this.playlist.current,
                        isPlaying: this.playlist.isPlaying
                    });
                },
                pause: function() {
                    socket.execute($settings.root + 'playlist/' + this.playlist.id + '/pause', {
                        songTime: this.playlist.curTime.real,
                        hostTime: ntp.getTime(),
                        current: this.playlist.current,
                        isPlaying: this.playlist.isPlaying
                    });
                }
            },
            update: function() {
                this.playlist.curTime.real = song.getTime();
                if (isHost) {
                    this.publish.update();
                }
                notifyObserver();
            },
            init: function(playlist) {
                this.playlist = playlist;
                this.publish.playlist = playlist;
                playlist.curDuration = {
                    real: playlist.songs[playlist.current].duration,
                    pretty: time.prettify(playlist.songs[playlist.current].duration)
                };
                var offset = playlist.isPlaying ? playlist.hostTime - ntp.getTime() : 0;
                playlist.songTime = offset + playlist.songTime;
                playlist.curTime = {
                    real: playlist.songTime
                };
            },
            start: function() {
                var self = this;
                this.happening = setInterval(function() {
                    self.update();
                }, 100);
            },
            stop: function() {
                clearInterval(this.happening);
                this.happening = false;
            }
        };

        var service = {
            instance: false,
            watch: function(callback) {
                observerCallback = callback;
                callback();
            },
            set: function(playlist, userIsHost) {
                this.instance = playlist;
                this.instance.isReady = false;
                isHost = userIsHost;
                notifyObserver();
                this.layTrack();
            },
            addSong: function(song) {
                return $http.put($settings.root + 'playlist/' + this.instance.id + '/addSong', {song: song});
            },
            layTrack: function() {
                var current = this.instance.current;
                if (current > -1) {
                    var self = this;
                    song.initializeTrack(this.instance.songs[current], function() {
                        self.instance.isReady = true;
                        timeUpdate.init(self.instance);
                        if (self.instance.isPlaying) {
                            self.play();
                        } else {
                            self.pause();
                        }
                        self.seek(self.instance.songTime);
                        notifyObserver();
                    });
                }
            },
            play: function () {
                this.instance.isPlaying = true;
                timeUpdate.start();
                song.play();
                notifyObserver();
            },
            pause: function () {
                this.instance.isPlaying = false;
                timeUpdate.stop();
                if (isHost) {
                    timeUpdate.publish.pause();
                }
                song.pause();
                notifyObserver();
            },
            stop: function () {
                song.stop();
                timeUpdate.stop();
                observerCallback = false;
            },
            seek: function(ms) {
                song.seek(ms);
                if (isHost) {
                    timeUpdate.publish.update(ms);
                }
                this.instance.curTime.real = ms;
                notifyObserver();
            }
        };

        var socketFuncs = {
            song_added: function(data) {
              service.instance.songs = data.songs;
            },
            initialized: function(data) {
              service.instance.current = 0;
              service.layTrack();
            },
            time_update: function(data) {
                if (!isHost) {
                    if (Math.abs(service.instance.curTime.real - data.time) > 200) {
                        service.seek(data.time);
                    }
                }
            },
            pause: function(data) {
                if (!isHost) {
                    service.pause();
                }
            }
        };

        socket.on('message', function(message) {
            if (message.model == 'playlist') {
                socketFuncs[message.data.meta](message.data);
                notifyObserver();
            }
        });

        return service;
    }]);

streamSyncServices.factory('memberlist', ['$http','$location', 'socket',
    function($http, $location, socket){

        var observerCallback = false;
        function notifyObserver() {
            if (observerCallback) {
                observerCallback();
            }
        }

        var user = {};

        var service = {
            instance: false,
            watch: function(callback) {
                observerCallback = callback;
                callback();
            },
            set: function(memberlist, curUser) {
                this.instance = memberlist;
                user = curUser;
                notifyObserver();
            },
            leave: function() {
                observerCallback = false;
            }
        };

        var socketFuncs = {
            user_added: function(data) {
                service.instance.members = data.members;
            }
        };

        socket.on('message', function(message) {
            if (message.model == 'memberlist') {
                socketFuncs[message.data.meta](message.data);
                notifyObserver();
            }
        });

        return service;
    }]);

streamSyncServices.factory('track', [
    function () {

        var track;

        function YTtrack(song, callback) {
            track = this;
            this.song = song;
            this.isReady = false;
            this.isPlaying = false;
            this.callback = callback;
            this.player = new YT.Player('ytplayer', {
                height: 0,
                width: 0,
                videoId: song.source_id,
                events: {
                    'onReady': track.onReady,
                    'onStateChange': track.doubleCheck
                }
            });
        }

        YTtrack.prototype = {
            onReady: function() {
                track.isReady = true;
                track.callback();
            },
            doubleCheck: function(event) {
                if(event.data == YT.PlayerState.PLAYING && !track.isPlaying) {
                    track.pause();
                }
            },
            play: function() {
                if (this.isReady) {
                    this.isPlaying = true;
                    this.player.playVideo();
                }
            },
            pause: function() {
                if (this.isReady) {
                    this.isPlaying = false;
                    this.player.pauseVideo();
                }
            },
            stop: function() {
                this.player.stopVideo();
            },
            seek: function(ms) {
                if (this.isReady) {
                    this.player.seekTo(ms/1000);
                }
            },
            getTime: function() {
                if (this.isReady) {
                    return this.player.getCurrentTime()*1000;
                } else {
                    return 0;
                }
            }
        };

        function SCtrack(song, callback) {
            track = this;
            this.song = song;
            this.isReady = false;
            this.isPlaying = false;
            SC.stream('/tracks/'+song.source_id, function(player) {
                track.player = player;
                track.isReady = true;
                callback();
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
            },
            seek: function(ms) {
                if (this.isReady) {
                    this.player.setPosition(ms);
                }
            },
            getTime: function() {
                if (this.isReady) {
                    return this.player.position;
                } else {
                    return 0;
                }
            }
        };

        return {
            youtube: YTtrack,
            soundcloud: SCtrack
        };

    }]);

streamSyncServices.factory('playersAPI', [
    function () {
        return {
            youtube: {
                loadScript: function() {
                    var firstScriptTag = document.getElementsByTagName('script')[0];
                    var youtube_tag = document.createElement('script');
                    youtube_tag.src = "https://www.youtube.com/iframe_api";
                    firstScriptTag.parentNode.insertBefore(youtube_tag, firstScriptTag);

                    // initialization check
                    var self = this;
                    setTimeout(function() {
                        if (!self.isReady()) {
                            console.log('youtube could not be initialized');
                        }
                    }, 20000);
                },
                onReady: function() {
                    $initializers.onReadyApply($initializers.youtube);
                },
                doWhenReady: function(fn, args) {
                    $initializers.doWhenReadyApply($initializers.youtube, fn, args);
                },
                isReady: function() {
                    return $initializers.youtube.isReady;
                }
            },
            soundcloud: {
                loadScript: function() {
                    var firstScriptTag = document.getElementsByTagName('script')[0];
                    var soundcloud_tag = document.createElement('script');
                    soundcloud_tag.src = "https://connect.soundcloud.com/sdk.js";
                    firstScriptTag.parentNode.insertBefore(soundcloud_tag, firstScriptTag);
                    this.init();
                },
                SCfound: function () {
                    return (typeof SC != 'undefined');
                },
                isReady: function() {
                    return $initializers.soundcloud.isReady;
                },
                init: function () {
                    var self = this;
                    var SC_check = setInterval(function() {
                        if (self.SCfound()) {
                            clearInterval(SC_check);
                            SC.initialize({
                                client_id: '9be920a0587219cd0d35a351b4366c5d'
                            });
                            self.onReady();
                        }
                    }, 100);
                    setTimeout(function() {
                        if (!self.isReady) {
                            console.log('soundcloud could not be initialized');
                            clearInterval(SC_check);
                        }
                    }, 20000);
                },
                onReady: function() {
                    $initializers.onReadyApply($initializers.soundcloud);
                },
                doWhenReady: function(fn, args) {
                    $initializers.doWhenReadyApply($initializers.soundcloud, fn, args);
                }
            }
        };
    }]);

streamSyncServices.factory('phonegap', [
    function () {

        return {
            onReady: function() {
                $initializers.onReadyApply($initializers.phonegap);
            },
            doWhenReady: function(fn, args) {
                $initializers.doWhenReadyApply($initializers.phonegap, fn, args);
            },
            isReady: function() {
                return $initializers.soundcloud.isReady;
            }
        };
    }]);

streamSyncServices.factory('time', [
    function() {
        var divisors = [1000, 60, 60];
        return {
            prettify: function(ms, places) {
                var segments = [];
                if (typeof places == 'undefined') {
                    places = 2;
                }
                for (var i = 0; i < divisors.length; i++) {
                    segments.push(Math.floor(ms % divisors[i]));
                    ms = ms / divisors[i];
                }
                var result = "";
                var segment = "";
                for (var j = 0; j < places; j++) {
                    segment = segments[divisors.length-j-1];
                    if (segment < 10) {
                        result = result + 0;
                    }
                    result = result + segment;
                    if (j < places - 1) {
                        result = result + ':';
                    }
                }
                return result;
            }
        };
    }]);

streamSyncServices.factory('ntp', ['socket',
    function(socket) {
        var offsets = [];

        var onSync = function (data) {
            var diff = Date.now() - data.t1 + ((Date.now() - data.t0)/2);
            offsets.unshift(diff);
            if (offsets.length > 10) {
              offsets.pop();
            }
        }; 

        var sync = function () {
            socket.emit('ntp:client_sync', { t0 : Date.now() });
        };

        return {
            init: function() {
                socket.execute($settings.root + 'ntp/sync');
                socket.on('ntp:server_sync', function(data) {
                    onSync(data);
                });
                setInterval(sync, 1000);
            },
            offset: function() {
                var sum = 0;
                for (var i = 0; i < offsets.length; i++)
                    sum += offsets[i];

                sum /= offsets.length;
                return sum;
            },
            getTime: function() {
                return Date.now() + this.offset();
            }
        };
    }]);