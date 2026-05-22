# Ecommerce Backend API Testing Guide

# Base URL

```txt
http://localhost:5000
```

---

# Recommended API Testing Tool

Use:

* Postman
* Thunder Client (VSCode)
* Insomnia

Postman is recommended.

---

# Server Startup Checklist

Before testing APIs ensure:

## 1. Docker Containers Running

```bash
docker compose up -d
```

---

## 2. Backend Server Running

```bash
npm run dev
```

Expected:

```txt
Server running on port 5000
```

---

## 3. PostgreSQL Connected

Prisma should connect successfully.

---

## 4. MinIO Running

Visit:

```txt
http://localhost:9001
```

---

# AUTH APIs

---

# 1. Signup API

## Endpoint

```http
POST /api/auth/signup
```

## Full URL

```txt
http://localhost:5000/api/auth/signup
```

---

## Request Body

```json
{
  "name": "Arshad",
  "email": "arshad@test.com",
  "password": "123456"
}
```

---

## Expected Success Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "USER_ID"
    },
    "accessToken": "JWT_ACCESS_TOKEN",
    "refreshToken": "JWT_REFRESH_TOKEN"
  }
}
```

---

## Test Cases

### Valid signup

* Should create user

### Duplicate email

* Should return error

### Empty fields

* Should fail

### Weak password

* Should fail later after validation implementation

---

# 2. Login API

## Endpoint

```http
POST /api/auth/login
```

---

## Request Body

```json
{
  "email": "arshad@test.com",
  "password": "123456"
}
```

---

## Expected Response

```json
{
  "success": true,
  "data": {
    "accessToken": "TOKEN",
    "refreshToken": "TOKEN"
  }
}
```

---

## IMPORTANT

Save the access token.

You will use it in protected routes.

---

# 3. Get Current User

## Endpoint

```http
GET /api/auth/me
```

---

## Headers

```txt
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## Expected Response

```json
{
  "success": true,
  "data": {
    "id": "USER_ID",
    "name": "Arshad",
    "email": "arshad@test.com"
  }
}
```

---

## Test Cases

### Valid token

* Should return user

### Missing token

* Should return 401

### Invalid token

* Should return 401

---

# 4. Forgot Password

## Endpoint

```http
POST /api/auth/forgot-password
```

---

## Request Body

```json
{
  "email": "arshad@test.com"
}
```

---

## Expected Response

```json
{
  "success": true,
  "message": "Reset token generated"
}
```

---

# 5. Reset Password

## Endpoint

```http
POST /api/auth/reset-password/:token
```

---

## Example

```txt
/api/auth/reset-password/RESET_TOKEN
```

---

## Request Body

```json
{
  "password": "newpassword123"
}
```

---

# 6. Refresh Token

## Endpoint

```http
POST /api/auth/refresh-token
```

---

## Request Body

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

---

# 7. Logout

## Endpoint

```http
POST /api/auth/logout
```

---

## Request Body

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

---

# ADMIN TESTING

---

# Create Admin User

Run:

```bash
node src/scripts/create-admin.js
```

---

# Admin Login

## Endpoint

```http
POST /api/auth/login
```

---

## Body

```json
{
  "email": "admin@ecommerce.com",
  "password": "admin123"
}
```

---

## Expected

Admin JWT token returned.

---

# USER APIs

---

# 1. Get User Profile

## Endpoint

```http
GET /api/users/:id
```

---

## Headers

```txt
Authorization: Bearer TOKEN
```

---

## Rules

* Self can access
* Admin can access
* Other users cannot access

---

# 2. Update User

## Endpoint

```http
PUT /api/users/:id
```

---

## Body

```json
{
  "name": "Updated Name",
  "mobileNumber": "9999999999"
}
```

---

# 3. Delete User

## Endpoint

```http
DELETE /api/users/:id
```

---

## Rules

* Admin only

---

# CATEGORY APIs

---

# 1. Create Category

## Endpoint

```http
POST /api/categories
```

---

## Headers

```txt
Authorization: Bearer ADMIN_TOKEN
```

---

## Body

```json
{
  "name": "Electronics",
  "slug": "electronics"
}
```

---

# 2. Get Categories

## Endpoint

```http
GET /api/categories
```

---

# PRODUCT APIs

---

# 1. Create Product

## Endpoint

```http
POST /api/products
```

---

## Headers

```txt
Authorization: Bearer ADMIN_TOKEN
```

---

## Request Body

```json
{
  "name": "iPhone 15",
  "slug": "iphone-15",
  "description": "Apple smartphone",
  "price": 79999,
  "discountPrice": 74999,
  "stockQuantity": 20,
  "sku": "IPHONE15",
  "categoryId": "CATEGORY_ID"
}
```

---

# 2. Get Products

## Endpoint

```http
GET /api/products
```

---

# Search Example

```txt
/api/products?search=iphone
```

---

# Sort Example

```txt
/api/products?sort=price_asc
```

---

# Pagination Example

```txt
/api/products?page=1&limit=10
```

---

# 3. Update Product

## Endpoint

```http
PUT /api/products/:id
```

---

# 4. Delete Product

## Endpoint

```http
DELETE /api/products/:id
```

---

# PRODUCT IMAGE UPLOAD

---

# Upload Product Images

## Endpoint

```http
PATCH /api/products/:id/images
```

---

## Headers

```txt
Authorization: Bearer ADMIN_TOKEN
```

---

## Body Type

```txt
form-data
```

---

## Key

```txt
images
```

Type:

```txt
File
```

---

## Multiple Images

You can upload up to:

```txt
5 images
```

---

# CART APIs

---

# 1. Get Cart

## Endpoint

```http
GET /api/cart
```

---

## Headers

```txt
Authorization: Bearer TOKEN
```

---

# 2. Add Item To Cart

## Endpoint

```http
POST /api/cart/items
```

---

## Body

```json
{
  "productId": "PRODUCT_ID",
  "quantity": 2
}
```

---

# 3. Update Cart Quantity

## Endpoint

```http
PUT /api/cart/items/:productId
```

---

## Body

```json
{
  "quantity": 5
}
```

---

# 4. Remove Cart Item

## Endpoint

```http
DELETE /api/cart/items/:productId
```

---

# 5. Clear Cart

## Endpoint

```http
DELETE /api/cart
```

---

# IMPORTANT TESTING FLOW

Recommended order:

```txt
1. Signup
2. Login
3. Copy JWT token
4. Create category
5. Create product
6. Upload product image
7. Add product to cart
8. Update cart quantity
9. Clear cart
```

---

# COMMON ERRORS

# 401 Unauthorized

Cause:

* Missing JWT token
* Invalid token

---

# 403 Forbidden

Cause:

* User trying admin route

---

# 404 Not Found

Cause:

* Wrong route
* Resource not found

---

# 500 Internal Server Error

Cause:

* Backend crash
* DB issue
* Prisma issue

Check terminal logs.

---

# TESTING TIPS

## Always test:

* success case
* invalid input
* missing token
* wrong role
* invalid IDs
* negative quantity
* excessive stock quantity

---

# RECOMMENDED NEXT APIs

After current testing:

```txt
Checkout
Orders
Payments
Inventory
Analytics
```

These depend on all current modules working correctly.
