# BlockStak Report Management System (MERN Stack)

Welcome to the BlockStak Report Management System! This project is a backend implementation of a Report Management System using the MERN stack. This README will guide you through setting up and using the application.

## Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shehjad97/BlockStakReportManagementMERN.git
   ```

2. Navigate to the project directory:

   ```bash
   cd BlockStakReportManagementMERN
   ```

3. Install dependencies for both the server and client:

   ```bash
   npm install
   ```

## Running the Application

1. Setup environment variable:

   Change `.env.example` file to `.env` to set environment variable

2. Start the server:

   ```bash
   npm start
   ```

   The project will run on `http://localhost:3000`.

## API Endpoints

### User Registration and Authentication

- `POST /auth/register`: Register a new user (Regular User or Admin) with the provided details.

- `POST /auth/login`: Login with your credentials (email and password) to receive a JWT cookie with a one-hour expiration time.

- `POST /auth/logout`: Logout.

- `POST /auth/make-admin`: Make an user from regular to admin. (Admin only).

### Accessing Report Data

- `GET /reports`: Get a list of reports with details (with pagination) such as ID, name, address, phone, email, profession, and favorite colors.

### Admin Actions

- `POST /reports/add`: Create a new report (Admin only).

- `PUT /reports/update/:id`: Edit an existing report (Admin only).

- `DELETE /reports/delete/:id`: Delete a report (Admin only).

### JWT Token Expiry

- The JWT token expires after one hour. If your session is active and the token expires, the application will refresh the token automatically.

## Testing

To test the API endpoints, you can import the provided Postman collection:

[Postman Collection](postman/Blockstak.postman_collection.json)