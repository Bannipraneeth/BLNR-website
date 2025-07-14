# BLNR E-commerce Website

A modern e-commerce platform built with Next.js, Node.js, and MongoDB.

## Features

- User authentication with OTP verification
- Product browsing and searching
- Shopping cart functionality
- Secure checkout process
- Admin dashboard
- Order management
- Responsive design

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, OTP
- **Payment**: Razorpay

## Project Structure

```
blnr-ecommerce/
├── frontend/           # Next.js frontend application
├── backend/           # Node.js backend application
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

### Development

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## Environment Variables

Create `.env` files in both frontend and backend directories with the following variables:

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 