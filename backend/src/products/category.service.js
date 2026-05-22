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
      throw new Error('Category not found');
    }

    return category;
  }

  async createCategory(data) {
    const existingCategory =
      await prisma.category.findUnique({
        where: {
          slug: data.slug,
        },
      });

    if (existingCategory) {
      throw new Error(
        'Category slug already exists'
      );
    }

    const category =
      await prisma.category.create({
        data: {
          name: data.name,
          slug: data.slug,
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