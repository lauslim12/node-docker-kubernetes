const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// Specific routes.
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/profile', authMiddleware.checkLoggedUser, userController.profile);

// General route.
router
  .route('/')
  .get(
    authMiddleware.checkLoggedUser,
    authMiddleware.routeGuard('admin'),
    userController.getAllUsers
  )
  .post(
    authMiddleware.checkLoggedUser,
    authMiddleware.routeGuard('admin'),
    userController.register
  );

// Dynamic route.
router
  .route('/:id')
  .get(
    authMiddleware.checkLoggedUser,
    authMiddleware.routeGuard('admin'),
    userController.getUser
  )
  .patch(
    authMiddleware.checkLoggedUser,
    authMiddleware.routeGuard('admin'),
    userController.updateUser
  )
  .delete(
    authMiddleware.checkLoggedUser,
    authMiddleware.routeGuard('admin'),
    userController.deleteUser
  );

module.exports = router;
