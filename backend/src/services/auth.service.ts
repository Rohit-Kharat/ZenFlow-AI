import bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';
import { OAuth2Client } from 'google-auth-library';
import { userRepository } from '../repositories/user.repository';
import type { RegisterDTO, LoginDTO } from '../models/auth.schema';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-zenflow-key';

export class AuthService {
  async register(data: RegisterDTO) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(data.passwordHash || data.password, 10);
    const user = await userRepository.create({
      ...data,
      passwordHash,
    });

    const token = await this.generateToken(user.id);
    return { user, token };
  }

  async login(data: LoginDTO) {
    const user = await userRepository.findByEmail(data.email);
    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = await this.generateToken(user.id);
    return { user, token };
  }

  async googleAuth(idToken: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid Google token');
    }

    const user = await userRepository.upsertGoogleUser(payload.email, payload.name);
    const token = await this.generateToken(user.id);
    return { user, token };
  }

  private async generateToken(userId: string) {
    const payload = {
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 1 week
    };
    return sign(payload, JWT_SECRET);
  }
}

export const authService = new AuthService();
