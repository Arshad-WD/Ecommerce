const bcrypt = require('bcrypt');
const prisma = require('../prisma/prisma.service');

const {
    generateAccessToken,
    generateRefreshToken
} = require('./jwt.strategy');

class AuthService {
    async signup(data) {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: hashedPassword,
            },
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                ),
            },
        });

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    async login(data) {
        const user = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if(!user){
            throw new Error("Invalid Credentails");
        }
        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.passwordHash
        );

        if(!isPasswordValid){
            throw new Error("Invalid Credentials");
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                ),
            },
        });

        return {
            user,
            accessToken,
            refreshToken,
        };
    }
}

module.exports = new AuthService();