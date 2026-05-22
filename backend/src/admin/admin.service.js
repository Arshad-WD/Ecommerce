const prisma = require('../prisma/prisma.service');

class AdminService {
  async getAnalyticsOverview() {
    const [totalSales, totalOrders, totalUsers] = await Promise.all([
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          paymentStatus: 'PAID',
        },
      }),
      prisma.order.count(),
      prisma.user.count({
        where: {
          role: 'USER',
        },
      }),
    ]);

    return {
      totalSales: totalSales._sum.totalAmount || 0,
      totalOrders,
      totalUsers,
    };
  }

  async getSalesAnalytics(range = '7d') {
    const days = parseInt(range) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sales = await prisma.order.findMany({
      where: {
        placedAt: {
          gte: startDate,
        },
        paymentStatus: 'PAID',
      },
      select: {
        totalAmount: true,
        placedAt: true,
      },
      orderBy: {
        placedAt: 'asc',
      },
    });

    // Grouping by date could be done here or on frontend
    return sales;
  }

  async getTopProducts(limit = 5) {
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId', 'productName'],
      _sum: {
        quantity: true,
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    return topProducts;
  }

  async getRecentOrders(limit = 10) {
    return prisma.order.findMany({
      take: limit,
      orderBy: {
        placedAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getInventoryAnalytics() {
    const [totalProducts, outOfStock, lowStock] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({
        where: {
          stockQuantity: 0,
        },
      }),
      prisma.product.count({
        where: {
          stockQuantity: {
            gt: 0,
            lte: 10, // Assuming 10 is low stock threshold
          },
        },
      }),
    ]);

    return {
      totalProducts,
      inStock: totalProducts - outOfStock,
      outOfStock,
      lowStock,
    };
  }

  async getInventory(query = {}) {
    const { skip = 0, take = 10, search = '' } = query;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        stockQuantity: true,
        isActive: true,
      },
      skip: parseInt(skip),
      take: parseInt(take),
      orderBy: {
        stockQuantity: 'asc',
      },
    });
  }

  async updateInventory(productId, data) {
    const { stockQuantity } = data;
    return prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: parseInt(stockQuantity),
      },
    });
  }

  async getLowStock(threshold = 10) {
    return prisma.product.findMany({
      where: {
        stockQuantity: {
          lte: threshold,
        },
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stockQuantity: true,
      },
      orderBy: {
        stockQuantity: 'asc',
      },
    });
  }
}

module.exports = new AdminService();

