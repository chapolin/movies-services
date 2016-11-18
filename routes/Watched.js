(function() {
  "use strict";
  
  module.exports = function (app) {
    var Redis = require("../libs/RedisCache").RedisCache, redis = new Redis(), 
        WatchedRepository = require("../repository/Watched").WatchedRepository, 
        repository = new WatchedRepository(), Util = require("../libs/Util").Util,
        UserMovie = require("../models/UserMovie").UserMovie;
        
    // Crud watch insert: start
    app.post('/watch', function(request, response) {
      if(Util.attrExists(request.body, "userId") && 
        Util.attrExists(request.body, "movieId")) {
        
        var userId = request.body.userId, isWatch = request.body.status,
            movieId = parseInt(request.body.movieId),
            watch = new UserMovie(userId, movieId);

        repository.checkIfMovieExists(userId, movieId, function(exists) {
          repository.eraseAll(userId);
          
          if(exists && !isWatch) {
            repository.deleteByMovieId(userId, movieId, function(data) {
              response.json(data);
            });
          } else if(!exists && isWatch) {
            repository.insert(watch, function(data) {
              response.json(data);
            });
          } else {
            response.json({message: "Isn't necessary do nothing!"});
          }
        });
      } else {
        response.json({error: "invalid data!"});
      }
    });
    // Crud watch insert: end
    
    // Crud watchedList list all: start
    app.post('/watcheds', function(request, response) {
      if(Util.attrExists(request.body, "uid")) {
        repository.getAll("userId", request.body.uid, function(watchedList) {
          response.json(watchedList);
        });
      } else {
        response.json({error: "Watched list not found!"});
      }
    });
    // Crud watchedList all: end
  };
})();
