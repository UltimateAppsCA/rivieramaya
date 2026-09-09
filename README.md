# Travel Booking App

A full-stack React application for travel booking and payments, built with Next.js, TypeScript, Tailwind CSS, Prisma, Neon PostgreSQL, and PayPal integration.

## Features

- User registration and authentication
- Admin dashboard for managing customers and services
- Customer dashboard for viewing services and purchase history
- PayPal payment integration for purchases
- Invoice sending via PayPal links

## Setup

1. Clone the repository and navigate to the project directory.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a Neon PostgreSQL database.
   - Update `.env` with your DATABASE_URL.

4. Set up PayPal:
   - Create a PayPal developer account.
   - Update `.env` with PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

6. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

7. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

- DATABASE_URL: Your Neon PostgreSQL connection string
- JWT_SECRET: Secret for JWT tokens
- PAYPAL_CLIENT_ID: PayPal client ID
- PAYPAL_CLIENT_SECRET: PayPal client secret
- NEXT_PUBLIC_BASE_URL: Base URL for the app (default: http://localhost:3000)

## Important Pages

- `/` — Landing page
- `/login` — Login page
- `/register` — Registration page
- `/dashboard` — Admin or customer dashboard after login
- `/purchase/success` — PayPal success return page
- `/purchase/cancel` — PayPal cancel return page

## API Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user
- GET /api/services - Get all services
- POST /api/services - Create service (admin)
- GET /api/users - Get all users (admin)
- POST /api/users - Create user (admin)
- GET /api/purchases - Get purchases
- POST /api/purchases - Create purchase
- POST /api/purchases/[id]/capture - Capture payment
