import OpenAI from 'openai';
import { MongoClient } from 'mongodb';
import { wellnessService } from './wellness.service';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mongoClient = new MongoClient(process.env.DATABASE_URL || '');

export class AIService {
  async getYogaRecommendation(userId: string, query: string) {
    const wellnessData = await wellnessService.getDashboardData(userId);
    
    // 1. Generate embedding for user query
    const queryEmbeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    const queryVector = queryEmbeddingResponse.data[0].embedding;

    // 2. Perform Vector Search on MongoDB
    await mongoClient.connect();
    const db = mongoClient.db();
    const collection = db.collection('YogaRoutine');

    const searchResults = await collection.aggregate([
      {
        "$vectorSearch": {
          "index": "vector_index", // The name of the Atlas vector index
          "path": "vectors",
          "queryVector": queryVector,
          "numCandidates": 100,
          "limit": 3
        }
      },
      {
        "$project": {
          "title": 1,
          "description": 1,
          "tags": 1,
          "score": { "$meta": "vectorSearchScore" }
        }
      }
    ]).toArray();

    // 3. Construct Context-Aware Prompt
    const context = searchResults.map(r => `${r.title}: ${r.description}`).join('\n');
    
    const prompt = `
      You are ZenFlow AI, an expert yoga and mental wellness guide.
      
      User Context:
      - Recent mood average: ${wellnessData.averageMood}/10
      - User Query: "${query}"
      
      Retrieved Yoga Routines from Knowledge Base:
      ${context}
      
      Based on this context, recommend ONE specific routine from the list provided or adapt it.
      Provide an empathetic, calming explanation first, then the routine steps.
      Format the response as JSON with "explanation" and "routine" (array of { pose: string, duration: string }).
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "system", content: "You are a wellness AI expert." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }
}

export const aiService = new AIService();
