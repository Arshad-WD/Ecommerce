

const adminMiddleware = (req, res, next) => {
    try {
        if(!req.user){
            return res.status(401).json({
                success: true,
                message: 'Unauthorized',
            });
        }

        if(req.user.role !== 'ADMIN'){
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }
        next();
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = adminMiddleware;