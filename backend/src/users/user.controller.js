const userService = require('./user.service');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const data = await userService.getAllUsers(req.query);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id);
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();