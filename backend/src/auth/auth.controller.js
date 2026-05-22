const authService = require("./auth.service");

class AuthController {
    async signup(req, res){
        try {
            const result = await authService.signup(req.body);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result,
            });
        }catch(error){
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    async login(req, res){
        try{
            const result =  await authService.login(req.body);

            res.status(200).json({
                success: true,
                message: 'Login Successful',
                data: result,
            });
        }catch(error){
            res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }

    async me(req, res) {
        try {
            const user =  await authService.getMe(req.user.id);

            res.status(200).json({
                success: true,
                data: user,
            });
        }catch(error){
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async refreshToken(req, res) {
        try{
            const { refreshToken } = req.body;

            const result = await authService.refreshToken(
                refreshToken,
            );

            res.status(200).json({
                success: true,
                data: result,
            });

        }catch(error){
            res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }

    async logout(req, res) {
        try{
            const { refreshToken } = req.body;

            await authService.logout(refreshToken);

            res.status(200).json({
                success: true,
                message: 'Logged out successfully',
            });
        }catch(error){
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async forgetPassword(req, res) {
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
        }catch(error){
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    async resetPassword(req, res){
        try{
            await authService.resetPassword(
                req.params.token,
                req.body.password
            );

            res.status(200).json({
                success:true,
                message: 'Password reset successful',
            });
        }catch(error){
            res.status(400).json({
                success: false,
                message: error.message,                
            });
        }
    }
}

module.exports = new AuthController();