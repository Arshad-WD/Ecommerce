const prisma = require('../prisma/prisma.service');
const AppError = require('../common/errors/app-error');

class AddressService {
  async getAddresses(userId) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createAddress(userId, data) {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const count = await prisma.address.count({ where: { userId } });
    const isDefault = count === 0 ? true : !!data.isDefault;

    return prisma.address.create({
      data: {
        userId,
        fullName: data.fullName,
        mobileNumber: data.mobileNumber,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        landmark: data.landmark || null,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        addressType: data.addressType || 'HOME',
        isDefault
      }
    });
  }

  async updateAddress(userId, id, data) {
    const address = await prisma.address.findFirst({
      where: { id, userId }
    });

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    if (data.isDefault && !address.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    return prisma.address.update({
      where: { id },
      data: {
        fullName: data.fullName,
        mobileNumber: data.mobileNumber,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 !== undefined ? data.addressLine2 : undefined,
        landmark: data.landmark !== undefined ? data.landmark : undefined,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        addressType: data.addressType,
        isDefault: data.isDefault
      }
    });
  }

  async deleteAddress(userId, id) {
    const address = await prisma.address.findFirst({
      where: { id, userId }
    });

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    await prisma.address.delete({
      where: { id }
    });

    if (address.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: { userId }
      });
      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true }
        });
      }
    }

    return { success: true };
  }

  async setDefaultAddress(userId, id) {
    const address = await prisma.address.findFirst({
      where: { id, userId }
    });

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });

    return prisma.address.update({
      where: { id },
      data: { isDefault: true }
    });
  }
}

module.exports = new AddressService();
