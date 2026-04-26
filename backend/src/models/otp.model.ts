import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
  identifier: string; // Email or Phone
  code: string;
  createdAt: Date;
}

const OtpSchema: Schema = new Schema({
  identifier: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // Auto delete after 5 minutes
});

export default mongoose.model<IOtp>('Otp', OtpSchema);
