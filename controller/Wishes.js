(function() {
  "use strict";
  // Put in some constants file
  const KEY_ALL_WISHES = "*";
  
  var WishesRepository = require("../repository/Wishes").WishesRepository, 
      Util = require("../libs/Util").Util,
      UserMovie = require("../models/UserMovie").UserMovie;
  
  var WishesController = exports.WishesController = function() {
    this.repository = new WishesRepository();
  };
  
  WishesController.prototype.saveOrRemove = function(request, response) {
    if(Util.attrExists(request.body, "userId") && 
      Util.attrExists(request.body, "movieId")) {
        
      var userId = request.body.userId, isWish = request.body.status,
          movieId = parseInt(request.body.movieId),
          wish = new UserMovie(userId, movieId);

      this.repository.checkIfMovieExists(userId, movieId, function(exists) {
        this.repository.eraseAll(userId);
        this.repository.eraseAll(KEY_ALL_WISHES);
        
        if(exists && !Util.isTrue(isWish)) {
          this.repository.deleteByMovieId(userId, movieId, function(data) {
            response.json(data);
          });
        } else if(!exists && Util.isTrue(isWish)) {
          this.repository.insert(wish, function(data) {
            response.json(data);
          });
        } else {
          response.json({message: "Isn't necessary do nothing!"});
        }
      });
    } else {
      response.json({error: "invalid data!"});
    }
  };
  
  WishesController.prototype.getListFromUser = function(request, response) {
    if(Util.attrExists(request.body, "uid")) {
      this.repository.getAllByFieldAndValue("userId", request.body.uid, function(wishesList) {
        response.json(wishesList);
      });
    } else {
      response.json({error: "Wishes list not found!"});
    }
  };
  
  WishesController.prototype.getListAll = function(request, response) {
    this.repository.getAll(KEY_ALL_WISHES, function(wishesList) {
      response.json(wishesList);
    });
  };
})();
