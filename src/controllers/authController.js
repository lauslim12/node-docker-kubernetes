const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/userModel');

/**
 * Signs a new JWT - authorize it.
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

/**
 * Send a cookie, and secure it if its on a production environment.
 * Check if the connection is secure, OR if the header contains HTTPS.
 * Proxies are trusted and enabled -- look at app.js file for the configurations.
 */
const setUserCookies = (req, res, token) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  res.cookie('jwt', token, cookieOptions);
};

/**
 * Logs in a user, give the user both refresh token and access token.
 * Perform sanity checks to see if the request body is filled.
 * Check if genuine user exists.
 * Create a token, and set the user's cookies. Also remove passwords from output!
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Please provide a username and a password!', 401));
  }

  const user = await User.findOne({ username }).select('+password');

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    return next(new AppError('Incorrect username or password!', 401));
  }

  const token = signToken(user._id);
  setUserCookies(req, res, token);

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

/**
 * Logs out a user.
 */
exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};
