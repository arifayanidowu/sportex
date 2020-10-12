const { createClient } = require("redis");

const client = createClient(process.env.REDIS_URL);

module.exports = client;
