const selfOrAdminMiddleware = (
    req, res, next
) => {
    try{
        const loggedInUser = req.user;

        const requestedUserId = req.params.id;

        const isOwner = 
            loggedInUser.id === requestedUserId;

        const isAdmin =
            loggedInUser.role === 'ADMIN';
        if(!isOwner && !isAdmin) {
            return res.status(403).json({
                success: true,
                message: 'Access denied',
            });
        }

        next()
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = selfOrAdminMiddleware;