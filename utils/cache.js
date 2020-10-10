const client = require("./redis");

const setCache = (name, timeout, data) => {
  return client.setex(name, timeout, JSON.stringify(data));
};
const getCache = (res, name, next) => {
  return client.get(name, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};

const deleteCache = (name) => {
  return client.del(name);
};

module.exports = {
  setCache,
  getCache,
  deleteCache,
};
