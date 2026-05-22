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
            },
        });

        return user;
    }

    async refreshToken(token) {
        if(!token){
            throw new Error('Refresh token missing');
        }

        const storedToken = await prisma.refreshToken.findFirst({
            where: {
                token, 
                revoked: false,
            },
        });

        if(!storedToken){
            throw new Error('Invalid refresh Token');
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
            throw new Error('User not found');
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
            throw new Error('User not found');
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
            throw new Error('Invalid token');
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await prisma.user.update({
            where: {
                id: resetToken.userId,
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
