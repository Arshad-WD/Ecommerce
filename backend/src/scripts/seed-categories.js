// Seed script: Populates the categories table with atelier fashion collections
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { name: 'Outerwear',    slug: 'outerwear' },
  { name: 'Essentials',   slug: 'essentials' },
  { name: 'Tailoring',    slug: 'tailoring' },
  { name: 'Knitwear',     slug: 'knitwear' },
  { name: 'Accessories',  slug: 'accessories' },
  { name: 'Footwear',     slug: 'footwear' },
  { name: 'Denim',        slug: 'denim' },
  { name: 'Formalwear',   slug: 'formalwear' },
];

async function main() {
  console.log('🌱 Seeding categories...');

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug },
    });
    console.log(`  ✓ ${created.name} (${created.id})`);
  }

  console.log(`\n✅ Done — ${categories.length} categories seeded.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
