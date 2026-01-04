# Authentication API

A simple authentication backend built with Node.js, Express, and MongoDB.  
It supports user signup, login, forgot password, and password reset using OTP with expiration.

## Features
- User Signup
- User Login
- Forgot Password (OTP generation)
- Reset Password with OTP expiry
- Password hashing for security

## Tech Stack
- Node.js
- Express.js
- MongoDB & Mongoose
- bcrypt
- dotenv

## Project Structure

project-root/
├── auth.js
├── package.json
├── .env
└── src/
├── config/
├── controllers/
├── models/
└── routes/

| Method | Endpoint         | Description                     |
| ------ | ---------------- | ------------------------------- |
| POST   | /signup          | Register a new user             |
| POST   | /login           | Login user                      |
| POST   | /forget-password | Generate OTP for password reset |
| POST   | /reset-password  | Reset password using OTP        |


# OTP Expiry
When an OTP is generated, an expiration time is stored.
During password reset, the OTP is validated and checked to ensure it has not expired.# login-otpexpiry
