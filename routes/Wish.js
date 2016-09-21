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
        Util.attrExists(request.body, "movieId")) {
          
        var wish = new Wish(request.body.userId, request.body.movieId);

        repository.insert(wish, function(data) {
          response.json(data);
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
    app.get('/wishes/:userId', function(request, response) {
      if(Util.attrExists(request.params, "userId")) {
        repository.getAll("userId", request.params.userId, function(wishList) {
          response.json(wishList);
        });
      }
    });
    // Crud wishList all: end
  };
})();
