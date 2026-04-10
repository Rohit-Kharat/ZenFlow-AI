import { wellnessRepository } from '../repositories/wellness.repository.js';
import type { WellnessLogDTO } from '../models/wellness.schema.js';
import { prisma } from '../lib/prisma.js';

export class WellnessService {
  async logWellness(userId: string, data: WellnessLogDTO) {
    return wellnessRepository.createLog(userId, data);
  }

  async getDashboardData(userId: string) {
    const logs = await wellnessRepository.getLogsByUser(userId);
    
    // Fetch the stored personalized recommendation
    const storedRoutine = await prisma.yogaRoutine.findFirst({
      where: { userId: userId },
      orderBy: { id: 'desc' } // Assuming newer ones are created if we didn't update
    });

    const recentRecommendation = storedRoutine ? {
      explanation: storedRoutine.description,
      routine: storedRoutine.steps as any || []
    } : null;
    
    // 1. Basic Aggregations
    const averageMood = logs.length > 0 
      ? logs.reduce((acc, log) => acc + log.moodScore, 0) / logs.length 
      : 0;
    
    // 2. 7-Day Trends (Daily average)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentLogs = logs.filter(log => new Date(log.loggedAt) >= sevenDaysAgo);
    
    // Group by date
    const dailyData: Record<string, { mood: number[], sleep: number[] }> = {};
    recentLogs.forEach(log => {
      const date = new Date(log.loggedAt).toISOString().split('T')[0];
      if (!dailyData[date]) dailyData[date] = { mood: [], sleep: [] };
      dailyData[date].mood.push(log.moodScore);
      dailyData[date].sleep.push(log.sleepHours);
    });

    const dailyTrends = Object.entries(dailyData).map(([date, values]) => ({
      date,
      avgMood: values.mood.reduce((a, b) => a + b, 0) / values.mood.length,
      avgSleep: values.sleep.reduce((a, b) => a + b, 0) / values.sleep.length
    })).sort((a, b) => a.date.localeCompare(b.date));

    // 3. Correlations (Mood vs Sleep)
    const correlations = logs.map(log => ({
      sleep: log.sleepHours,
      mood: log.moodScore
    }));

    // 4. Activity Distribution
    const activityCounts: Record<string, number> = {};
    logs.forEach(log => {
      if (log.activity) {
        activityCounts[log.activity] = (activityCounts[log.activity] || 0) + 1;
      }
    });
    const activityDistribution = Object.entries(activityCounts).map(([name, value]) => ({ name, value }));

    return {
      recentLogs: logs.slice(0, 7),
      averageMood,
      totalEntries: logs.length,
      recentRecommendation,
      analytics: {
        dailyTrends,
        correlations,
        activityDistribution
      }
    };
  }
}

export const wellnessService = new WellnessService();
