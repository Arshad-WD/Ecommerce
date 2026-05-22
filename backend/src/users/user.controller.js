const userService = require('./user.service');

class UserController {
  async getUserById(req, res) {
    try {
      const user =
        await userService.getUserById(
          req.params.id
        );

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser =
        await userService.updateUser(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();