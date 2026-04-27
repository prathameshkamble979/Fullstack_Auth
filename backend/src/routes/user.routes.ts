import express from 'express';
import { updateProfilePicture } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.put('/profile-picture', authenticate, updateProfilePicture);

export default router;
