# MongoDB & NextAuth Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/style-at-home

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create database: `style-at-home`

### Option 2: MongoDB Atlas (Cloud)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` with your Atlas connection string

## NextAuth Secret

Generate a strong secret key:
```bash
openssl rand -base64 32
```

## Database Models

The following models are automatically created:
- **User**: Authentication and user management
- **Product**: Product catalog with images and stock
- **Order**: Customer orders with shipping details
- **CartItem**: Shopping cart functionality

## Admin Access

To create an admin user:
1. Sign up normally through the app
2. Manually update the user's role to 'admin' in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## API Endpoints

- `GET /api/products` - Fetch all products
- `POST /api/products` - Create new product (admin only)
- `GET /api/orders` - Fetch user orders
- `POST /api/orders` - Create new order

## Features

- **Authentication**: NextAuth with JWT strategy
- **Authorization**: Role-based access control
- **Database**: MongoDB with Mongoose ODM
- **Admin Panel**: Product management interface
- **Cart System**: Persistent shopping cart
- **Order Management**: Complete order workflow
