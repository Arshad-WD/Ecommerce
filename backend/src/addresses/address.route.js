const express = require('express');
const router = express.Router();
const addressController = require(
  './address.controller'
);

const authMiddleware = require(
  '../middlewares/auth.middleware'
);

router.use(authMiddleware);

router.get(
  '/',
  addressController.getAddresses
);

router.post(
  '/',
  addressController.createAddress
);

router.put(
  '/:id',
  addressController.updateAddress
);

router.delete(
  '/:id',
  addressController.deleteAddress
);

router.patch(
  '/:id/default',
  addressController.setDefaultAddress
);

module.exports = router;