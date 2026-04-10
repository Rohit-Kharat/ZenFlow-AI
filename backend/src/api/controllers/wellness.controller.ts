import type { Context } from 'hono';
import { wellnessService } from '../../services/wellness.service.js';
import { recommendationEngine } from '../../services/recommendation.engine.js';
import { prisma } from '../../lib/prisma.js';

export class WellnessController {
  async createLog(c: Context) {
    const data = await c.req.json();
    const payload = c.get('jwtPayload') as { sub: string };
    const userId = payload.sub; 
    
    // 1. Log the wellness data
    const log = await wellnessService.logWellness(userId, data);
    
    // 2. Generate Logic-Based Recommendation
    let recommendation = null;
    try {
      recommendation = await recommendationEngine.getRoutine(data.moodScore, data.sleepHours);
      
      // 3. Persist recommendation to user's profile
      if (recommendation) {
        // Upsert a personalized routine record for the user
        const existingRoutine = await prisma.yogaRoutine.findFirst({
          where: { userId: userId }
        });

        if (existingRoutine) {
          await prisma.yogaRoutine.update({
            where: { id: existingRoutine.id },
            data: {
              title: "Your Suggested Flow",
              description: recommendation.explanation,
              steps: recommendation.routine
            }
          });
        } else {
          await prisma.yogaRoutine.create({
            data: {
              userId: userId,
              title: "Your Suggested Flow",
              description: recommendation.explanation,
              steps: recommendation.routine,
              tags: ["personalized"]
            }
          });
        }
      }
    } catch (err) {
      console.error('Recommendation Logic Error:', err);
    }
    
    return c.json({ 
      success: true, 
      data: {
        log,
        recommendation
      }
    }, 201);
  }

  async getDashboard(c: Context) {
    const payload = c.get('jwtPayload') as { sub: string };
    const userId = payload.sub;
    
    const dashboardData = await wellnessService.getDashboardData(userId);
    return c.json({ success: true, data: dashboardData });
  }
}

export const wellnessController = new WellnessController();
