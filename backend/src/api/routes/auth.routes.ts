import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { RegisterSchema, LoginSchema, GoogleAuthSchema } from '../../models/auth.schema';
import { authController } from '../controllers/auth.controller';

const auth = new Hono();

auth.post('/register', zValidator('json', RegisterSchema), authController.register);
auth.post('/login', zValidator('json', LoginSchema), authController.login);
auth.post('/google', zValidator('json', GoogleAuthSchema), authController.googleAuth);

export default auth;
