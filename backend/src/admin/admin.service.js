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
      totalSales: Number(totalSales._sum.totalAmount || 0),
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

    // Group by date to match frontend expectation
    const labels = [];
    const salesData = [];
    const ordersData = [];

    // Create a map for all days in range to ensure no gaps
    const dataMap = new Map();
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      dataMap.set(dateString, { sales: 0, orders: 0 });
    }

    sales.forEach(order => {
      const dateString = order.placedAt.toISOString().split('T')[0];
      if (dataMap.has(dateString)) {
        const current = dataMap.get(dateString);
        current.sales += Number(order.totalAmount || 0);
        current.orders += 1;
        dataMap.set(dateString, current);
      }
    });

    dataMap.forEach((value, key) => {
      labels.push(key);
      salesData.push(value.sales);
      ordersData.push(value.orders);
    });

    return {
      range,
      labels,
      sales: salesData,
      orders: ordersData
    };
  }

  async getTopProducts(limit = 5) {
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId', 'productName'],
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    // Fetch images and price for these products to match frontend requirements
    const productIds = topProducts.map(tp => tp.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, images: { take: 1 } }
    });

    const productMap = new Map(products.map(p => [p.id, p]));

    return topProducts.map(tp => {
      const p = productMap.get(tp.productId);
      return {
        id: tp.productId,
        name: tp.productName,
        price: p ? Number(p.price) : 0,
        salesCount: tp._sum.quantity || 0,
        revenue: Number(tp._sum.subtotal || 0),
        image: p?.images?.[0] || null
      };
    });
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
      totalItems: totalProducts,
      inStock: totalProducts - outOfStock,
      outOfStockItemsCount: outOfStock,
      lowStockItemsCount: lowStock,
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

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        stockQuantity: true,
        isActive: true,
        category: { select: { name: true } },
        images: { take: 1, select: { imageUrl: true } }
      },
      skip: parseInt(skip),
      take: parseInt(take),
      orderBy: {
        stockQuantity: 'asc',
      },
    });

    return products.map(p => ({
      productId: p.id,
      name: p.name,
      category: p.category?.name || 'Uncategorized',
      stock: p.stockQuantity,
      status: p.stockQuantity === 0 ? 'Out of Stock' : p.stockQuantity < 10 ? 'Low Stock' : 'In Stock',
      image: p.images?.[0] || null,
      sku: p.sku,
      price: Number(p.price),
      isActive: p.isActive
    }));
  }

  async updateInventory(productId, data) {
    const stockQuantity = data.stockQuantity ?? data.stock;
    return prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: parseInt(stockQuantity) || 0,
      },
    });
  }

  async getLowStock(threshold = 10) {
    const lowStockProducts = await prisma.product.findMany({
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
        images: { take: 1, select: { imageUrl: true } }
      },
      orderBy: {
        stockQuantity: 'asc',
      },
    });

    return lowStockProducts.map(p => ({
      productId: p.id,
      name: p.name,
      stock: p.stockQuantity,
      image: p.images?.[0] || null,
      sku: p.sku
    }));
  }
}

module.exports = new AdminService();

