<div align="center">

# 🛒 Modern E-Commerce Platform

A full-stack, highly scalable E-Commerce solution built with **Next.js 16** and **NestJS 11**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

</div>

## 📖 Overview

This project is a modern, high-performance E-Commerce platform designed to deliver a seamless shopping experience. The architecture is split into two robust parts:
- **Client (Frontend):** A responsive, fast, and SEO-friendly interface built with Next.js 16 (App Router), React 19, and Tailwind CSS.
- **Backend (API):** A scalable, secure, and modular REST API powered by NestJS 11, Prisma ORM, and JWT Authentication.

---

## ✨ Key Features

- **🛍️ Comprehensive Shopping Experience:** Browse products, add to cart, and checkout seamlessly.
- **🔐 Secure Authentication:** JWT-based auth utilizing Passport.js and Bcrypt for password hashing.
- **📦 Advanced Product Management:** Admin panel for managing inventory, categories, and orders.
- **☁️ Cloud Storage Integration:** Image uploads and asset management using Cloudinary & Minio.
- **🌓 Dark/Light Mode:** First-class support for theming via `next-themes`.
- **⚡ High Performance:** Next.js Server Components and optimized API endpoints.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** Next.js 16
- **UI Library:** React 19
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide React
- **Theming:** next-themes

### Backend (Server)
- **Framework:** NestJS 11 (Express under the hood)
- **Database ORM:** Prisma
- **Security & Auth:** Passport, JWT, Bcrypt, Helmet, CORS
- **File Storage:** Cloudinary, Minio, Multer
- **Testing:** Jest, Supertest

---

## 📂 Project Structure

```text
📦 Ecommerce
 ┣ 📂 client/        # Next.js frontend application
 ┃ ┣ 📂 app/         # Next.js App Router pages
 ┃ ┣ 📂 components/  # Reusable UI components
 ┃ ┗ 📜 package.json # Frontend dependencies
 ┣ 📂 backend/       # NestJS backend application
 ┃ ┣ 📂 src/         # API controllers, services, and modules
 ┃ ┣ 📂 prisma/      # Database schema and migrations
 ┃ ┗ 📜 package.json # Backend dependencies
 ┗ 📜 README.md      # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** or **pnpm**
- **PostgreSQL / MySQL** (configured via Prisma)

### 1. Clone the repository

```bash
git clone https://github.com/Arshad-WD/Ecommerce.git
cd Ecommerce
```

### 2. Setup the Backend

```bash
cd backend
npm install

# Setup Environment variables
# Create a .env file and add your database URL, JWT secrets, etc.

# Run database migrations
npx prisma db push # or prisma migrate dev

# Start the development server
npm run start:dev
```

### 3. Setup the Frontend

Open a new terminal window:

```bash
cd client
npm install

# Setup Environment variables
# Create a .env.local file for your frontend API URLs

# Start the Next.js development server
npm run dev
```

The application will now be running at:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:3001](http://localhost:3001) (or whichever port is configured)

---

## 📝 Environment Variables Setup

You'll need to set up `.env` files in both the `client` and `backend` directories.

**Backend (`backend/.env`) Example:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
CLOUDINARY_URL="cloudinary://..."
# Minio Config if applicable
MINIO_ENDPOINT="localhost"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
```

**Client (`client/.env.local`) Example:**
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

---

## 📄 License

This project is [UNLICENSED](LICENSE). All rights reserved.
