(function() {
  "use strict";
  
  var WishesController = require("../controller/Wishes").WishesController,
    controller = new WishesController();
  
  module.exports = function (app) {
    // Crud wish insert: start
    app.post('/wish', function(request, response) {
      controller.saveOrRemove(request, response);
    });
    // Crud wish insert: end
    
    // Crud wishList list all: start
    app.post('/wishes', function(request, response) {
      controller.getListFromUser(request, response);
    });
    // Crud wishList all: end
    
    // Crud wishList list all: start
    app.post('/admin/wishes', function(request, response) {
      controller.getListAll(request, response);
    });
    // Crud wishList all: end
  };
})();
