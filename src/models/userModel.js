const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'A user must have a name!'],
  },
  address: {
    type: String,
    required: [true, 'A user must have an address!'],
  },
  username: {
    type: String,
    required: [true, 'A user must have a username!'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'A user must have a password!'],
    select: false,
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'A user is either a normal user, or an admin!',
    },
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

/**
 * Middleware to run if a password is changed.
 * Middlewares are only run on 'save' and 'create'.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Encrypt the password with BCRYPT Algorithm, then next middleware.
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * Static method to compare if a password is correct or not.
 */
userSchema.methods.isPasswordCorrect = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
