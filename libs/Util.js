(function() {
  "use strict";
  
  var _ = require("lodash");

  var Util = exports.Util = function () {
  };

  /**
  *  Extends one "class" with other "class" properties and methods.
  */
  Util.extend = function (receivingClass, givingClass) {
    if (arguments[2]) {
        for (var i=0, len=arguments.length; i<len; i++) {
            receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
        }
    } else {
        for (var methodName in givingClass.prototype) {
            if (!receivingClass.prototype[methodName]) {
                receivingClass.prototype[methodName] = givingClass.prototype[methodName];
            }
        }
    }
  };
  
  /**
  * Verify if field request is valid
  */
  Util.attrExists = function(object, attrName) {
  	if(_.get(object, attrName)) {
  		return true;
  	}
  	
  	return false;
  };
  
  Util.now = function() {
    var date = new Date();
    
    return Util.formatFullDate(date);
  };

  Util.formatFullDate = function(date) {
  	var day = Util.adjustingTimeValue(date.getDate()),
      	month = Util.adjustingTimeValue(date.getMonth(), true),
        hours = Util.adjustingTimeValue(date.getHours()),
        minutes = Util.adjustingTimeValue(date.getMinutes()),
        seconds = Util.adjustingTimeValue(date.getSeconds()),
      	year = date.getFullYear();

  	return year + "-" + month + "-" + day + " " + hours + ":" + 
           minutes + ":" + seconds;
  };
  
  Util.adjustingTimeValue = function(number, plusOne) {
    if(plusOne === true) {
      number++;
    }
    
    return (number <= 9 ? "0" : "") + number;
  };
  
  Util.isTrue = function(value) {
    var TRUTHY_VALUES = [true, 'true', 1, '1'];

    return TRUTHY_VALUES.some(function(t) {
        return t === value;
    });
  };
})();
