const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../common/middleware/auth.middleware');
const adminMiddleware = require('../common/middleware/admin.middleware');

const selfOrAdminMiddleware = require(
  '../common/middleware/self-or-admin.middleware'
);

// Admin: list all users
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  userController.getAllUsers
);

router.get(
  '/:id',
  authMiddleware,
  selfOrAdminMiddleware,
  userController.getUserById
);

router.put(
  '/:id',
  authMiddleware,
  selfOrAdminMiddleware,
  userController.updateUser
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
);

module.exports = router;