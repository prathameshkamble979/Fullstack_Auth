import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  userId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  amount: number;
  date: Date;
  status: string;
  createdAt: Date;
}

const InvoiceSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['PENDING', 'PAID', 'OVERDUE'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
