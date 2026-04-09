import { wellnessRepository } from '../repositories/wellness.repository';
import type { WellnessLogDTO } from '../models/wellness.schema';

export class WellnessService {
  async logWellness(userId: string, data: WellnessLogDTO) {
    // We can add business logic here (e.g., mood detection or habit analysis later)
    return wellnessRepository.createLog(userId, data);
  }

  async getDashboardData(userId: string) {
    const logs = await wellnessRepository.getLogsByUser(userId);
    // Aggregate data for dashboard analytics
    const averageMood = logs.length > 0 
      ? logs.reduce((acc, log) => acc + log.moodScore, 0) / logs.length 
      : 0;
    
    return {
      recentLogs: logs.slice(0, 7),
      averageMood,
      totalEntries: logs.length,
    };
  }
}

export const wellnessService = new WellnessService();
