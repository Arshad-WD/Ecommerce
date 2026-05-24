const AppError = require('../common/errors/app-error');
const prisma = require('../prisma/prisma.service');

class ProductService {
  async getProducts(query) {
    const {
      search,
      category,
      sort,
      page = 1,
      limit = 10,
    } = query;

    const skip =
      (Number(page) - 1) * Number(limit);

    const where = {
      isActive: true,
    };

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    let orderBy = {
      createdAt: 'desc',
    };

    if (sort === 'price_asc') {
      orderBy = {
        price: 'asc',
      };
    }

    if (sort === 'price_desc') {
      orderBy = {
        price: 'desc',
      };
    }


    const [products, total] =
      await Promise.all([
        prisma.product.findMany({
          where,

          include: {
            images: true,
            category: true,
          },

          skip,

          take: Number(limit),

          orderBy,
        }),

        prisma.product.count({
          where,
        }),
      ]);

    return {
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(
          total / Number(limit)
        ),
      },
    };
  }

<<<<<<< HEAD

  async getProductById(idOrSlug) {
    const product =
      await prisma.product.findFirst({
        where: {
          OR: [
            { id: idOrSlug },
            { slug: idOrSlug },
          ],
        },

=======
  async getProductById(idOrSlug) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    const product =
      await prisma.product.findFirst({
        where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
>>>>>>> origin/main
        include: {
          images: true,
          category: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async createProduct(data) {
    const product =
      await prisma.product.create({
        data: {
          name: data.name,

          slug: data.slug,

          description: data.description,

          price: data.price,

          discountPrice:
            data.discountPrice,

          stockQuantity:
            data.stockQuantity,

          sku: data.sku,

          categoryId:
            data.categoryId,
        },
      });

    return product;
  }

  async updateProduct(id, data) {
    const product =
      await prisma.product.update({
        where: {
          id,
        },

        data,
      });

    return product;
  }

  async deleteProduct(id) {
    await prisma.product.delete({
      where: {
        id,
      },
    });

    return true;
  }
}

module.exports = new ProductService();