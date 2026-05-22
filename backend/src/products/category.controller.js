const categoryService = require(
  './category.service'
);

class CategoryController {
  async getCategories(req, res, next) {
    try {
      const categories =
        await categoryService.getCategories();

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const category =
        await categoryService.getCategoryById(
          req.params.id
        );

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const category =
        await categoryService.createCategory(
          req.body
        );

      res.status(201).json({
        success: true,
        message: 'Category created',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const category =
        await categoryService.updateCategory(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        message: 'Category updated',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      await categoryService.deleteCategory(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message: 'Category deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();