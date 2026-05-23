require('dotenv').config();
const bcrypt = require('bcrypt');
const prisma = require('../prisma/prisma.service');

const categories = [
  { name: 'Essentials', slug: 'essentials' },
  { name: 'Outerwear', slug: 'outerwear' },
  { name: 'Tailoring', slug: 'tailoring' },
  { name: 'Footwear', slug: 'footwear' },
  { name: 'Accessories', slug: 'accessories' },
];

const products = [
  {
    name: 'Atelier Heavyweight Oversized Tee',
    slug: 'atelier-heavyweight-oversized-tee',
    categorySlug: 'essentials',
    description: 'Cut from substantial 300gsm dry-cotton jersey. Features a boxy silhouette, dropped shoulders, and a thick ribbed collar that holds its shape. A cornerstone of the minimalist daily uniform.',
    price: 95,
    discountPrice: 80,
    stockQuantity: 24,
    sku: 'ATL-HVY-TEE-001',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000',
    ],
  },
  {
    name: 'Monomatic Brushed Calf Leather Jacket',
    slug: 'monomatic-brushed-calf-leather-jacket',
    categorySlug: 'outerwear',
    description: 'Expertly tailored from full-grain vegetable-tanned calf leather. Features customized matte black hardware, double-stitched paneling, and a Japanese cupro lining for an extremely smooth, premium feel.',
    price: 890,
    discountPrice: null,
    stockQuantity: 7,
    sku: 'MNM-CALF-JKT-002',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&q=80&w=1000',
    ],
  },
  {
    name: 'Sculpted Silhouette Wool Blazer',
    slug: 'sculpted-silhouette-wool-blazer',
    categorySlug: 'tailoring',
    description: 'A sharp, double-breasted blazer constructed from premium Italian virgin wool. Features clean structured shoulders, notched lapels, and subtle welt pockets. Tailored to perfection for a timeless shape.',
    price: 480,
    discountPrice: 420,
    stockQuantity: 12,
    sku: 'SCL-WOOL-BLZ-003',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000',
    ],
  },
  {
    name: 'Minimalist Technical Cargo Pant',
    slug: 'minimalist-technical-cargo-pant',
    categorySlug: 'essentials',
    description: 'Constructed from lightweight, water-resistant Japanese nylon ripstop. Features articulated knees for maximum mobility, invisible zippered side utility pockets, and adjustable toggle hems.',
    price: 180,
    discountPrice: null,
    stockQuantity: 15,
    sku: 'MNM-TECH-CRG-004',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1000',
    ],
  },
  {
    name: 'Atelier Brushed Suede Sneaker',
    slug: 'atelier-brushed-suede-sneaker',
    categorySlug: 'footwear',
    description: 'Handcrafted in Italy using exceptionally soft premium calf suede. Features a stitched margom rubber cupsole, minimalist blind eyelets, and natural calfskin lining for ultimate comfort and durability.',
    price: 290,
    discountPrice: 240,
    stockQuantity: 9,
    sku: 'ATL-BRSH-SDE-005',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000',
    ],
  },
  {
    name: 'Matte Brushed Titanium Chronograph',
    slug: 'matte-brushed-titanium-chronograph',
    categorySlug: 'accessories',
    description: 'An elegant utility accessory featuring a sandblasted titanium casing, a premium scratch-resistant sapphire crystal lens, and a high-accuracy Swiss quartz movement. Waterproof up to 50 meters.',
    price: 520,
    discountPrice: null,
    stockQuantity: 5,
    sku: 'MTE-BRSH-TTN-006',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=1000',
    ],
  },
  {
    name: 'Atelier Cashmere Oversized Hoodie',
    slug: 'atelier-cashmere-oversized-hoodie',
    categorySlug: 'essentials',
    description: 'Knit from pure, ethically sourced Mongolian cashmere. Incredibly lightweight yet provides exceptional warmth. Features double-faced hood construction, ribbed cuffs, and clean minimal side slit pockets.',
    price: 320,
    discountPrice: 280,
    stockQuantity: 16,
    sku: 'ATL-CSHM-HDE-007',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1517242046021-82ee12d03b14?auto=format&fit=crop&q=80&w=1000',
    ],
  },
  {
    name: 'Atelier Leather Duffle Bag',
    slug: 'atelier-leather-duffle-bag',
    categorySlug: 'accessories',
    description: 'A spacious travel bag built from pebbled French calfskin leather. Designed with a structured baseline, heavy-duty gunmetal zipper, detatchable padded shoulder strap, and dedicated internal laptop sleeve.',
    price: 450,
    discountPrice: null,
    stockQuantity: 8,
    sku: 'ATL-LTHR-DFL-008',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=1000',
    ],
  },
];

async function main() {
  console.log('Seeding categories...');
  const catMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
      },
    });
    catMap[cat.slug] = created.id;
  }

  console.log('Seeding products...');
  for (const prod of products) {
    const categoryId = catMap[prod.categorySlug];
    
    // Create product
    const createdProduct = await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {
        price: prod.price,
        discountPrice: prod.discountPrice,
        stockQuantity: prod.stockQuantity,
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        discountPrice: prod.discountPrice,
        stockQuantity: prod.stockQuantity,
        sku: prod.sku,
        categoryId,
      },
    });

    // Seed images
    await prisma.productImage.deleteMany({
      where: { productId: createdProduct.id },
    });

    for (let i = 0; i < prod.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          imageUrl: prod.images[i],
          isPrimary: i === 0,
          sortOrder: i,
        },
      });
    }
  }

  console.log('Seeding users...');
  const userPasswordHash = await bcrypt.hash('user123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  const customer = await prisma.user.upsert({
    where: { email: 'user@ecommerce.com' },
    update: { passwordHash: userPasswordHash },
    create: {
      name: 'Julian Sterling',
      email: 'user@ecommerce.com',
      passwordHash: userPasswordHash,
      role: 'USER',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: { passwordHash: adminPasswordHash },
    create: {
      name: 'Super Admin',
      email: 'admin@ecommerce.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  console.log('Cleaning existing orders and addresses for seed customer...');
  await prisma.payment.deleteMany({
    where: { order: { userId: customer.id } },
  });
  await prisma.orderItem.deleteMany({
    where: { order: { userId: customer.id } },
  });
  await prisma.order.deleteMany({
    where: { userId: customer.id },
  });
  await prisma.address.deleteMany({
    where: { userId: customer.id },
  });

  console.log('Seeding addresses...');
  const address = await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: 'Julian Sterling',
      mobileNumber: '+1 234 567 8900',
      addressLine1: '144 Crosby Street, Suite 4B',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      postalCode: '10012',
      addressType: 'HOME',
      isDefault: true,
    },
  });

  console.log('Seeding orders...');
  const seededProducts = await prisma.product.findMany({ take: 2 });
  if (seededProducts.length > 0) {
    const totalAmount = seededProducts.reduce((sum, p) => sum + Number(p.price), 0);

    const order = await prisma.order.create({
      data: {
        userId: customer.id,
        shippingAddressId: address.id,
        billingAddressId: address.id,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        totalAmount,
        placedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    });

    for (const p of seededProducts) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: p.id,
          productName: p.name,
          productPrice: p.price,
          quantity: 1,
          subtotal: p.price,
        },
      });
    }

    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'RAZORPAY',
        transactionId: 'TXN-MOCK-' + Math.floor(Math.random() * 100000),
        amount: totalAmount,
        currency: 'INR',
        status: 'PAID',
        paidAt: new Date(),
      },
    });
  }

  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
