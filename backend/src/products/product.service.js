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

  async getProductById(idOrSlug) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    const product =
      await prisma.product.findFirst({
        where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
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
    let slug = data.slug;
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    let sku = data.sku;
    const existingSku = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingSku) {
      sku = `${sku}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const product =
      await prisma.product.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          price: data.price,
          discountPrice: data.discountPrice,
          stockQuantity: data.stockQuantity,
          sku,
          categoryId: data.categoryId,
        },
      });

    return product;
  }

  async updateProduct(id, data) {
    if (data.slug) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          slug: data.slug,
          NOT: {
            id,
          },
        },
      });

      if (existingProduct) {
        data.slug = `${data.slug}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }

    if (data.sku) {
      const existingSku = await prisma.product.findFirst({
        where: {
          sku: data.sku,
          NOT: {
            id,
          },
        },
      });

      if (existingSku) {
        data.sku = `${data.sku}-${Math.floor(100 + Math.random() * 900)}`;
      }
    }

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
    // 1. Check if product is bound to active customer orders
    const orderItemsCount = await prisma.orderItem.count({
      where: {
        productId: id,
      },
    });

    if (orderItemsCount > 0) {
      // 2. Soft-delete to preserve billing records & foreign key integrity
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
    } else {
      // 3. Complete hard-delete safely clearing child review/cart nodes first
      await prisma.review.deleteMany({ where: { productId: id } });
      await prisma.cartItem.deleteMany({ where: { productId: id } });
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.product.delete({
        where: { id },
      });
    }

    return true;
  }
}

module.exports = new ProductService();