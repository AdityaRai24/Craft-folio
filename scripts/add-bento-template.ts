import { PrismaClient } from '@prisma/client';
import bentoData from '../lib/json/Bento.json';

const prisma = new PrismaClient();

async function main() {
  const template = await prisma.template.create({
    data: {
      name: 'Bento',
      description: 'A modern, grid-based portfolio template inspired by bento box designs. Perfect for showcasing multiple facets of your work in a clean, organized layout.',
      features: ['Grid Layout', 'Masonry Projects', 'Floating Dock', 'Dark Mode'],
      defaultContent: bentoData as any,
      previewImageUrl: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', // Placeholder
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'
      ],
      liveUrl: 'https://craftfolio.live/demo/bento'
    }
  });

  console.log('Created Bento template:', template);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
