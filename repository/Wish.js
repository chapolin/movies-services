(function() {
  "use strict";
  
  var Repository = require(
    "./Repository").Repository, Util = require("../libs/Util").Util;
  
  var WishRepository = exports.WishRepository = function() {
    this.key = "wish";
    this.collecion = "wish";
  };
  
  Util.extend(WishRepository, Repository);
})();
