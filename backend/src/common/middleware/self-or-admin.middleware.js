const AppError = require('../errors/app-error');

const selfOrAdminMiddleware = (
    req, res, next
) => {
    try {
        const loggedInUser = req.user;
        const requestedUserId = req.params.id;

        const isOwner = loggedInUser.id === requestedUserId;
        const isAdmin = loggedInUser.role === 'ADMIN';

        if(!isOwner && !isAdmin) {
            throw new AppError('Access denied', 403);
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = selfOrAdminMiddleware;