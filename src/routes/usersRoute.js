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

const router = express.Router();

router.post("/login", authUser);

router.post("/register", registerUser);

router.route("/").get(protect, admin, getUsers);

router.get("/profile/:id", protect, getCache, getUserProfile);

router
  .route("/:id")
  .put(protect, admin, updateUser)
  .get(protect, admin, getCache, getUserById)
  .delete(protect, admin, deleteUser);

module.exports = router;
