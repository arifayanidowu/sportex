const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const genToken = require("../utils/genToken");

const errorHandler = require("../utils/errorHandler");
const { setCache } = require("../utils/cache");

/**
 * @description    Auth user & get token
 * @route   POST /api/users/login
 * @access  Public
 * @method POST
 * */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: genToken(user._id),
    });
  } else {
    return errorHandler(res, 401, "Failed to login user");
  }
});

/**
 * @description Register new User
 * @route /api/users/register
 * @access Public
 * @method POST
 */

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  if (!email || !name || !password) {
    return errorHandler(res, 400, "Kindly provide all required credentials.");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return errorHandler(res, 400, "User already exists.");
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: genToken(user._id),
    });
  } else {
    return errorHandler(res, 400, "Invalid user data.");
  }
});

/**
 * @description Get All Users
 * @route /api/users
 * @access Private/admin
 * @method GET
 */

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users) {
    setCache("users", users);
    res.json(users);
  } else {
    return errorHandler(res, 400, "Invalid user data.");
  }
});

/**
 * @description Get User By Id
 * @route /api/users/:id
 * @access Private/admin
 * @method GET
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    setCache(req.params.id, user);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    return errorHandler(res, 404, "User not found.");
  }
});

/**
 * @description Get User Profile
 * @route /api/users/profile/:id
 * @access Private
 * @method GET
 */

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    setCache(req.params.id, user);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    return errorHandler(res, 404, "User not found.");
  }
});

/**
 * @description Update User
 * @route /api/users/:id
 * @access Private/admin
 * @method PUT
 */

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin || user.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    return errorHandler(res, 404, "User not found.");
  }
});

/**
 * @description Delete User
 * @route /api/users/:id
 * @access Private/admin
 * @method DELETE
 */

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    return errorHandler(res, 404, "User not found.");
  }
});

module.exports = {
  authUser,
  registerUser,
  getUserProfile,

  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
