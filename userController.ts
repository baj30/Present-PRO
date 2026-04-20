import { Request, Response, NextFunction } from 'express';
import userService from '../services/userService';
import { validateUserInput } from '../middleware/validators';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name } = req.body;
      
      validateUserInput({ email, password, name });
      
      const user = await userService.createUser({ email, password, name });
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await userService.getUserById(userId);
      
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      
      const user = await userService.updateUser(userId, updateData);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      await userService.deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
