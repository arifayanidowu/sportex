const ExpressRedisCache = require("express-redis-cache");

const cache = ExpressRedisCache({
  expire: 10,
  host:
    process.env.NODE_ENV === "production"
      ? process.env.REDIS_URL
      : "http://localhost",
});

module.exports = cache;
