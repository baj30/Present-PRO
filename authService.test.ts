import authService from '../authService';
import * as userRepository from '../repositories/userRepository';

jest.mock('../repositories/userRepository');

describe('AuthenticationService', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hash = await authService.hashPassword(password);
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = authService.generateToken(payload);
      expect(token).toBeTruthy();
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = authService.generateToken(payload);
      const verified = authService.verifyToken(token);
      expect(verified.userId).toBe(payload.userId);
      expect(verified.email).toBe(payload.email);
    });

    it('should throw error for invalid token', () => {
      expect(() => authService.verifyToken('invalid-token')).toThrow();
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate user with correct credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        passwordHash: await authService.hashPassword('password123'),
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const token = await authService.authenticateUser('test@example.com', 'password123');
      expect(token).toBeTruthy();
    });

    it('should throw error for incorrect password', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        passwordHash: await authService.hashPassword('password123'),
      };

      (userRepository.findByEmail as jest.Mock).resolvedValue(mockUser);

      await expect(
        authService.authenticateUser('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid password');
    });
  });
});
