const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/userModel');
const filterObject = require('../utils/filterObject');

/**
 * Gets all of the users in the database.
 */
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      data: users,
    },
  });
});

/**
 * Gets one user in the database.
 * Takes a single parameter: ':/id' in the URL.
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No users found with that ID!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

/**
 * Gets your own profile in the database.
 */
exports.profile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

/**
 * Registers a user. Remove the password before sending it to the user for safety.
 */
exports.register = asyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    fullName: req.body.fullName,
    address: req.body.address,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  });

  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    data: {
      data: newUser,
    },
  });
});

/**
 * Updates a single user in the database.
 * Takes a single parameter: ':/id' and the request body.
 * If the password is changed, hash it first before storing it.
 * Don't forget to prevent '_id' updates.
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  if (req.body.password) {
    req.body.password = await bcrypt(req.body.password, 12);
  }

  if (req.body._id) {
    req.body = filterObject(req.body, '_id');
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError('No users found with that ID!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: updatedUser,
    },
  });
});

/**
 * Deletes a single user.
 * Takes a single parameter: ':/id'.
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No users found with that ID!', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
