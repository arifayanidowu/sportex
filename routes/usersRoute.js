const express = require("express");
const {
  authUser,
  registerUser,
  getUserProfile,

  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require("../controllers/userController");

const { protect, admin } = require("../middleware/auth");
const client = require("../utils/redis");
const router = express.Router();

const usersCache = (req, res, next) => {
  client.get("users", (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};

const userCache = (req, res, next) => {
  client.get("user", (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};

const updatedUserCache = (req, res, next) => {
  client.get("updatedUser", (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};

router.post("/login", authUser);

router.post("/", registerUser);

router.route("/").get(protect, admin, usersCache, getUsers);

router
  .route("/:id")
  .put(protect, admin, updatedUserCache, updateUser)
  .get(protect, admin, userCache, getUserById)
  .get(protect, admin, userCache, getUserProfile)
  .delete(protect, admin, deleteUser);

module.exports = router;
