const errorHandler = require("./errorHandler");
const client = require("./redis");

module.exports = {
  getCache: (req, res, next, key) => {
    const { id } = req.params;
    client.get(id, (err, reply) => {
      if (err) {
        return errorHandler(res, 400, "Could not get cached data");
      }
      if (reply === null) {
        next();
      } else {
        return reply;
      }
    });
  },
  setCache: (key = "", data) => {
    client.setex(key, 10, JSON.stringify(data));
  },
  delCache: (key = "") => {
    client.del(key);
  },
};
