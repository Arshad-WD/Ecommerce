const AppError = require('../common/errors/app-error');
const bcrypt = require('bcrypt');
const prisma = require('../prisma/prisma.service');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
            throw new AppError('User already exists', 400);
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
            throw new AppError("Invalid Credentails", 400);
        }
        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.passwordHash
        );

        if(!isPasswordValid){
            throw new AppError("Invalid Credentials", 401);
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
    async getMe(userId){
        const user = await prisma.user.findUnique({

            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatarUrl: true,
                createdAt: true,
                addresses: true,
            },
        });

        if (!user) {
            throw new AppError('User not found', 401);
        }

        return user;
    }

    async refreshToken(token) {
        if(!token){
            throw new AppError('Refresh token missing', 401);
        }

        const storedToken = await prisma.refreshToken.findFirst({
            where: {
                token, 
                revoked: false,
            },
        });

        if(!storedToken){
            throw new AppError('Invalid refresh Token', 401);
        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
        });

        if(!user){
            throw new AppError('User not found', 404);
        }

        const newAccessToken = generateAccessToken(user);

        return {
            accessToken: newAccessToken,
        };
    }

    async logout(refreshToken){
        await prisma.refreshToken.updateMany({
            where: {
                token: refreshToken,
            },
            data: {
                revoked: true,
            },
        });

        return true;
    }

    async forgotPassword(email){
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if(!user){
            throw new AppError('User not found', 404);
        }

        const resetToken = crypto
        .randomBytes(32)
        .toString('hex');

        const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token: resetToken,
                expiresAt,
            },
        });

        //TODO:
        //Send email using Resend Later

        return {
            resetToken,
        };
    }

    async resetPassword(token, newPassword){
        const resetToken = 
        await prisma.passwordResetToken.findFirst({
            where: {
                token, 
                used: false,
            },
        });

        if(!resetToken){
            throw new AppError('Invalid token', 401);
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await prisma.user.update({
            where: {
                id: resetToken.userId,
            },
            data: {
                passwordHash: hashedPassword,
            },
        });

        await prisma.passwordResetToken.update({
            where: {
                id: resetToken.id,
            },
            data: {
                used: true,
            },
        });
        return true;
    }
}

module.exports = new AuthService();
