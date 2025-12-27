# SkillSync Server

**A Professional Collaboration Hub for Freelancers and Clients**

---

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

SkillSync is an enterprise-grade, centralized web-based collaboration platform designed to streamline workflows between freelancers and clients. Unlike traditional freelancing platforms that focus mainly on job listings, SkillSync emphasizes project management, milestone-based payments, progress tracking, and seamless communication — all within one intuitive interface.

Built with scalability and security in mind, the platform provides a comprehensive solution for project lifecycle management, from initial proposal to final delivery and payment processing.

## Features

### Core Features

1. **User Authentication & Profiles**
   - Secure signup/login with JWT
   - Profile setup for freelancers (portfolio, hourly rate) and clients
   - Role-based dashboards with granular permissions

2. **Project Dashboard**
   - Centralized workspace showing project status, milestones, and recent activity
   - Project creation and management with approval workflow
   - Real-time progress tracking and analytics

3. **Milestone & Payment System**
   - Stripe-based milestone & payment processing
   - Secure payment handling with escrow functionality
   - Automated payment distribution upon milestone completion

4. **File Sharing**
   - Secure file uploads with ImageKit
   - Project and milestone-specific file organization
   - Version control and access management

5. **Task Management**
   - Kanban-style task management with drag-and-drop functionality
   - Task assignment and status tracking
   - Priority and deadline management

6. **Time Tracking**
   - Manual and automated time logging
   - Detailed work logs per milestone
   - Time reporting and analytics

7. **Rating System**
   - Two-way feedback after project completion
   - Detailed rating criteria across multiple dimensions
   - Reputation scoring system

8. **Notification System**
   - Real-time alerts for project updates
   - Event-based notifications with customizable preferences
   - Push notifications and email integration

9. **Admin Dashboard**
   - User management and role assignment
   - Dispute resolution tools
   - Analytics and reporting
   - Content moderation capabilities

## Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication with refresh token mechanism
- **Validation**: Zod schema validation for robust input validation
- **File Storage**: ImageKit for secure and scalable file management
- **Payments**: Stripe API for secure payment processing
- **Email**: Nodemailer for transactional email delivery
- **Testing**: Jest for comprehensive test coverage
- **Deployment**: Docker containerization, CI/CD pipeline ready

## System Architecture

The backend follows a robust MVC (Model-View-Controller) architecture with additional service layer for modular and maintainable code:

```
Model: Defines schemas for users, projects, milestones, tasks, files, payments, reviews, notifications, and time tracking.
Controller: Contains business logic for all workflows.
Service: Handles data processing and external API integrations.
Middleware: Implements authentication, validation, and error handling.
Validation: Ensures data integrity and security through Zod schemas.
```

The architecture is designed with scalability in mind, following these key principles:

- **Separation of Concerns**: Each component has a single responsibility
- **Loose Coupling**: Components interact through well-defined interfaces
- **High Cohesion**: Related functionality is grouped together
- **Maintainability**: Clean code structure with consistent patterns
- **Testability**: Components can be easily unit tested

## API Documentation

The SkillSync API follows RESTful principles and uses standard HTTP response codes. All API endpoints return JSON responses and follow consistent error handling patterns.

### Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

### Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### Success Response Format

Success responses follow this structure:

```json
{
  "success": true,
  "message": "Success message",
  "data": {
    /* response data */
  }
}
```

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

## System Architecture Diagram

