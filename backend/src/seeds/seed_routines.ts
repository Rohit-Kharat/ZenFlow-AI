import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function seedRoutines() {
  try {
    const routinesPath = path.join(__dirname, 'yoga_routines.json');
    const routines = JSON.parse(fs.readFileSync(routinesPath, 'utf8'));

    console.log(`Found ${routines.length} routines. Seeding into MongoDB via Prisma...`);

    for (const routine of routines) {
      const existing = await prisma.yogaRoutine.findFirst({
        where: { title: routine.title, userId: null }
      });

      if (existing) {
        await prisma.yogaRoutine.update({
          where: { id: existing.id },
          data: {
            description: routine.description,
            tags: routine.tags,
            steps: routine.steps
          }
        });
        console.log(`Updated: ${routine.title}`);
      } else {
        await prisma.yogaRoutine.create({
          data: {
            title: routine.title,
            description: routine.description,
            tags: routine.tags,
            steps: routine.steps,
            userId: null
          }
        });
        console.log(`Created: ${routine.title}`);
      }
    }

    console.log('Seeding complete! ZenFlow is now pure logic-based.');
  } catch (error) {
    console.error('Error seeding routines:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedRoutines();
