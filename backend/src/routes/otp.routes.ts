import express from 'express';
import { forgotPassword, verifyOtp, resetPassword } from '../controllers/otp.controller';

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/verify', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;
