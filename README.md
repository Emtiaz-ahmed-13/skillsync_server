# SkillSync Server

<div align="center">

![SkillSync](https://img.shields.io/badge/SkillSync-Backend-0A192F?style=for-the-badge&logo=rocket&logoColor=64FFDA)

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**An Enterprise-Grade Collaboration Platform for Freelancers & Clients**

</div>

---

## 📖 Overview

**SkillSync** is a centralized, web-based collaboration platform designed to streamline workflows between freelancers and clients. Going beyond simple job listings, it emphasizes **Project Management**, **Milestone-based Payments**, and **Real-time Communication**.

Built with a scalable **Microservices-ready Architecture** and rigorous security standards, it provides a seamless experience from proposal to final delivery.

## ✨ Key Features

- 🔐 **Secure Authentication**: JWT-based auth with refresh token rotation and role-based access control (RBAC).
- 💼 **Project Workspace**: Unified dashboard for managing milestones, tasks, and files.
- 💰 **Escrow Payments**: Integrated Stripe payments with milestone-based release logic.
- 📁 **File Management**: Secure file upload and sharing via ImageKit.
- 📊 **Real-time Analytics**: Admin and user dashboards for tracking progress and spending.
- 🔔 **Notification System**: Event-driven notification engine for real-time updates.

## 🏗 System Architecture

The backend follows a layered **MVC (Model-View-Controller)** architecture pattern, ensuring separation of concerns and maintainability.

```mermaid
graph TD
    Client[Client UI] -->|HTTP Requests| API[API Gateway / Routes]
    API --> Middleware[Auth & Validation Middleware]
    Middleware --> Controllers[Controllers]
    Controllers --> Services[Business Logic Services]
    Services --> Models[Mongoose Data Models]
    Services --> Utils[Utilities (Email, Storage, Payment)]
    Models --> DB[(MongoDB)]
    Utils --> External[External APIs (Stripe, ImageKit)]
```

## 🛠 Technology Stack

| Category | Technologies |
|----------|--------------|
| **Core** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB, Mongoose ODM |
| **Validation** | Zod |
| **Auth** | JWT, Passport.js (Strategy pattern) |
| **Storage** | ImageKit |
| **Payments** | Stripe Connect |
| **DevOps** | Docker, Vercel (Serverless) |

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **MongoDB**: Local instance or Atlas URI
- **npm** or **yarn**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/skillsync-server.git
    cd skillsync-server
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    PORT=5001
    MONGODB_URI=mongodb://localhost:27017/skillsync
    NODE_ENV=development
    
    # Auth
    JWT_ACCESS_SECRET=your_super_secret_access_key
    JWT_REFRESH_SECRET=your_super_secret_refresh_key
    
    # External Services (Get keys from respective providers)
    STRIPE_SECRET_KEY=sk_test_...
    IMAGEKIT_PUBLIC_KEY=...
    IMAGEKIT_PRIVATE_KEY=...
    IMAGEKIT_URL_ENDPOINT=...
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

## 📚 API Documentation

The API is organized around RESTful resources. Below is a high-level summary of available endpoints.

<details>
<summary><strong>🔐 Authentication</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/signup` | Register a new user |
| `POST` | `/api/v1/auth/login` | Login and receive tokens |
| `POST` | `/api/v1/auth/refresh-token` | Refresh access token |

</details>

<details>
<summary><strong>📁 Projects & Milestones</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/projects` | List all projects |
| `POST` | `/api/v1/projects` | Create a new project |
| `POST` | `/api/v1/milestones` | Add milestone to project |
| `PATCH` | `/api/v1/milestones/:id/complete` | Mark milestone complete |

</details>

<details>
<summary><strong>👥 Users & Profiles</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/profile` | Get current user profile |
| `PATCH` | `/api/v1/profile` | Update profile details |

</details>

## 📂 Project Structure

```bash
src/
├── 📂 api/             # Vercel Serverless Entry
├── 📂 config/          # Environment & DB Config
├── 📂 controllers/     # Request Handlers
├── 📂 middlewares/     # Auth, Validation, Error Handling
├── 📂 models/          # Mongoose Schemas
├── 📂 routes/          # API Route Definitions
├── 📂 services/        # Business Logic Layer
├── 📂 utils/           # Helper Functions
└── 📂 validations/     # Zod Schemas
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
