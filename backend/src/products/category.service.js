const AppError = require('../common/errors/app-error');
const prisma = require('../prisma/prisma.service');

class CategoryService {
  async getCategories() {
    const categories =
      await prisma.category.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

    return categories;
  }

  async getCategoryById(id) {
    const category =
      await prisma.category.findUnique({
        where: {
          id,
        },

        include: {
          products: true,
        },
      });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  async createCategory(data) {
    const slug = data.slug || data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const existingCategory =
      await prisma.category.findUnique({
        where: {
          slug,
        },
      });

    if (existingCategory) {
      throw new AppError('Category slug already exists', 400);
    }

    const category =
      await prisma.category.create({
        data: {
          name: data.name,
          slug,
        },
      });

    return category;
  }

  async updateCategory(id, data) {
    const category =
      await prisma.category.update({
        where: {
          id,
        },

        data: {
          name: data.name,
          slug: data.slug,
        },
      });

    return category;
  }

  async deleteCategory(id) {
    await prisma.category.delete({
      where: {
        id,
      },
    });

    return true;
  }
}

module.exports = new CategoryService();