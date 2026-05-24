const AppError = require('../common/errors/app-error');
const bcrypt = require('bcrypt');
const prisma = require('../prisma/prisma.service');

class UserService {
  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        mobileNumber: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async getAllUsers({ skip = 0, take = 50, search = '' } = {}) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          mobileNumber: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(take),
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async updateUser(id, data) {
    const updateData = {
      name: data.name,
      mobileNumber: data.mobileNumber,
      avatarUrl: data.avatarUrl,
    };

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        mobileNumber: true,
        avatarUrl: true,
        role: true,
      },
    });
  }

  async deleteUser(id) {
    await prisma.user.delete({ where: { id } });
    return true;
  }
}

module.exports = new UserService();