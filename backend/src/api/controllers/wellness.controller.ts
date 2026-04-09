import type { Context } from 'hono';
import { wellnessService } from '../../services/wellness.service.js';

export class WellnessController {
  async createLog(c: Context) {
    const data = await c.req.json();
    const payload = c.get('jwtPayload') as { sub: string };
    const userId = payload.sub; 
    
    const log = await wellnessService.logWellness(userId, data);
    return c.json({ success: true, data: log }, 201);
  }

  async getDashboard(c: Context) {
    const payload = c.get('jwtPayload') as { sub: string };
    const userId = payload.sub;
    
    const dashboardData = await wellnessService.getDashboardData(userId);
    return c.json({ success: true, data: dashboardData });
  }
}

export const wellnessController = new WellnessController();
