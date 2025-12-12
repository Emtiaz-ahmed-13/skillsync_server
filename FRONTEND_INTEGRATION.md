# SkillSync Frontend Integration Guide

## Table of Contents

1. [API Connection Setup](#api-connection-setup)
2. [Authentication Flow](#authentication-flow)
3. [User Management](#user-management)
4. [Project Management](#project-management)
5. [Milestone System](#milestone-system)
6. [Task Management](#task-management)
7. [File Sharing](#file-sharing)
8. [Time Tracking](#time-tracking)
9. [Payment Processing](#payment-processing)
10. [Review System](#review-system)
11. [Notification System](#notification-system)
12. [Admin Dashboard](#admin-dashboard)
13. [Error Handling](#error-handling)
14. [Environment Configuration](#environment-configuration)

## API Connection Setup

### Base URL Configuration

```javascript
// Production
const BASE_URL = "https://yourdomain.com/api/v1";

// Local Development
const BASE_URL = "http://localhost:5000/api/v1";
```

### HTTP Client Setup (Using Axios)

```javascript
import axios from "axios";

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
```

## Authentication Flow

### User Registration

```javascript
// Endpoint: POST /auth/register
const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/auth/register", {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role, // 'client' or 'freelancer'
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
```

### User Login

```javascript
// Endpoint: POST /auth/login
const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    // Store tokens
    localStorage.setItem("accessToken", response.data.data.accessToken);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
```

### Get User Profile

```javascript
// Endpoint: GET /auth/profile
const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
};
```

### Update User Profile

```javascript
// Endpoint: PUT /profile
const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put("/profile", profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update profile");
  }
};
```

### Change Password

```javascript
// Endpoint: POST /auth/change-password
const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.post("/auth/change-password", {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to change password");
  }
};
```

## User Management

### Get All Users (Admin Only)

```javascript
// Endpoint: GET /admin/users
const getAllUsers = async (params = {}) => {
  try {
    const response = await apiClient.get("/admin/users", { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};
```

### Get User By ID (Admin Only)

```javascript
// Endpoint: GET /admin/users/:id
const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user");
  }
};
```

### Update User Role (Admin Only)

```javascript
// Endpoint: PUT /admin/users/:id/role
const updateUserRole = async (userId, role) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user role");
  }
};
```

## Project Management

### Create Project

```javascript
// Endpoint: POST /projects
const createProject = async (projectData) => {
  try {
    const response = await apiClient.post("/projects", projectData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create project");
  }
};
```

### Get All Projects

```javascript
// Endpoint: GET /projects
const getAllProjects = async (params = {}) => {
  try {
    const response = await apiClient.get("/projects", { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch projects");
  }
};
```

### Get Project By ID

```javascript
// Endpoint: GET /projects/:id
const getProjectById = async (projectId) => {
  try {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch project");
  }
};
```

### Update Project

```javascript
// Endpoint: PUT /projects/:id
const updateProject = async (projectId, projectData) => {
  try {
    const response = await apiClient.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update project");
  }
};
```

### Delete Project

```javascript
// Endpoint: DELETE /projects/:id
const deleteProject = async (projectId) => {
  try {
    const response = await apiClient.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete project");
  }
};
```

### Invite User to Project

```javascript
// Endpoint: POST /projects/:id/invite
const inviteUserToProject = async (projectId, inviteData) => {
  try {
    const response = await apiClient.post(`/projects/${projectId}/invite`, inviteData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to invite user");
  }
};
```

## Milestone System

### Create Milestone

```javascript
// Endpoint: POST /milestones
const createMilestone = async (milestoneData) => {
  try {
    const response = await apiClient.post("/milestones", milestoneData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create milestone");
  }
};
```

### Get Project Milestones

```javascript
// Endpoint: GET /milestones/project/:projectId
const getProjectMilestones = async (projectId, params = {}) => {
  try {
    const response = await apiClient.get(`/milestones/project/${projectId}`, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch milestones");
  }
};
```

### Update Milestone

```javascript
// Endpoint: PUT /milestones/:id
const updateMilestone = async (milestoneId, milestoneData) => {
  try {
    const response = await apiClient.put(`/milestones/${milestoneId}`, milestoneData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update milestone");
  }
};
```

### Delete Milestone

```javascript
// Endpoint: DELETE /milestones/:id
const deleteMilestone = async (milestoneId) => {
  try {
    const response = await apiClient.delete(`/milestones/${milestoneId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete milestone");
  }
};
```

### Complete Milestone

```javascript
// Endpoint: PUT /milestones/:id/complete
const completeMilestone = async (milestoneId) => {
  try {
    const response = await apiClient.put(`/milestones/${milestoneId}/complete`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to complete milestone");
  }
};
```

## Task Management

### Create Task

```javascript
// Endpoint: POST /tasks
const createTask = async (taskData) => {
  try {
    const response = await apiClient.post("/tasks", taskData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create task");
  }
};
```

### Get Project Tasks

```javascript
// Endpoint: GET /tasks/project/:projectId
const getProjectTasks = async (projectId, params = {}) => {
  try {
    const response = await apiClient.get(`/tasks/project/${projectId}`, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tasks");
  }
};
```

### Get Task By ID

```javascript
// Endpoint: GET /tasks/:id
const getTaskById = async (taskId) => {
  try {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch task");
  }
};
```

### Update Task

```javascript
// Endpoint: PUT /tasks/:id
const updateTask = async (taskId, taskData) => {
  try {
    const response = await apiClient.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update task");
  }
};
```

### Delete Task

```javascript
// Endpoint: DELETE /tasks/:id
const deleteTask = async (taskId) => {
  try {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete task");
  }
};
```

## File Sharing

### Upload File

```javascript
// Endpoint: POST /files
const uploadFile = async (fileData) => {
  try {
    const response = await apiClient.post("/files", fileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to upload file");
  }
};
```

### Get Project Files

```javascript
// Endpoint: GET /files/project/:projectId
const getProjectFiles = async (projectId, params = {}) => {
  try {
    const response = await apiClient.get(`/files/project/${projectId}`, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch files");
  }
};
```

### Delete File

```javascript
// Endpoint: DELETE /files/:id
const deleteFile = async (fileId) => {
  try {
    const response = await apiClient.delete(`/files/${fileId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete file");
  }
};
```

## Time Tracking

### Create Time Entry

```javascript
// Endpoint: POST /time-tracking
const createTimeEntry = async (timeData) => {
  try {
    const response = await apiClient.post("/time-tracking", timeData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create time entry");
  }
};
```

### Get User Time Entries

```javascript
// Endpoint: GET /time-tracking
const getUserTimeEntries = async (params = {}) => {
  try {
    const response = await apiClient.get("/time-tracking", { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch time entries");
  }
};
```

### Update Time Entry

```javascript
// Endpoint: PUT /time-tracking/:id
const updateTimeEntry = async (timeId, timeData) => {
  try {
    const response = await apiClient.put(`/time-tracking/${timeId}`, timeData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update time entry");
  }
};
```

### Delete Time Entry

```javascript
// Endpoint: DELETE /time-tracking/:id
const deleteTimeEntry = async (timeId) => {
  try {
    const response = await apiClient.delete(`/time-tracking/${timeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete time entry");
  }
};
```

## Payment Processing

### Create Payment

```javascript
// Endpoint: POST /payments
const createPayment = async (paymentData) => {
  try {
    const response = await apiClient.post("/payments", paymentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create payment");
  }
};
```

### Get User Payments

```javascript
// Endpoint: GET /payments
const getUserPayments = async (params = {}) => {
  try {
    const response = await apiClient.get("/payments", { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch payments");
  }
};
```

### Get Project Payments

```javascript
// Endpoint: GET /payments/project/:projectId
const getProjectPayments = async (projectId) => {
  try {
    const response = await apiClient.get(`/payments/project/${projectId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch project payments");
  }
};
```

## Review System

### Create Review

```javascript
// Endpoint: POST /reviews
const createReview = async (reviewData) => {
  try {
    const response = await apiClient.post("/reviews", reviewData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create review");
  }
};
```

### Get User Reviews

```javascript
// Endpoint: GET /reviews/user/:userId
const getUserReviews = async (userId, params = {}) => {
  try {
    const response = await apiClient.get(`/reviews/user/${userId}`, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user reviews");
  }
};
```

### Get Project Reviews

```javascript
// Endpoint: GET /reviews/project/:projectId
const getProjectReviews = async (projectId) => {
  try {
    const response = await apiClient.get(`/reviews/project/${projectId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch project reviews");
  }
};
```

### Delete Review

```javascript
// Endpoint: DELETE /reviews/:id
const deleteReview = async (reviewId) => {
  try {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete review");
  }
};
```

## Notification System

### Get Notifications

```javascript
// Endpoint: GET /notifications
const getNotifications = async (params = {}) => {
  try {
    const response = await apiClient.get("/notifications", { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch notifications");
  }
};
```

### Get Unread Count

```javascript
// Endpoint: GET /notifications/unread-count
const getUnreadCount = async () => {
  try {
    const response = await apiClient.get("/notifications/unread-count");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch unread count");
  }
};
```

### Mark Notification as Read

```javascript
// Endpoint: PUT /notifications/:id/read
const markAsRead = async (notificationId) => {
  try {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to mark notification as read");
  }
};
```

### Mark All as Read

```javascript
// Endpoint: PUT /notifications/read-all
const markAllAsRead = async () => {
  try {
    const response = await apiClient.put("/notifications/read-all");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to mark all notifications as read");
  }
};
```

### Delete Notification

```javascript
// Endpoint: DELETE /notifications/:id
const deleteNotification = async (notificationId) => {
  try {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete notification");
  }
};
```

## Admin Dashboard

### Get Dashboard Analytics

```javascript
// Endpoint: GET /admin/analytics
const getDashboardAnalytics = async () => {
  try {
    const response = await apiClient.get("/admin/analytics");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch dashboard analytics");
  }
};
```

### Get Disputes

```javascript
// Endpoint: GET /admin/disputes
const getDisputes = async (params = {}) => {
  try {
    const response = await apiClient.get("/admin/disputes", { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch disputes");
  }
};
```

### Resolve Dispute

```javascript
// Endpoint: PUT /admin/disputes/:id/resolve
const resolveDispute = async (disputeId, resolution) => {
  try {
    const response = await apiClient.put(`/admin/disputes/${disputeId}/resolve`, { resolution });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to resolve dispute");
  }
};
```

### Delete User

```javascript
// Endpoint: DELETE /admin/users/:id
const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};
```

## Error Handling

### Standard Error Response Format

```javascript
{
  "success": false,
  "message": "Error message",
  "error": {
    "statusCode": 400,
    "message": "Detailed error message"
  }
}
```

### Error Handling Utility

```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    switch (status) {
      case 400:
        throw new Error(data.message || "Bad Request");
      case 401:
        throw new Error(data.message || "Unauthorized");
      case 403:
        throw new Error(data.message || "Forbidden");
      case 404:
        throw new Error(data.message || "Not Found");
      case 500:
        throw new Error(data.message || "Internal Server Error");
      default:
        throw new Error(data.message || "An error occurred");
    }
  } else if (error.request) {
    // Request was made but no response received
    throw new Error("Network error. Please check your connection.");
  } else {
    // Something else happened
    throw new Error("An unexpected error occurred");
  }
};
```

## Environment Configuration

### Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### Production Environment

```env
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api/v1
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
```
