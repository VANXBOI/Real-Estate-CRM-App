# PropCRM – Real Estate CRM

## Overview

PropCRM is a full-stack Real Estate CRM application built to manage leads, properties, clients, and deals efficiently. It provides a centralized dashboard for tracking sales pipelines, monitoring performance, and managing real estate operations.

---

## Features

### Authentication

* Secure login and registration using JWT
* Password hashing using bcryptjs
* Protected routes with token-based authentication

### Dashboard

* Overview of total leads, deals, revenue, and close rate
* Visual representation of lead statuses

### Leads Management

* Create, update, delete leads
* Filter by status: New, Contacted, Qualified, Closed, Lost

### Properties Management

* Manage property listings
* Filter by type: Residential, Commercial, Plot, Villa
* Filter by status: Available, Sold, Rented, Under Negotiation

### Clients Management

* Store and manage client information

### Deals Pipeline

* Track deals across stages:

  * Negotiation
  * Agreement
  * Closed
  * Cancelled

---

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication
* bcryptjs for password hashing

---

## Project Structure

```bash
real-estate-crm-v2/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## Installation & Setup

### Prerequisites

* Node.js (v18+)
* PostgreSQL

---

## Backend Setup

### 1. Navigate to backend

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env` file:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=real_estate_crm
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=7d
```

---

### 4. Setup Database

Start PostgreSQL:

```bash
sudo systemctl start postgresql
```

Create database:

```bash
sudo -u postgres psql -c "CREATE DATABASE real_estate_crm;"
```

Run schema:

```bash
sudo -u postgres psql -d real_estate_crm -f src/config/schema.sql
```

---

### 5. Run backend

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

## Frontend Setup

### 1. Navigate to frontend

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 4. Run frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

## API Endpoints

Base URL:

```text
http://localhost:5000/api
```

---

### Health Check

```http
GET /api/health
```

Response:

```json
{
  "status": "OK",
  "message": "Real Estate CRM API is running"
}
```

---

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

---

## Leads

```http
GET    /api/leads
POST   /api/leads
PUT    /api/leads/:id
DELETE /api/leads/:id
```

---

## Properties

```http
GET    /api/properties
POST   /api/properties
PUT    /api/properties/:id
DELETE /api/properties/:id
```

---

## Clients

```http
GET    /api/clients
POST   /api/clients
PUT    /api/clients/:id
DELETE /api/clients/:id
```

---

## Deals

```http
GET    /api/deals
POST   /api/deals
PUT    /api/deals/:id
DELETE /api/deals/:id
```

---

## Agents

```http
GET    /api/agents
POST   /api/agents
PUT    /api/agents/:id
DELETE /api/agents/:id
```

---

## Error Responses

### 404 Not Found

```json
{
  "error": "Route not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Something went wrong",
  "details": "Error message"
}
```

---

## Notes

* All protected routes require a JWT token:

```http
Authorization: Bearer <token>
```

* Token is returned on successful login.

* Backend uses:

  * bcryptjs for password hashing
  * JWT for authentication
  * PostgreSQL for data storage

---

## Summary

| Module     | Base Route      |
| ---------- | --------------- |
| Auth       | /api/auth       |
| Leads      | /api/leads      |
| Properties | /api/properties |
| Clients    | /api/clients    |
| Deals      | /api/deals      |
| Agents     | /api/agents     |


## Default Credentials

```text
Email: admin@crm.com
Password: admin123
```

---

## Common Issues & Fixes

### 1. Database connection failed

* Ensure PostgreSQL is running
* Check `.env` credentials
* Verify `pg_hba.conf` uses `md5`

---

### 2. Login not working

* Ensure password is hashed using bcryptjs
* Ensure frontend API URL points to backend (port 5000)

---

### 3. 401 Unauthorized

* Token missing or expired
* Check localStorage for `crm_token`

---

## Future Improvements

* Role-based access control
* File/image uploads
* Notifications system
* Deployment with Docker
* CI/CD pipeline

---

## Conclusion

PropCRM is a scalable and modular full-stack application demonstrating:

* RESTful API design
* Secure authentication
* Clean frontend-backend separation
* Real-world CRM functionality

