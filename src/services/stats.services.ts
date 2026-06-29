import { Payment } from "../models/payment.model";
import { Project } from "../models/project.model";
import { User } from "../models/user.model";

const getPublicStats = async () => {
  const [
    totalUsers,
    totalProjects,
    completedProjects,
    freelancers,
    clients,
    inProgressProjects,
  ] = await Promise.all([
    User.countDocuments(),
    Project.countDocuments(),
    Project.countDocuments({ status: "completed" }),
    User.countDocuments({ role: "freelancer" }),
    User.countDocuments({ role: "client" }),
    Project.countDocuments({ status: "in-progress" }),
  ]);

  const completedPayments = await Payment.find({ status: "completed" }).select("amount").lean();
  const totalEarnings = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const successRate =
    totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  return {
    totalUsers,
    totalProjects,
    completedProjects,
    inProgressProjects,
    freelancers,
    clients,
    totalEarnings,
    successRate,
  };
};

export const StatsServices = { getPublicStats };