![System Architecture](https://www.mermaidchart.com/app/projects/584c66dc-ea03-471e-8ce3-dd0cae417f30/diagrams/d6e1c99c-e221-4d41-b8e6-0ad519c628e6/share/invite/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkb2N1bWVudElEIjoiZDZlMWM5OWMtZTIyMS00ZDQxLWI4ZTYtMGFkNTE5YzYyOGU2IiwiYWNjZXNzIjoiRWRpdCIsImlhdCI6MTc2Njg2MTk1Mn0.ej_9GBBXgo3zt8ZSn7K-dITgPkjr5_Ik4lmVx2VqqrI)

The above diagram illustrates the complete system architecture, including the database schema relationships, API endpoints, and data flow between components. The system follows a modern microservices approach with clear separation of concerns.

## Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- Git

### Setup Instructions

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

4. Verify the installation:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
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

For development with hot-reloading and detailed logging:

```bash
npm run dev
```

This command starts the server in development mode with nodemon, automatically restarting the server when code changes are detected.

### Production Mode

For production deployment:

```bash
npm start
```

This command runs the compiled application in production mode.

### Docker Deployment

To run the application using Docker:

```bash
# Build the Docker image
docker build -t skillsync-server .

# Run the container
docker run -p 5000:5000 skillsync-server
```

## Building for Production

To create an optimized production build:

```bash
npm run build
```

This command compiles the TypeScript code to JavaScript, performs optimization, and prepares the application for production deployment. The build output will be placed in the `dist/` directory.

For production deployment, ensure that:

- Environment variables are properly configured
- Database connections are established
- All external services (ImageKit, Stripe, etc.) are properly configured
- SSL certificates are in place for secure connections

## Project Structure

```
src/
├── app.ts                  # Application entry point with middleware setup
├── server.ts               # Server setup and startup configuration
├── config/                 # Configuration files
│   ├── database.ts         # Database connection setup
│   └── index.ts            # Global configuration
├── controllers/            # Request handlers with business logic
│   ├── admin.controllers.ts
│   ├── auth.controllers.ts
│   ├── project.controllers.ts
│   ├── milestone.controllers.ts
│   ├── task.controllers.ts
│   ├── file.controllers.ts
│   ├── timeTracking.controllers.ts
│   ├── review.controllers.ts
│   ├── notification.controllers.ts
│   └── payment.controllers.ts
├── interfaces/             # TypeScript interfaces for type safety
│   ├── user.interface.ts
│   ├── project.interface.ts
│   ├── milestone.interface.ts
│   ├── task.interface.ts
│   ├── file.interface.ts
│   ├── timeTracking.interface.ts
│   ├── review.interface.ts
│   ├── notification.interface.ts
│   └── payment.interface.ts
├── middlewares/            # Custom middleware functions
│   ├── auth.ts             # Authentication middleware
│   ├── globalErrorHandler.ts # Global error handling
│   ├── upload.middleware.ts # File upload handling
│   └── validateRequest.ts   # Request validation middleware
├── models/                 # Mongoose models and schemas
│   ├── user.model.ts
│   ├── project.model.ts
│   ├── milestone.model.ts
│   ├── task.model.ts
│   ├── file.model.ts
│   ├── timeTracking.model.ts
│   ├── review.model.ts
│   ├── notification.model.ts
│   └── payment.model.ts
├── routes/                 # API route definitions
│   ├── admin.routes.ts
│   ├── auth.routes.ts
│   ├── project.routes.ts
│   ├── milestone.routes.ts
│   ├── task.routes.ts
│   ├── file.routes.ts
│   ├── timeTracking.routes.ts
│   ├── review.routes.ts
│   ├── notification.routes.ts
│   └── payment.routes.ts
├── services/               # Business logic and external API integrations
│   ├── admin.services.ts
│   ├── auth.services.ts
│   ├── project.services.ts
│   ├── milestone.services.ts
│   ├── task.services.ts
│   ├── file.services.ts
│   ├── timeTracking.services.ts
│   ├── review.services.ts
│   ├── notification.services.ts
│   └── payment.services.ts
├── utils/                  # Utility functions and helpers
│   ├── ApiError.ts         # Custom error class
│   ├── catchAsync.ts       # Async error wrapper
│   ├── jwtHelpers.ts       # JWT utilities
│   ├── email.utils.ts      # Email utilities
│   ├── imagekit.utils.ts   # ImageKit integration
│   ├── stripe.utils.ts     # Stripe payment utilities
│   └── sendResponse.ts     # Standardized response format
└── validations/            # Zod validation schemas
    ├── auth.validation.ts
    ├── project.validation.ts
    ├── milestone.validation.ts
    ├── task.validation.ts
    ├── file.validation.ts
    ├── timeTracking.validation.ts
    ├── review.validation.ts
    ├── notification.validation.ts
    └── payment.validation.ts
```

## Contributing

We welcome contributions to the SkillSync project! To maintain code quality and consistency, please follow these guidelines:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Ensure your code follows the project's coding standards
4. Write comprehensive tests for new features
5. Commit your changes using conventional commit messages (`git commit -m 'feat: Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a pull request with a detailed description of your changes

### Development Workflow

- All feature development should be done in feature branches
- Code reviews are mandatory for all pull requests
- Automated tests must pass before merging
- Documentation updates are required for API changes

## Security

We take security seriously. If you discover any security vulnerabilities, please report them to our security team at [security@skillsync.com](mailto:security@skillsync.com) instead of creating a public issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact our development team through:

- GitHub Issues for bug reports and feature requests
- Email: [support@skillsync.com](mailto:support@skillsync.com)
- Documentation: [https://skillsync-docs.com](https://skillsync-docs.com)
