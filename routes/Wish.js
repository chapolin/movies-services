(function() {
  "use strict";
  
  module.exports = function (app) {
    var Redis = require("../libs/RedisCache").RedisCache, redis = new Redis(), 
        WishRepository = require("../repository/Wish").WishRepository, 
        repository = new WishRepository(), Util = require("../libs/Util").Util,
        Wish = require("../models/Wish").Wish;
        
    // Crud wish insert: start
    app.post('/wish', function(request, response) {
      if(Util.attrExists(request.body, "userId") && 
        Util.attrExists(request.body, "movieId") && 
        Util.attrExists(request.body, "isWish")) {
        
        var userId = request.body.userId, isWish = request.body.isWish,
            movieId = parseInt(request.body.movieId),
            wish = new Wish(userId, movieId);

        repository.checkIfMovieExists(userId, movieId, function(exists) {
          repository.eraseAll(userId);
          
          if(exists && !isWish) {
            repository.deleteByMovieId(userId, movieId, function(data) {
              response.json(data);
            });
          } else if(!exists && isWish) {
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
    
    // Crud wish delete: start
    app.delete('/wish/:id', function(request, response) {
      if(Util.attrExists(request.params, "id")) {
        repository.delete(request.params.id, function(data) {
          response.json(data);
        });
      } else {
        response.json({error: "WishId not found!"});
      }
    });
    // Crud wish delete: end
    
    // Crud wishList list all: start
    app.post('/wishes', function(request, response) {
      if(Util.attrExists(request.body, "uid")) {
        repository.getAll("userId", request.body.uid, function(wishList) {
          response.json(wishList);
        });
      }
    });
    // Crud wishList all: end
  };
})();
