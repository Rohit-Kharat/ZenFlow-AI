import { prisma } from '../lib/prisma.js';
import type { RegisterDTO } from '../models/auth.schema.js';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: RegisterDTO & { passwordHash?: string; authProvider?: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        authProvider: data.authProvider || 'local',
      },
    });
  }

  async upsertGoogleUser(email: string, name?: string) {
    return prisma.user.upsert({
      where: { email },
      update: { name },
      create: {
        email,
        name,
        authProvider: 'google',
      },
    });
  }
}

export const userRepository = new UserRepository();
