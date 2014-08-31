'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('SearchCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.searching = false;

    $scope.search = function() {
      var self = this,
          request = {'params': {'s': $scope.query}};

      $scope.searching = true;

      $http.get('http://www.omdbapi.com', request).success(function(data){
        $scope.movies = data.Search;
        $scope.searching = false;
      });
    };

    $scope.goToMovie = function(imdbID) {
      $location.path('/movie/' + imdbID);
    };
  }])

  .controller('MovieCtrl', ['$scope', '$routeParams', 'Poster', 'Movie', function($scope, $routeParams, Poster, Movie) {
    $scope.loading = true;
    $scope.imdbID = 'http://imdb.com/title/' + $routeParams.id;

    Poster.find($routeParams.id).then(function(poster) {
      $scope.poster = poster;
    });

    Movie.find($routeParams.id).then(function(movie) {
      $scope.movie = movie;
      $scope.loading = false;
    });
  }]);
