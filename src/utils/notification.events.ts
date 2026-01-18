import { NotificationServices } from "../services/notification.services";
import { SocketServices } from "../services/socket.services";

/**
 * Notification Event Helpers
 * These functions create and emit notifications for common events
 */

export const notifyTaskAssignment = async (
    taskId: string,
    taskTitle: string,
    assignedToId: string,
    assignedById: string,
    projectId: string,
) => {
    const notification = await NotificationServices.createNotification({
        userId: assignedToId,
        senderId: assignedById,
        type: "task_assigned",
        title: "New Task Assigned",
        message: `You have been assigned to task: ${taskTitle}`,
        taskId,
        projectId,
    });

    // Emit real-time notification
    SocketServices.emitToUser(assignedToId, "notification", notification);

    return notification;
};

export const notifyMilestoneCompleted = async (
    milestoneId: string,
    milestoneTitle: string,
    clientId: string,
    freelancerId: string,
    projectId: string,
) => {
    const notification = await NotificationServices.createNotification({
        userId: clientId,
        senderId: freelancerId,
        type: "milestone_completed",
        title: "Milestone Completed",
        message: `Milestone "${milestoneTitle}" has been completed and is ready for approval`,
        milestoneId,
        projectId,
    });

    SocketServices.emitToUser(clientId, "notification", notification);

    return notification;
};

export const notifyPaymentReceived = async (
    paymentId: string,
    amount: number,
    currency: string,
    freelancerId: string,
    clientId: string,
    projectId: string,
) => {
    const notification = await NotificationServices.createNotification({
        userId: freelancerId,
        senderId: clientId,
        type: "payment_received",
        title: "Payment Received",
        message: `You have received a payment of ${currency} ${amount}`,
        projectId,
        metadata: { paymentId, amount, currency },
    });

    SocketServices.emitToUser(freelancerId, "notification", notification);

    return notification;
};

export const notifyFileUploaded = async (
    fileId: string,
    fileName: string,
    uploadedById: string,
    recipientId: string,
    projectId: string,
) => {
    const notification = await NotificationServices.createNotification({
        userId: recipientId,
        senderId: uploadedById,
        type: "file_uploaded",
        title: "New File Uploaded",
        message: `A new file "${fileName}" has been uploaded to the project`,
        fileId,
        projectId,
    });

    SocketServices.emitToUser(recipientId, "notification", notification);

    return notification;
};

export const notifyProjectUpdated = async (
    projectId: string,
    projectTitle: string,
    updatedById: string,
    recipientIds: string[],
    updateMessage: string,
) => {
    const notifications = await Promise.all(
        recipientIds.map(recipientId =>
            NotificationServices.createNotification({
                userId: recipientId,
                senderId: updatedById,
                type: "project_updated",
                title: "Project Updated",
                message: `Project "${projectTitle}": ${updateMessage}`,
                projectId,
            })
        )
    );

    // Emit to all recipients
    recipientIds.forEach((recipientId, index) => {
        SocketServices.emitToUser(recipientId, "notification", notifications[index]);
    });

    return notifications;
};

export const notifyTaskUpdated = async (
    taskId: string,
    taskTitle: string,
    updatedById: string,
    assignedToId: string,
    projectId: string,
    updateMessage: string,
) => {
    if (updatedById === assignedToId) {
        return null; // Don't notify user about their own updates
    }

    const notification = await NotificationServices.createNotification({
        userId: assignedToId,
        senderId: updatedById,
        type: "task_updated",
        title: "Task Updated",
        message: `Task "${taskTitle}": ${updateMessage}`,
        taskId,
        projectId,
    });

    SocketServices.emitToUser(assignedToId, "notification", notification);

    return notification;
};

export const NotificationEvents = {
    notifyTaskAssignment,
    notifyMilestoneCompleted,
    notifyPaymentReceived,
    notifyFileUploaded,
    notifyProjectUpdated,
    notifyTaskUpdated,
};
