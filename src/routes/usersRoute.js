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
const cache = require("../utils/cache");

const router = express.Router();

router.post("/login", authUser);

router.post("/register", registerUser);

router.route("/").get(protect, admin, cache.route(), getUsers);

router.get("/profile/:id", protect, cache.route(), getUserProfile);

router
  .route("/:id")
  .put(protect, admin, updateUser)
  .get(protect, admin, cache.route(), getUserById)
  .delete(protect, admin, deleteUser);

module.exports = router;
