const AppError = require('../errors/app-error');

const adminMiddleware = (req, res, next) => {
    try {
        if(!req.user){
            throw new AppError('Unauthorized', 401);
        }

        if(req.user.role !== 'ADMIN'){
            throw new AppError('Access denied', 403);
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = adminMiddleware;