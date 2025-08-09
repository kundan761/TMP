import argon2 from "argon2";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already exists' });
  
      const hashedPassword = await argon2.hash(password);
      const user = await User.create({ username, email, password: hashedPassword });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
  
      res.status(201).json({ userId: user._id, token });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid email or password' });
  
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
  
      res.status(200).json({ user: { id: user._id, username: user.username, email: user.email }, token });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

  export const getAllUsers = async (req, res) => {
    try {
      const user = await User.find();
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Internal Server error', error: err.message });
    }
  }
