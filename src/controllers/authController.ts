// src/controllers/authController.ts
import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_EXPIRES_IN = '7d';

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;           // explicit void return
    }

    if (await User.findOne({ email })) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, hashedPassword: hash });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: JWT_EXPIRES_IN });

    // **don’t return the response**—just send it
    res.status(201).json({
      token,
      user: {
        id:        user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        createdAt: user.createdAt,
      },
    });
    return;             // optional, makes it clear we’re done

  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const user = await User.findOne({ email });
    if (!user || !user.hashedPassword) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const match = await bcrypt.compare(password, user.hashedPassword);
    if (!match) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      token,
      user: {
        id:        user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        createdAt: user.createdAt,
      },
    });
    return;
  } catch (err) {
    next(err);
  }
};
