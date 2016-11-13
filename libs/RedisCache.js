var redisConnection = null;
var redis = require('redis');
// .createClient(process.env.REDIS_URL);

var RedisCache = exports.RedisCache = function (properties) {
  if(!redisConnection) {
    // if(properties) {
    //   redisConnection = new Redis(properties);
    //   redisConnection = client;
    // } else {
    //   redisConnection = new Redis();
    // }
    
    redisConnection = redis.createClient(process.env.REDIS_URL);
    
    redisConnection.on("ready", function() {
			console.log("Redis is ready!");
		});
		
		redisConnection.on("end", function() {
			console.error("Could not connect to Redis: Connection refused");
		});
  }
  
  this.conn = redisConnection;
};

RedisCache.prototype.put = function(key, value, ttl) {
  if(!ttl) {
    this.conn.set(key, JSON.stringify(value));
  } else {
    this.conn.setex(key, ttl, JSON.stringify(value));
  }
};

RedisCache.prototype.get = function(key, callback) {
  this.conn.get(key, function(error, data) {
    if(data) {
      callback(JSON.parse(data));
    } else {
      callback({});
    }
  });
};

RedisCache.prototype.remove = function(key) {
  this.conn.del(key);
};

RedisCache.prototype.getAll = function(key, callback) {
  this.conn.keys(key, callback);
};

RedisCache.prototype.on = function (message, callback) {
  this.conn.on(message, callback);
};

RedisCache.prototype.publish = function (channel, message) {
  this.conn.publish(channel, message);
};
