const addressService = require('./address.service');

class AddressController {
  async getAddresses(req, res, next) {
    try {
      const addresses = await addressService.getAddresses(req.user.id);
      res.status(200).json({
        success: true,
        data: addresses
      });
    } catch (error) {
      next(error);
    }
  }

  async createAddress(req, res, next) {
    try {
      const address = await addressService.createAddress(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Address created successfully',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req, res, next) {
    try {
      const address = await addressService.updateAddress(req.user.id, req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req, res, next) {
    try {
      await addressService.deleteAddress(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        message: 'Address deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async setDefaultAddress(req, res, next) {
    try {
      const address = await addressService.setDefaultAddress(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        message: 'Default address set successfully',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AddressController();
