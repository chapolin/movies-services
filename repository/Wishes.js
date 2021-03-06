(function() {
  "use strict";
  
  var Repository = require(
    "./Repository").Repository, Util = require("../libs/Util").Util,
  Redis = require("../libs/RedisCache").RedisCache, redis = new Redis(),
  _ = require("lodash");
  
  var WishesRepository = exports.WishesRepository = function() {
    this.key = "wishes";
    this.collecion = "wishes";
    this.ttl = 604800;
  };
  
  WishesRepository.prototype.insert = function(movie, callback) {
    var collection = global.mongo.collection(this.getCollection()), self = this;
    
    collection.insert(movie, {w:1}, function(error, data) {
        if(!error) {
          console.log("%s inserted!", self.getCollection());
        
          var key = self.getKey() + self.getSeparator() + movie.userId + "_" + movie.movieId;
          
          // Saving in redis
          redis.put(key, movie);
        }
        
        callback(data);
    });
  };
  
  WishesRepository.prototype.checkIfMovieExists = function(userId, movieId, callback) {
    var key = this.getKey() + this.getSeparator() + userId + "_" + movieId, self = this;
    
    redis.get(key, function(data) {
      if(data.hasOwnProperty("_id")) {
        callback(true);
      } else {
        var collection = global.mongo.collection(self.getCollection());

        collection.find({ userId: userId, movieId: movieId }).toArray(function(error, data) {
          if(_.get(data)) {
            if(data.length > 1) {
              for(var i = 1; i < data.length; i++) {
                if(data[i]) {
                  collection.remove({_id: global.mongodb.ObjectID(data[i]._id)});
                }
              }
            }
            
            redis.put(key, data[0]);
            
            callback(true);
          } else {
            callback(false);    
          }
        });  
      }
    });
  };
  
  WishesRepository.prototype.deleteByMovieId = function(userId, movieId, callback) {
    var collection = global.mongo.collection(this.getCollection()), self = this,
        keyRedis = this.getKey() + this.getSeparator() + userId + "_" + movieId;
    
    collection.remove({movieId: movieId}, function(error, data) {
      if(!error) {
        data = JSON.parse(data) || {};
        
        if(data.ok == 1 && data.n == 1) {
          console.log("%s removed!", self.getCollection());
          
          // Removing Redis
          redis.remove(keyRedis);
        }
      }
      
      callback(data);
    });
  };
  
  Util.extend(WishesRepository, Repository);
})();
