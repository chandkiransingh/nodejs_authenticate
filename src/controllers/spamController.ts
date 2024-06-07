import { Response, NextFunction } from 'express';
import users from '../models/users';
import * as jwt from 'jsonwebtoken';
const { JWT_SECRET } = require('../config');

export class SpamController {

  public static async markAsSpam(req: any, res: Response, next: NextFunction) {

    try {
      const { phoneNumber, reason } = req.body;
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
      }

      const decodedToken = jwt.verify(token, JWT_SECRET) as { phoneNumber: string };

      const updatedUser = await users.findOneAndUpdate(
        { phoneNumber: decodedToken.phoneNumber },
        { $set: { 'spam': true, 'reason': reason } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ statusCode: 200, msg: 'User marked as spam' });
    } catch (error) {
      console.error('Error updating spam record:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
      next(error);
    }
  }
}