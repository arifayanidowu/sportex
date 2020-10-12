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
const { getCache } = require("../utils/cache");
const client = require("../utils/redis");

const router = express.Router();

const getAllUsersCache = (req, res, next) => {
  client.get("users", (err, reply) => {
    if (err) res.status(500).send(err);
    if (reply !== null) {
      return res.status(200).json(JSON.parse(reply));
    }
    next();
  });
};

router.post("/login", authUser);

router.post("/register", registerUser);

router.route("/").get(protect, admin, getAllUsersCache, getUsers);

router.get("/profile/:id", protect, getCache, getUserProfile);

router
  .route("/:id")
  .put(protect, admin, updateUser)
  .get(protect, admin, getCache, getUserById)
  .delete(protect, admin, deleteUser);

module.exports = router;
