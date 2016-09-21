(function() {
  "use strict";
  
  var Repository = require(
    "./Repository").Repository, Util = require("../libs/Util").Util;
  
  var WishRepository = exports.WishRepository = function() {
    this.key = "wish";
    this.collecion = "wish";
    this.ttl = 604800;
  };
  
  Util.extend(WishRepository, Repository);
})();
