const adminService = require('./admin.service');

class AdminController {
  async getMe(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: req.user, 
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Analytics APIs ---
  async getAnalyticsOverview(req, res, next) {
    try {
      const data = await adminService.getAnalyticsOverview();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getSalesAnalytics(req, res, next) {
    try {
      const { range } = req.query; // e.g., '7d'
      const data = await adminService.getSalesAnalytics(range);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getTopProducts(req, res, next) {
    try {
      const data = await adminService.getTopProducts();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getRecentOrders(req, res, next) {
    try {
      const data = await adminService.getRecentOrders();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getInventoryAnalytics(req, res, next) {
    try {
      const data = await adminService.getInventoryAnalytics();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // --- Inventory APIs ---
  async getInventory(req, res, next) {
    try {
      const data = await adminService.getInventory(req.query);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async updateInventory(req, res, next) {
    try {
      const { productId } = req.params;
      const data = await adminService.updateInventory(productId, req.body);
      res.status(200).json({
        success: true,
        message: 'Inventory updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req, res, next) {
    try {
      const data = await adminService.getLowStock();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
