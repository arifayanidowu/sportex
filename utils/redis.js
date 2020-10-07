const { createClient } = require("redis");

const client = createClient({
  port: 6379,
});

module.exports = client;
