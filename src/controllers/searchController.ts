import { Request, Response, NextFunction } from 'express';
import users from '../models/users';
import * as jwt from 'jsonwebtoken';
const { JWT_SECRET } = require('../config');

export class SearchController {

  public static async searchByName(req: Request, res: Response, next: NextFunction) {
    try {

      const name = req.params.query;

      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing search query' });
      }


      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
      }

      let decodedToken;
      try {
        decodedToken = jwt.verify(token, JWT_SECRET) as { phoneNumber: string };
        const tokenVerified = await users.find({ phoneNumber: decodedToken.phoneNumber });

        if (!tokenVerified || tokenVerified.length < 1) {
          return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        let user: any = await users.find({ name: { $regex: new RegExp(name, 'i') } });

        if (user.length === 0) {
          return res.status(404).json({ message: 'No users found' });
        }

        user = JSON.parse(JSON.stringify(user));
        user.forEach(obj => {
          delete obj.password;
        });
        res.status(202).json({ statusCode: 200, data: user });

      }
      catch (error) {
        console.log("err token verification", error)
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Unauthorized: Token expired' });
        }
        throw error; // Forward other JWT verification errors to the global error handler

      }
    } catch (error) {
      console.error('Error searching for users:', error);
      next(error);
    }
  }

}