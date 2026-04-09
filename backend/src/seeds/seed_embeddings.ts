import { MongoClient } from 'mongodb';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.DATABASE_URL || '');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function seedRoutines() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('YogaRoutine');

    const routines = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'yoga_routines.json'), 'utf8')
    );

    console.log(`Found ${routines.length} routines. Generating embeddings...`);

    for (const routine of routines) {
      // Generate embedding for the description and title
      const textToEmbed = `${routine.title}: ${routine.description} ${routine.tags.join(' ')}`;
      
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: textToEmbed,
      });

      const vector = embeddingResponse.data[0].embedding;

      // Upsert into MongoDB
      await collection.updateOne(
        { title: routine.title },
        { 
          $set: { 
            ...routine, 
            vectors: vector,
            userId: null // Seed data has no specific user
          } 
        },
        { upsert: true }
      );

      console.log(`Seeded: ${routine.title}`);
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding routines:', error);
  } finally {
    await client.close();
  }
}

seedRoutines();
