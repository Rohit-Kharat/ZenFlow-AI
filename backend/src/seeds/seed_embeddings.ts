import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new MongoClient(process.env.DATABASE_URL || '');

async function seedRoutines() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('YogaRoutine');

    const routines = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'yoga_routines.json'), 'utf8')
    );

    console.log(`Found ${routines.length} routines. Seeding into MongoDB...`);

    for (const routine of routines) {
      // Upsert into MongoDB without embeddings
      await collection.updateOne(
        { title: routine.title },
        { 
          $set: { 
            ...routine, 
            userId: null
          } 
        },
        { upsert: true }
      );

      console.log(`Seeded: ${routine.title}`);
    }

    console.log('Seeding complete! ZenFlow is now pure logic-based.');
  } catch (error) {
    console.error('Error seeding routines:', error);
  } finally {
    await client.close();
  }
}

seedRoutines();
