# 🚀 Workflow Hub – Full Stack Workflow Management System

## 📌 Project Overview

Workflow Hub is a full-stack workflow management system designed to streamline request handling inside an organization.  
Employees can create workflow requests and track their status in real-time.  
Admins can review, approve, or reject requests with full audit tracking.  
The system provides secure authentication using JWT and role-based authorization.  
It also includes in-app notifications and automated email alerts for workflow updates.

---

# 🛠️ Tech Stack

## 🌐 Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- React Query
- React Router
- Toast Notifications (Sonner)

## 🔙 Backend
- Java 21
- Spring Boot 3
- Spring Security
- JWT Authentication
- JPA / Hibernate
- MySQL
- Java Mail Sender (Gmail SMTP)

---

# 📂 Project Structure

workflow-hub
├── frontend/ → React Application
└── backend/ → Spring Boot REST API


---

# 🔐 Core Features

### 👤 Employee
- Register & Login
- Create Workflow Request
- Track Request Status
- Receive In-App Notifications
- Receive Email Alerts

### 👨‍💼 Admin
- View Pending Requests
- Approve / Reject Workflows
- View Audit Logs
- Monitor All Requests

---

# 🔑 Authentication & Security

- JWT-based Authentication
- Role-based Authorization (ADMIN / EMPLOYEE)
- Protected Routes in Frontend
- Secure REST APIs in Backend

---

# 📧 Email Notification System

- Email sent on Approval
- Email sent on Rejection
- Gmail SMTP with App Password
- In-App Notification stored in database

---

# 🛢 Database Tables

- users
- workflows
- workflow_events
- workflow_status_history
- notifications
- audit_logs

---

# ⚙️ Backend Setup

## 1️⃣ Create Database

```sql
CREATE DATABASE workflowhub;

---

# 🚀 Future Enhancements

Docker Deployment

Production Deployment

Swagger API Documentation

Pagination & Advanced Filtering

CI/CD Pipeline

# Author

Naveenkumar M
