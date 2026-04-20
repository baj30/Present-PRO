import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from './models/User';

interface AuthPayload {
  userId: string;
  email: string;
}

class AuthenticationService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'default-secret';
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(payload: AuthPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' });
  }

  verifyToken(token: string): AuthPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as AuthPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async authenticateUser(email: string, password: string): Promise<string> {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await this.comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    return this.generateToken({ userId: user.id, email: user.email });
  }
}

export default new AuthenticationService();
