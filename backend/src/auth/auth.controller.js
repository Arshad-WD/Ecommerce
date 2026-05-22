const authService = require("./auth.service");

class AuthController {
    async signup(req, res, next) {
        try {
            const result = await authService.signup(req.body);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result,
            });
        }catch (error) {
      next(error);
    }
    }

    async login(req, res, next) {
        try{
            const result =  await authService.login(req.body);

            res.status(200).json({
                success: true,
                message: 'Login Successful',
                data: result,
            });
        }catch (error) {
      next(error);
    }
    }

    async me(req, res, next) {
        try {
            const user =  await authService.getMe(req.user.id);

            res.status(200).json({
                success: true,
                data: user,
            });
        }catch (error) {
      next(error);
    }
    }

    async refreshToken(req, res, next) {
        try{
            const { refreshToken } = req.body;

            const result = await authService.refreshToken(
                refreshToken,
            );

            res.status(200).json({
                success: true,
                data: result,
            });

        }catch (error) {
      next(error);
    }
    }

    async logout(req, res, next) {
        try{
            const { refreshToken } = req.body;

            await authService.logout(refreshToken);

            res.status(200).json({
                success: true,
                message: 'Logged out successfully',
            });
        }catch (error) {
      next(error);
    }
    }

    async forgetPassword(req, res, next) {
        try {
            const result = 
                await authService.forgetPassword(
                    req.body.email
                );

                res.status(200).json({
                    success: true,
                    message: 'Reset token generated',
                    data: result,
                });
        }catch (error) {
      next(error);
    }
    }

    async resetPassword(req, res, next) {
        try{
            await authService.resetPassword(
                req.params.token,
                req.body.password
            );

            res.status(200).json({
                success:true,
                message: 'Password reset successful',
            });
        }catch (error) {
      next(error);
    }
    }
}

module.exports = new AuthController();