const { createClient } = require("redis");

const client = createClient({
  port: process.env.REDIS_PORT,
});

module.exports = client;
