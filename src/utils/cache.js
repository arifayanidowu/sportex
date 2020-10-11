const ExpressRedisCache = require("express-redis-cache");

const cache = ExpressRedisCache({
  expire: 10,
});

module.exports = cache;
