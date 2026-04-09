import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { RegisterSchema, LoginSchema, GoogleAuthSchema } from '../../models/auth.schema.js';
import { authController } from '../controllers/auth.controller.js';

const auth = new Hono();

auth.post('/register', zValidator('json', RegisterSchema), authController.register);
auth.post('/login', zValidator('json', LoginSchema), authController.login);
auth.post('/google', zValidator('json', GoogleAuthSchema), authController.googleAuth);

export default auth;
