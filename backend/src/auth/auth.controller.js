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
}

module.exports = new AuthController();