const bcrypt = require('bcrypt');
const prisma = require('../prisma/prisma.service');

class UserService {
    async getUserById(id){
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
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

        if(!user){
            throw new Error('User not found');
        }
        return user;
    }

    async updateUser(id, data){
        const updateData = {
            name: data.name,
            mobileNumber: data.mobileNumber,
            avatarUrl: data.avatarUrl,
        };

        // optional password update
        if(data.password){
            const hashedPassword =
                await bcrypt.hash(data.password, 10);

            updateData.passwordHash =
                hashedPassword;
        }

        const updatedUser =
            await prisma.user.update({
                where: {
                    id,
                },
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

            return updatedUser;
    }

    async deleteUser(id) {
        await prisma.user.delete({
            where: {
                id,
            },
        });
        return true;
    }
}

module.exports = new UserService();