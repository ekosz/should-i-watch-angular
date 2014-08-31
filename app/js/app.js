'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.factories',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/search.html', controller: 'SearchCtrl'});
  $routeProvider.when('/movie/:id', {templateUrl: 'partials/movie.html', controller: 'MovieCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
