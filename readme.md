# GrowSphere Server

## Gardening Tips & Advice Platform - Server 🌿

This repository contains the backend/server-side implementation for the **Gardening Tips & Advice Platform**. The backend handles authentication, post management, payment processing, and serves as the API for the frontend application.

## Table of Contents

- [Features](#features)
- [Core Technologies](#core-technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Features

1. **JWT-based Authentication**

   - Secure registration and login for users.
   - Token-based session management for API requests.

2. **User Profile Management**

   - API endpoints to update user information.
   - Profile verification using Aamarpay or Stripe for payment.

3. **Post Management**

   - Endpoints for creating, editing, deleting, and fetching gardening tips.
   - Categories and premium content flagging.
   - Post upvote/downvote system.

4. **Payment Integration**

   - Aamarpay payment gateway for processing payments for premium content and profile verification.

5. **Admin Dashboard Support**
   - Manage users, posts, and payments.
   - View statistics for user activity, payments, and posts.

---

## Core Technologies

- **Node.js**: Runtime environment for JavaScript on the server.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: Database for storing user, post, and payment data.
- **JWT**: JSON Web Tokens for user authentication.
- **Aamarpay**: Payment gateways for processing payments.

---

## Installation

### 1. Clone the repository:

```bash
git clone https://github.com/salmanabdullahfahim/growSphere-server.git
cd growSphere-server
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Create a `.env` file:

```bash
PORT=
database_url=
JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRE_IN=
bcrypt_salt_rounds=10


STORE_ID=
SIGNATURE_KEY=
PAYMENT_URL=
PAYMENT_VERIFY_URL=

```

### 4. Start the server:

```bash
npm run start:dev
```

---
