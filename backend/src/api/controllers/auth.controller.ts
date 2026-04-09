import type { Context } from 'hono';
import { authService } from '../../services/auth.service.js';

export class AuthController {
  async register(c: Context) {
    try {
      const data = await c.req.json();
      const result = await authService.register(data);
      return c.json({ success: true, data: result }, 201);
    } catch (err: any) {
      console.error('Registration Error:', err);
      return c.json({ success: false, message: err.message }, 400);
    }
  }

  async login(c: Context) {
    try {
      const data = await c.req.json();
      const result = await authService.login(data);
      return c.json({ success: true, data: result });
    } catch (err: any) {
      return c.json({ success: false, message: err.message }, 401);
    }
  }

  async googleAuth(c: Context) {
    try {
      const { idToken } = await c.req.json();
      const result = await authService.googleAuth(idToken);
      return c.json({ success: true, data: result });
    } catch (err: any) {
      return c.json({ success: false, message: err.message }, 401);
    }
  }
}

export const authController = new AuthController();
