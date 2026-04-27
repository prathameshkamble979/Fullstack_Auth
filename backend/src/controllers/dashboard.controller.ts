import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Project from '../models/project.model';
import Invoice from '../models/invoice.model';
import Message from '../models/message.model';
import User from '../models/user.model';

export const getDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const [projects, invoices, messages, user] = await Promise.all([
      Project.find({ userId }).sort({ createdAt: -1 }),
      Invoice.find({ userId }).sort({ date: -1 }),
      Message.find({ userId }),
      User.findById(userId).select('-passwordHash')
    ]);

    const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;
    const pendingInvoices = invoices.filter(i => i.status === 'PENDING');
    const pendingInvoicesTotal = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const unreadMessagesCount = messages.filter(m => !m.read).length;

    // Get the most recent active project
    const currentProject = projects.find(p => p.status !== 'Completed') || null;

    res.json({
      user,
      stats: {
        activeProjectsCount,
        pendingInvoicesTotal,
        unreadMessagesCount
      },
      currentProject,
      recentInvoices: invoices.slice(0, 5) // top 5 recent invoices
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};
