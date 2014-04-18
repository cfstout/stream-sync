'use strict';

/* Directives */
var streamSyncDirectives = angular.module('streamSyncDirectives', []);

streamSyncDirectives.directive('eventListItem', [
    function () {
        return {
            restrict: 'E',
            scope: {
                event: '=',
                owned: '='
            },
            templateUrl: 'angular/templates/directive/eventListItem.html'
        };
    }]);