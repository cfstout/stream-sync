'use strict';

/* Services */

var streamSyncServices = angular.module('streamSyncServices', []);

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

streamSyncServices.factory('song', ['$http',
    function($http) {
        return {
            search_youtube: function(query) {
                    return $http.get('song/search/youtube/'+query);
                }
            };
    }]);