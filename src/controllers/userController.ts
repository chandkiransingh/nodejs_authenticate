import { Request, Response, NextFunction } from 'express';
import users from '../models/users';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
const { JWT_SECRET } = require('../config');

export class UserController {

  public static async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { phoneNumber, password } = req.body;
      const user: any | null = await users.findOne({ phoneNumber });

      if (!user) {
        return res.status(401).json({ error: 'Invalid phone number or password' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.status(401).json({ error: 'Invalid phone number or password' });
      }

      // If authentication is successful, generate a JSON Web Token (JWT)
      const token = jwt.sign({ phoneNumber: user.phoneNumber }, JWT_SECRET, {
        expiresIn: '10m'
      });

      // Return the token as a response
      res.status(200).json({ statusCode: 200, token });
    } catch (error) {
      console.error('Error logging in user:', error);
      next(error);
    }
  }

  public static async createUser(req: Request, res: Response, next: NextFunction) {

    try {
      const { name, phoneNumber, email, password } = req.body;
      const existingUser = await users.findOne({ phoneNumber });

      if (existingUser) {
        return res.status(400).json({ statusCode: 400, error: 'User with this phone number already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10); // Hash with salt rounds = 10

      const newUser: any = new users({
        name,
        phoneNumber,
        email,
        password: hashedPassword,
        spam: false
      });

      // Save the new user to the database
      const savedUser = await newUser.save();

      res.status(201).json({ statusCode: 201, message: 'User created successfully' });
    } catch (err) {
      const errorObj = { code: 500, error: 'Internal server error' };
      throw errorObj;
    }
  }

}