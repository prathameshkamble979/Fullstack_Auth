import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/user.model';

export const updateProfilePicture = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { profilePicture } = req.body;

    if (!profilePicture) {
      res.status(400).json({ message: 'Profile picture is required' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'Profile picture updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile picture' });
  }
};
