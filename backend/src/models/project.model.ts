import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  dueDate: Date;
  status: string;
  progress: number;
  tasks: Array<{ title: string; completed: boolean }>;
  createdAt: Date;
}

const ProjectSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, default: 'In Progress' },
  progress: { type: Number, default: 0 },
  tasks: [{ 
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProject>('Project', ProjectSchema);
