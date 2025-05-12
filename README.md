# Authentication Backend

This is an authentication backend built with **Express.js**, **Mongoose**, and **MongoDB**, offering **JWT-based user authentication** and **email verification** functionality. It uses **Mailtrap** and **Nodemailer** for handling email verification and sends verification emails with unique tokens.

---

## Features
- **JWT Authentication**: Secure user login and access control using JWT tokens.
- **Email Verification**: Send verification emails with tokens to users for account verification.
- **Token Storage in Cookies**: JWT tokens are securely stored in cookies for persistent sessions.
- **Password Reset**: Allows users to reset their passwords using a unique token sent to their email.
- **Express.js**: Backend routing and request handling.
- **Mongoose**: MongoDB object modeling to interact with the database.

---

## Technologies
- **Node.js**: JavaScript runtime for building the backend server.
- **Express.js**: Web framework for routing.
- **Mongoose**: MongoDB ODM (Object Data Modeling) library.
- **JWT (JSON Web Tokens)**: Token-based authentication for secure user sessions.
- **Nodemailer**: For sending emails.
- **Mailtrap**: For testing and sending emails in development.

---

## Setup

### Prerequisites
- **Node.js** and **npm** installed on your machine.
- **MongoDB** database instance (local or cloud) for storing user data.

---

### Installation
 **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
