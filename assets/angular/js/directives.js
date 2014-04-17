'use strict';

/* Directives */
var streamSyncDirectives = angular.module('streamSyncDirectives',[])

streamSyncDirectives.directive('ssEventSongs', [
	function(){
		console.log("blah");
		return{
			restrict: 'AEC',
			scope:{
				playlistID: '=info'
			},
			templateUrl: 'angular/templates/directive/EventSongsTemplate.html'
		};
}]);
