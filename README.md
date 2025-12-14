# SkillSync Server

A Professional Collaboration Hub for Freelancers and Clients

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [API Documentation](#api-documentation)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)

## Overview

SkillSync is a centralized web-based collaboration platform designed to streamline workflows between freelancers and clients. Unlike traditional freelancing platforms that focus mainly on job listings, SkillSync emphasizes project management, milestone-based payments, progress tracking, and seamless communication — all within one intuitive interface.

## Features

### Core Features

1. **User Authentication & Profiles**
   - Secure signup/login with JWT
   - Profile setup for freelancers (portfolio, hourly rate) and clients
   - Role-based dashboards

2. **Project Dashboard**
   - Centralized workspace showing project status, milestones, and recent activity
   - Project creation and management

3. **Milestone & Payment System**
   - Stripe-based milestone & payment processing
   - Secure payment handling

4. **File Sharing**
   - Secure file uploads with ImageKit
   - Project and milestone-specific file organization

5. **Task Management**
   - Kanban-style task management
   - Task assignment and status tracking

6. **Time Tracking**
   - Manual time logging
   - Detailed work logs per milestone

7. **Rating System**
   - Two-way feedback after project completion
   - Detailed rating criteria

8. **Notification System**
   - Real-time alerts for project updates
   - Event-based notifications

9. **Admin Dashboard**
   - User management
   - Dispute resolution
   - Analytics and reporting

## Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **Validation**: Zod schema validation
- **File Storage**: ImageKit
- **Payments**: Stripe API
- **Email**: Nodemailer
- **Testing**: Jest
- **Deployment**: Docker, Vercel

## System Architecture

The backend follows an MVC (Model-View-Controller) architecture for modular and maintainable code:

```
Model: Defines schemas for users, projects, milestones, tasks, files, payments, reviews, notifications, and time tracking.
Controller: Contains business logic for all workflows.
Service: Handles data processing and external API integrations.
```

## API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/forgot-password` - Forgot password
- `POST /api/v1/auth/reset-password` - Reset password

### User Profile Endpoints

- `GET /api/v1/profile` - Get current user profile
- `PUT /api/v1/profile` - Update user profile
- `PUT /api/v1/profile/avatar` - Update user avatar

### Project Endpoints

- `POST /api/v1/projects` - Create a new project (ADMIN only)
- `GET /api/v1/projects` - Get all projects
- `GET /api/v1/projects/search` - Search projects by title or description
- `GET /api/v1/projects/:id` - Get specific project
- `GET /api/v1/projects/:id/dashboard` - Get project dashboard
- `PUT /api/v1/projects/:id` - Update project
- `PUT /api/v1/projects/:id/approve` - Approve project (ADMIN only)
- `DELETE /api/v1/projects/:id` - Delete project
- `POST /api/v1/projects/:id/milestones` - Add milestone to project
- `POST /api/v1/projects/:id/bids` - Place a bid on a project (Freelancer only)
- `GET /api/v1/projects/:id/bids` - Get all bids for a project
- `PUT /api/v1/projects/:id/bids/:bidId` - Accept a bid and assign freelancer to project (Owner only)
- `GET /api/v1/projects/my-bids` - Get freelancer's bids

### Milestone Endpoints

- `POST /api/v1/milestones` - Create a new milestone
- `GET /api/v1/milestones/project/:projectId` - Get all milestones for a project
- `GET /api/v1/milestones/:id` - Get specific milestone
- `PUT /api/v1/milestones/:id` - Update milestone
- `PUT /api/v1/milestones/:id/complete` - Mark milestone as complete
- `DELETE /api/v1/milestones/:id` - Delete milestone

### Task Endpoints

- `POST /api/v1/tasks` - Create a new task
- `GET /api/v1/tasks/project/:projectId` - Get all tasks for a project
- `GET /api/v1/tasks/:id` - Get specific task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

### File Endpoints

- `POST /api/v1/files` - Upload a new file
- `GET /api/v1/files/project/:projectId` - Get all files for a project
- `GET /api/v1/files/:id` - Get specific file
- `DELETE /api/v1/files/:id` - Delete file

### Time Tracking Endpoints

- `POST /api/v1/time-tracking` - Create a new time tracking record
- `GET /api/v1/time-tracking` - Get user's time tracking records
- `GET /api/v1/time-tracking/:id` - Get specific time tracking record
- `PUT /api/v1/time-tracking/:id` - Update time tracking record
- `DELETE /api/v1/time-tracking/:id` - Delete time tracking record

### Review Endpoints

- `POST /api/v1/reviews` - Create a new review
- `GET /api/v1/reviews/user/:userId` - Get all reviews for a user
- `GET /api/v1/reviews/project/:projectId` - Get all reviews for a project
- `GET /api/v1/reviews/:id` - Get specific review
- `DELETE /api/v1/reviews/:id` - Delete review

### Notification Endpoints

- `GET /api/v1/notifications` - Get user's notifications
- `GET /api/v1/notifications/unread-count` - Get unread notifications count
- `GET /api/v1/notifications/:id` - Get specific notification
- `PUT /api/v1/notifications/:id/read` - Mark notification as read
- `PUT /api/v1/notifications/read-all` - Mark all notifications as read
- `DELETE /api/v1/notifications/:id` - Delete notification

### Payment Endpoints

- `POST /api/v1/payments` - Create a new payment (client only)
- `GET /api/v1/payments` - Get user's payments
- `GET /api/v1/payments/project/:projectId` - Get all payments for a project
- `GET /api/v1/payments/:id` - Get specific payment
- `PUT /api/v1/payments/:id` - Update payment (admin only)
- `DELETE /api/v1/payments/:id` - Delete payment (admin only)

### Blog Endpoints

- `GET /api/v1/articles` - Get all published articles
- `GET /api/v1/articles/:slug` - Get specific article by slug
- `POST /api/v1/articles` - Create a new article (authenticated users)
- `GET /api/v1/articles/pending/list` - Get pending articles (admin only)
- `PATCH /api/v1/articles/:id` - Update article (author only)
- `DELETE /api/v1/articles/:id` - Delete article (author or admin)
- `PATCH /api/v1/articles/:id/approve` - Approve/reject article (admin only)

### Admin Endpoints

- `GET /api/v1/admin/analytics` - Get dashboard analytics
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/users/:id` - Get specific user
- `PUT /api/v1/admin/users/:id/role` - Update user role
- `DELETE /api/v1/admin/users/:id` - Delete user
- `GET /api/v1/admin/disputes` - Get all disputes
- `PUT /api/v1/admin/disputes/:id/resolve` - Resolve dispute

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd skillsync_server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (see below)

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/skillsync

# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── app.ts                  # Application entry point
├── server.ts               # Server setup
├── config/                 # Configuration files
├── controllers/            # Request handlers
├── interfaces/             # TypeScript interfaces
├── middlewares/            # Custom middlewares
├── models/                 # Mongoose models
├── routes/                 # API route definitions
├── services/               # Business logic
├── utils/                  # Utility functions
└── validations/            # Zod validation schemas
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
