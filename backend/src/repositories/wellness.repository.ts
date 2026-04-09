import { prisma } from '../lib/prisma';
import type { WellnessLogDTO } from '../models/wellness.schema';

export class WellnessRepository {
  async createLog(userId: string, data: WellnessLogDTO) {
    return prisma.wellnessLog.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async getLogsByUser(userId: string) {
    return prisma.wellnessLog.findMany({
      where: { userId },
      orderBy: { loggedAt: 'desc' },
    });
  }
}

export const wellnessRepository = new WellnessRepository();
