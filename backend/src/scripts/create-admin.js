require('dotenv').config();

const bcrypt = require('bcrypt');
const prisma = require('../prisma/prisma.service');

async function createAdmin() {
    try{
        const existingAdmin = 
            await prisma.user.findUnique({
                where: {
                    email: 'admin@ecommerce.com',
                },
            });

            if(existingAdmin){
                console.log('Admin already exists');
                process.exit(0);
            }

            const hashedPassword =
                await bcrypt.hash('admin123', 10);

            const admin = await prisma.user.create({
                data: {
                    name: 'Super Admin',
                    email: 'admin@ecommerce.com',
                    passwordHash: hashedPassword,
                    role: 'ADMIN',
                },
            });

            console.log('Admin created successfully');

            console.log(admin);

            process.exit(0);
    }catch(error){
        console.error(error);
        process.exit(1);
    }
}

createAdmin();