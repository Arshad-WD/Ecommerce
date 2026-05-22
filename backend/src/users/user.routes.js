const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const selfOrAdminMiddleware = require(
  '../middlewares/self-or-admin.middleware'
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