(function() {
  "use strict";
  
  const KEY_ALL_WISHES = "*";
  
  module.exports = function (app) {
    var Redis = require("../libs/RedisCache").RedisCache, redis = new Redis(), 
        WishesRepository = require("../repository/Wishes").WishesRepository, 
        repository = new WishesRepository(), Util = require("../libs/Util").Util,
        UserMovie = require("../models/UserMovie").UserMovie;
        
    // Crud wish insert: start
    app.post('/wish', function(request, response) {
      if(Util.attrExists(request.body, "userId") && 
        Util.attrExists(request.body, "movieId")) {
          
        var userId = request.body.userId, isWish = request.body.status,
            movieId = parseInt(request.body.movieId),
            wish = new UserMovie(userId, movieId);

        repository.checkIfMovieExists(userId, movieId, function(exists) {
          repository.eraseAll(userId);
          repository.eraseAll(KEY_ALL_WISHES);
          
          if(exists && !Util.isTrue(isWish)) {
            repository.deleteByMovieId(userId, movieId, function(data) {
              response.json(data);
            });
          } else if(!exists && Util.isTrue(isWish)) {
            repository.insert(wish, function(data) {
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
    // Crud wish insert: end
    
    // Crud wishList list all: start
    app.post('/wishes', function(request, response) {
      if(Util.attrExists(request.body, "uid")) {
        repository.getAllByFieldAndValue("userId", request.body.uid, function(wishesList) {
          response.json(wishesList);
        });
      } else {
        response.json({error: "Wishes list not found!"});
      }
    });
    // Crud wishList all: end
    
    // Crud wishList list all: start
    app.post('/admin/wishes', function(request, response) {
      repository.getAll(KEY_ALL_WISHES, function(wishesList) {
        response.json(wishesList);
      });
    });
    // Crud wishList all: end
  };
})();
