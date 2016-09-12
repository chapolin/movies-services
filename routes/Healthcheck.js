(function() {
  "use strict";
  
  module.exports = function (app) {
    // var Redis = require("../libs/RedisCache").RedisCache, redis = new Redis(), 
    //     SearchRepository = require("../repository/Search").SearchRepository, 
    //     repository = new SearchRepository(), Util = require("../libs/Util").Util,
    //     Search = require("../models/Search").Search;
        
    // Live route
    app.get('/live', function(request, response) {
      response.send("LIVE");
    });
  };
})();
