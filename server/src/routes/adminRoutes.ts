import express from 'express';
import { UserModel } from '../models/user.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

// GET all users (admin only)
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await UserModel.find({}, 'name email role createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PATCH update user role (admin only)
router.patch('/users/:id', adminMiddleware, async (req, res) => {
  const { role } = req.body;
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { role },
      { returnDocument: 'after' }
    );
    res.json({ message: 'Role updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
