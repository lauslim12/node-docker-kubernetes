const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/userModel');

/**
 * Verifies a JWT - if it is valid or not.
 */
const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      resolve(decoded);
    });
  });

/**
 * Checks whether the user is logged in or not.
 * 1) Fetch the token, see if its valid.
 * 2) Verify the token.
 * 3) Check if the user still exists in the database.
 * 4) Grant user access to the route.
 */
exports.checkLoggedUser = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access!', 401)
    );
  }

  const verifiedToken = await verifyToken(token);
  const loggedUser = await User.findById(verifiedToken.id);

  if (!loggedUser) {
    return next(
      new AppError('User belonging to this token does not exist!', 401)
    );
  }

  req.user = loggedUser;
  next();
});

/**
 * Guard routes against any of unauthorized roles.
 */
exports.routeGuard = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError('You do not have permission to perform this action!', 403)
    );
  }

  next();
};
