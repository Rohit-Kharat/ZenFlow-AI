import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { zValidator } from '@hono/zod-validator';
import { WellnessLogSchema } from '../../models/wellness.schema.js';
import { wellnessController } from '../controllers/wellness.controller.js';

const wellness = new Hono();

// Protect all routes in this group
wellness.use('/*', jwt({
  secret: process.env.JWT_SECRET || 'super-secret-zenflow-key',
  alg: 'HS256',
}));

wellness.post('/log', zValidator('json', WellnessLogSchema), wellnessController.createLog);
wellness.get('/dashboard', wellnessController.getDashboard);

export default wellness;
