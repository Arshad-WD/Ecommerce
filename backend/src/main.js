require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

// Routers Imports
const authRoutes = require('./auth/auth.routes');
const userRoutes = require('./users/user.routes');
const productRoutes = require('./products/product.routes');
const cartRoutes = require('./cart/cart.routes');
const orderRoutes = require('./orders/order.routes');
const adminRoutes = require('./admin/admin.routes');

const errorMiddleware = require('./common/middleware/error.middleware');


const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));


// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// API Routes

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api/admin', adminRoutes);


// 404 Handler

app.use((req, res)=>{
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error Handler

app.use(errorMiddleware);

// Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});