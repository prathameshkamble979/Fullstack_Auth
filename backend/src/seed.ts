import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/user.model';
import Project from './models/project.model';
import Invoice from './models/invoice.model';
import Message from './models/message.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-mvc';

const users = [
  {
    name: 'Prathamesh Kamble',
    email: 'prathamesh@freelance.dev',
    phone: '9876543210',
    city: 'Pune',
  },
  {
    name: 'Sneha Deshmukh',
    email: 'sneha@freelance.dev',
    phone: '9876543211',
    city: 'Mumbai',
  },
  {
    name: 'Rohit Patil',
    email: 'rohit@freelance.dev',
    phone: '9876543212',
    city: 'Nagpur',
  },
  {
    name: 'Ananya Kulkarni',
    email: 'ananya@freelance.dev',
    phone: '9876543213',
    city: 'Nashik',
  },
  {
    name: 'Omkar Joshi',
    email: 'omkar@freelance.dev',
    phone: '9876543214',
    city: 'Aurangabad',
  },
];

const PASSWORD = 'Password@123';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Invoice.deleteMany({});
    await Message.deleteMany({});
    console.log('Cleared existing data');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(PASSWORD, salt);

    for (const u of users) {
      const user = await User.create({
        name: u.name,
        email: u.email,
        phone: u.phone,
        passwordHash,
      });

      const userId = user._id;

      // --- Projects ---
      await Project.create([
        {
          userId,
          title: `${u.city} E-commerce Redesign`,
          dueDate: new Date('2026-05-15'),
          status: 'In Progress',
          progress: 65,
          tasks: [
            { title: 'UI Wireframes', completed: true },
            { title: 'Frontend Development', completed: true },
            { title: 'Backend API Integration', completed: false },
            { title: 'Testing & QA', completed: false },
          ],
        },
        {
          userId,
          title: `${u.city} Portfolio Website`,
          dueDate: new Date('2026-06-01'),
          status: 'In Progress',
          progress: 30,
          tasks: [
            { title: 'Design Mockups', completed: true },
            { title: 'Responsive Layout', completed: false },
            { title: 'CMS Integration', completed: false },
          ],
        },
        {
          userId,
          title: `${u.city} Mobile App MVP`,
          dueDate: new Date('2026-04-10'),
          status: 'Completed',
          progress: 100,
          tasks: [
            { title: 'Prototype', completed: true },
            { title: 'Development', completed: true },
            { title: 'App Store Submission', completed: true },
          ],
        },
      ]);

      // --- Invoices ---
      await Invoice.create([
        {
          userId,
          invoiceNumber: `INV-${u.phone.slice(-4)}-001`,
          amount: 45000,
          date: new Date('2026-04-01'),
          status: 'PAID',
        },
        {
          userId,
          invoiceNumber: `INV-${u.phone.slice(-4)}-002`,
          amount: 32000,
          date: new Date('2026-04-15'),
          status: 'PENDING',
        },
        {
          userId,
          invoiceNumber: `INV-${u.phone.slice(-4)}-003`,
          amount: 18500,
          date: new Date('2026-03-20'),
          status: 'PAID',
        },
        {
          userId,
          invoiceNumber: `INV-${u.phone.slice(-4)}-004`,
          amount: 27000,
          date: new Date('2026-04-25'),
          status: 'PENDING',
        },
      ]);

      // --- Messages ---
      await Message.create([
        {
          userId,
          senderName: 'Amit Sharma',
          content: `Hi ${u.name.split(' ')[0]}, can we schedule a call about the ${u.city} project?`,
          read: false,
        },
        {
          userId,
          senderName: 'Priya Mehta',
          content: 'The latest designs look fantastic! Approved for development.',
          read: true,
        },
        {
          userId,
          senderName: 'Vikram Singh',
          content: 'Payment for INV-001 has been processed. Please confirm.',
          read: false,
        },
      ]);

      console.log(`✔ Seeded data for ${u.name} (${u.city})`);
    }

    console.log('\n✅ Seeding complete!');
    console.log(`\nLogin credentials for all users:`);
    console.log(`  Password: ${PASSWORD}`);
    console.log(`  Emails: ${users.map(u => u.email).join(', ')}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
