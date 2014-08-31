'use strict';

/* Factories */

angular.module('myApp.factories', [])
  .factory('Poster', ['$http', function($http) {
    var url = 'https://api.themoviedb.org/3/find/',
        request = { params: { 'api_key': 'xxx', 'external_source': 'imdb_id' } };

    function find(imbdID) {
      return $http.get(url + imbdID, request).then(parsePoster);
    }

    function parsePoster(data) {
      if (data.movie_results.length > 0) {
        var results = data.movie_results[0];
        var imageLocation = 'http://image.tmdb.org/t/p/original' + results.poster_path;
        var obj = {imageLocation: imageLocation};
        return obj;
      } else if (data.tv_results.length > 0) {
        var results = data.tv_results[0];
        var imageLocation = 'http://image.tmdb.org/t/p/original' + results.poster_path;
        var obj = {imageLocation: imageLocation};
        return obj;
      } else if (data.tv_season_results.length > 0) {
        var results = data.tv_season_results[0];
        var imageLocation = 'http://image.tmdb.org/t/p/original' + results.poster_path;
        var obj = {imageLocation: imageLocation};
        return obj;
      } else if (data.tv_episode_results.length > 0) {
        var results = data.tv_episode_results[0];
        var imageLocation = 'http://image.tmdb.org/t/p/original' + results.poster_path;
        var obj = {imageLocation: imageLocation};
        return obj;
      }
    }

    return {
      find: find
    }
  }])

  .factory('Movie', ['$http', function($http) {
    var url = 'http://www.omdbapi.com';

    function find(imbdID) {
      return $http.get(url, { params: { 'tomatoes': 'true', 'i': imbdID } }).then(parseMovie);
    }

    function parseMovie(result) {
      var data = result.data,
          totalScore = calculateScore(data);

      return {
        title: data.Title,
        shouldIWatch: recommendBasedOnScore(totalScore),
        year: data.Year,
        released: data.Released,
        runtime: data.Runtime,
        director: data.Director,
        writer: data.Writer,
        actors: data.Actors,
        plot: data.Plot,
        language: data.Language,
        rated: data.Rated,
        tomatoConsensus: data.tomatoConsensus,
        posterImage: data.Poster,
        totalScore: totalScore,
        tomatoMeter: data.tomatoMeter,
        tomatoRating: data.tomatoRating,
        tomatoVotes: data.tomatoReviews,
        tomatoUserMeter: data.tomatoUserMeter,
        tomatoUserRating: data.tomatoUserRating,
        tomatoUserVotes: data.tomatoUserReviews,
        imdbRating: data.imdbRating,
        imdbVotes: data.imdbVotes,
        metascore: data.Metascore,
        id: data.imdbID,
      };
    }

    function recommendBasedOnScore(totalScore) {
      if (totalScore < 10) {
        return 'If you like pain.';
      } else if (totalScore < 20) {
        return 'Stay away!';
      } else if (totalScore < 30) {
        return 'I hope you have nothing better to do.';
      } else if (totalScore < 40) {
        return 'Nope.';
      } else if (totalScore < 50) {
        return 'It might be watchable.';
      } else if (totalScore < 60) {
        return 'You may find some enjoyment.';
      } else if (totalScore < 70) {
        return "Give it a shot.";
      } else if (totalScore < 80) {
        return "It's pretty good.";
      } else if (totalScore < 90) {
        return "Definitely.";
      } else {
        return "Watch this now.";
      }
    }

    function calculateScore(data) {
      var tomatoMeter = parseInt(data.tomatoMeter);
      var tomatoRating = parseFloat(data.tomatoRating);
      if (data.tomatoReviews) {
        var tomatoVotes = parseInt(data.tomatoReviews.replace(/[^\d\.\-\ ]/g, ''));
      } else {
        var tomatoVotes = 0;
      }

      var tomatoUserMeter = parseInt(data.tomatoUserMeter);
      var tomatoUserRating = parseFloat(data.tomatoUserRating);
      if (data.tomatoUserReviews) {
        var tomatoUserVotes = parseInt(data.tomatoUserReviews.replace(/[^\d\.\-\ ]/g, ''));
      } else {
        var tomatoUserVotes = 0;
      }

      var metascore = parseInt(data.Metascore);

      var imdbRating = parseFloat(data.imdbRating);
      if (data.imdbVotes) {
        var imdbVotes = parseInt(data.imdbVotes.replace(/[^\d\.\-\ ]/g, ''));
      } else {
        var imdbVotes = 0;
      }

      var totalWeight = 0;
      var contributors = [];

      if (tomatoUserRating && tomatoUserVotes) {
        var ratingsWeight = 1;
        if (tomatoUserVotes < 5000) {
          ratingsWeight = (Math.pow(Math.E, (0.000921 * tomatoUserVotes)))/100;
        }
        var tomatoUserRatingScore = tomatoUserRating * 20 * 1.5 * ratingsWeight;
        contributors.push(tomatoUserRatingScore);
        totalWeight += 1.5 * ratingsWeight;
      }

      if (tomatoUserVotes && tomatoUserMeter) {
        var ratingsWeight = 1;
        if (tomatoUserVotes < 5000) {
          ratingsWeight = (Math.pow(Math.E, (0.000921 * tomatoUserVotes)))/100;
        }
        var tomatoUserMeterScore = tomatoUserMeter * 2 * ratingsWeight;
        contributors.push(tomatoUserMeterScore);
        totalWeight += 2 * ratingsWeight;
      }

      if (metascore) {
        var metascoreScore = parseFloat(metascore);
        contributors.push(metascoreScore);
        totalWeight += 1;
      }

      if (tomatoVotes && tomatoRating) {
        var ratingsWeight = 1;
        if (tomatoVotes < 60) {
          ratingsWeight = (Math.pow(Math.E, (0.076753 * tomatoVotes)))/100;
        }
        var tomatoRatingScore = tomatoRating * 10 * 2.5 * ratingsWeight;
        contributors.push(tomatoRatingScore);
        totalWeight += 2.5 * ratingsWeight;
      }

      if (tomatoVotes && tomatoMeter) {
        var ratingsWeight = 1;
        if (tomatoVotes < 60) {
          ratingsWeight = (Math.pow(Math.E, (0.076753 * tomatoVotes)))/100;
        }
        var tomatoMeterScore = tomatoMeter * 3.25 * ratingsWeight;
        contributors.push(tomatoMeterScore);
        totalWeight += 3.25 * ratingsWeight;
      }

      if (imdbVotes && imdbRating) {
        var ratingsWeight = 1;
        if (imdbVotes < 50000) {
          ratingsWeight = (Math.pow(Math.E, (0.000092 * imdbVotes)))/100;
        }
        var imdbRatingScore = imdbRating * 10 * 3 * ratingsWeight;
        contributors.push(imdbRatingScore);
        totalWeight += 3 * ratingsWeight;
      }

      if (contributors.length > 0) {
        var totalScore = contributors.reduce(function(a,b) { return a + b;}) / totalWeight;
      } else {
        var totalScore = 0;
      }

      return totalScore.toPrecision(3);
    }

    return {
      find: find
    };
  }]);
