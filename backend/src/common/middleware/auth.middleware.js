const jwt = require('jsonwebtoken');
const AppError = require('../errors/app-error');

const authMiddleware = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            throw new AppError('Access token missing', 401);
        }
        const token = authHeader.split(' ')[1];

        if(!token){
            throw new AppError('Invalid token format', 401);
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        req.user = decoded;

        next();
    }catch(error){
        next(new AppError('Unauthorized', 401));
    }
};


module.exports = authMiddleware;
