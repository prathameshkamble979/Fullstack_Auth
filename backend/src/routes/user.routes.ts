import express from 'express';
import { updateProfilePicture, updateProfile, updatePassword } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.put('/profile-picture', authenticate, updateProfilePicture);
router.put('/profile', authenticate, updateProfile);
router.put('/password', authenticate, updatePassword);

export default router;
