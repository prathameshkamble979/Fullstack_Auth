import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import Otp from '../models/otp.model';
import twilio from 'twilio';
import emailjs from '@emailjs/nodejs';

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, method } = req.body;

    // Find user
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier.replace(/\D/g, '').slice(-10) }
      ]
    });

    if (!user) {
      res.status(404).json({ message: 'No account found with this information.' });
      return;
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete existing OTP for this identifier if any
    await Otp.deleteMany({ identifier });

    // Save new OTP
    const newOtp = new Otp({
      identifier,
      code: otpCode
    });
    await newOtp.save();

    if (method === 'sms') {
      try {
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
        const formattedPhone = user.phone.startsWith('+') ? user.phone : `+91${user.phone}`;
        
        await client.messages.create({
          body: `Freelance.dev OTP code: ${otpCode}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: formattedPhone
        });
        
        res.json({ message: 'OTP sent via Twilio SMS! Check your phone.' });
      } catch (err) {
        console.error('Twilio Error:', err);
        // Fallback for prototype
        res.json({ message: `Simulated SMS OTP: ${otpCode}` });
      }
    } else {
      try {
        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID!,
          process.env.EMAILJS_TEMPLATE_ID!,
          {
            to_email: user.email,
            from_name: 'Freelance.dev Auth',
            otp: otpCode,
            code: otpCode,
            message: `Your verification code is ${otpCode}`,
          },
          {
            publicKey: process.env.EMAILJS_PUBLIC_KEY!,
            privateKey: process.env.EMAILJS_PRIVATE_KEY,
          }
        );
        res.json({ message: 'OTP sent! Check your email inbox.' });
      } catch (err) {
        console.error('EmailJS Error:', err);
        res.json({ message: `Simulated Email OTP: ${otpCode}` });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during forgot password' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, otp } = req.body;

    const storedOtp = await Otp.findOne({ identifier });

    if (!storedOtp) {
      res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
      return;
    }

    if (storedOtp.code !== otp) {
      res.status(400).json({ message: 'Incorrect OTP. Please try again.' });
      return;
    }

    res.json({ message: 'OTP verified successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, otp, newPassword } = req.body;

    const storedOtp = await Otp.findOne({ identifier });

    if (!storedOtp || storedOtp.code !== otp) {
      res.status(400).json({ message: 'Invalid session. Please start again.' });
      return;
    }

    // Update password
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier.replace(/\D/g, '').slice(-10) }
      ]
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Delete OTP
    await Otp.deleteOne({ _id: storedOtp._id });

    res.json({ message: 'Password reset successful! Please sign in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during password reset' });
  }
};
