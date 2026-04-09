import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { zValidator } from '@hono/zod-validator';
import { WellnessLogSchema } from '../../models/wellness.schema';
import { wellnessController } from '../controllers/wellness.controller';

const wellness = new Hono();

// Protect all routes in this group
wellness.use('/*', jwt({
  secret: process.env.JWT_SECRET || 'super-secret-zenflow-key',
}));

wellness.post('/log', zValidator('json', WellnessLogSchema), wellnessController.createLog);
wellness.get('/dashboard', wellnessController.getDashboard);

export default wellness;
