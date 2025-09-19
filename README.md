# Work Orders App - Next.js Full-Stack Application

A complete Work Orders management system built with Next.js, NextAuth, Prisma, and Tailwind CSS. This application allows users to create, manage, and track work orders with role-based access control.

## Features

### Core Functionality
- **Authentication**: Secure login with NextAuth (Credentials + JWT)
- **Role-based Access**: Users can manage their own orders, Managers can manage all orders
- **Order Management**: Create, view, edit, and delete work orders
- **Search & Filtering**: Search orders by title/description, filter by status and priority
- **Pagination**: Server-side pagination for better performance
- **Real-time Updates**: Optimistic UI updates with server-side validation

### User Roles
- **User**: Can create, view, and edit their own orders
- **Manager**: Can view all orders, assign orders to users, and change order status

### Order Features
- **Order Fields**: Title, Description, Priority (Low/Medium/High), Status (Open/In Progress/Completed/Cancelled)
- **Assignment**: Managers can assign orders to specific users
- **Inline Editing**: Edit orders directly on the detail page
- **Validation**: Server-side validation with Zod schemas

## Prerequisites

- Node.js 20+ 
- npm or yarn package manager
- Git

## Step-by-Step Setup Guide

### 1. Clone and Install Dependencies

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd pixel-nextjs-codetest

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy the environment template
cp .env.example .env
```

Edit the `.env` file and add the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Important**: Replace `your-secret-key-here` with a secure random string. You can generate one using:
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with test data
npm run seed
```

This will create:
- SQLite database file (`dev.db`)
- Two test users:
  - **Manager**: `manager@example.com` / `Password123!`
  - **User**: `user@example.com` / `Password123!`
- Sample work orders

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 5. Access the Application

1. **Login**: Navigate to `/login` or click "Sign in" in the header
2. **Test Accounts**:
   - Manager account: `manager@example.com` / `Password123!`
   - User account: `user@example.com` / `Password123!`
3. **Orders**: After login, you'll be redirected to `/orders`

## Application Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── orders/            # Orders pages
│   │   ├── [id]/         # Order detail page
│   │   ├── new/          # Create order page
│   │   └── page.tsx      # Orders list page
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── order-detail.tsx  # Order detail component
│   ├── order-filters.tsx # Search and filter component
│   ├── order-list.tsx    # Orders list component
│   ├── pagination.tsx    # Pagination component
│   └── signout.tsx       # Sign out component
├── lib/                   # Utility libraries
│   ├── actions.ts        # Server actions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── validations.ts    # Zod schemas
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Database migrations
│   └── seed.ts           # Database seeding script
└── middleware.ts         # NextAuth middleware
```

## Usage Guide

### For Users
1. **Login** with your user account
2. **View Orders**: See all your created orders on the main page
3. **Create Order**: Click "Create Order" to add a new work order
4. **Edit Order**: Click on any order to view details and edit inline
5. **Search & Filter**: Use the search bar and filters to find specific orders

### For Managers
1. **Login** with your manager account
2. **View All Orders**: See orders from all users
3. **Assign Orders**: Edit orders to assign them to specific users
4. **Change Status**: Update order status (Open → In Progress → Completed)
5. **Manage Users**: View and assign orders to any user in the system

## API Endpoints

### Server Actions (in `lib/actions.ts`)
- `createOrder(formData)` - Create a new work order
- `updateOrder(orderId, formData)` - Update an existing order
- `getOrders(filters)` - Get paginated orders with filters
- `getOrderById(orderId)` - Get a specific order by ID
- `getAllUsers()` - Get all users (managers only)

### Authentication
- `/api/auth/[...nextauth]` - NextAuth authentication endpoints
- `/api/health` - Health check endpoint

## Database Schema

### User Model
```prisma
model User {
  id             String   @id @default(cuid())
  name           String?
  email          String   @unique
  role           String   @default("USER")
  hashedPassword String
  createdAt      DateTime @default(now())
  ordersCreated  WorkOrder[] @relation("OrdersCreated")
  ordersAssigned WorkOrder[] @relation("OrdersAssigned")
}
```

### WorkOrder Model
```prisma
model WorkOrder {
  id           String   @id @default(cuid())
  title        String
  description  String
  priority     String   @default("MED")
  status       String   @default("OPEN")
  createdById  String
  assignedToId String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  createdBy    User @relation("OrdersCreated", fields: [createdById], references: [id])
  assignedTo   User? @relation("OrdersAssigned", fields: [assignedToId], references: [id])
}
```

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run seed         # Seed database with test data
npx prisma generate  # Generate Prisma client
npx prisma migrate dev # Run database migrations
npx prisma studio    # Open Prisma Studio (database GUI)
```

## Security Features

- **Server-side Authorization**: All operations are validated on the server
- **Input Validation**: Zod schemas validate all user inputs
- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Secure session management with NextAuth
- **Route Protection**: Middleware protects all order routes

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Ensure the database file exists
   npx prisma migrate dev --name init
   ```

2. **Authentication Issues**
   ```bash
   # Check your NEXTAUTH_SECRET in .env
   # Ensure it's a secure random string
   ```

3. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

4. **Prisma Client Issues**
   ```bash
   # Regenerate Prisma client
   npx prisma generate
   ```

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify your environment variables
3. Ensure all dependencies are installed
4. Check the database connection

## Production Deployment

For production deployment:

1. **Environment Variables**: Set production values for `DATABASE_URL` and `NEXTAUTH_SECRET`
2. **Database**: Use a production database (PostgreSQL, MySQL, etc.)
3. **Build**: Run `npm run build` to create optimized production build
4. **Start**: Use `npm run start` to run the production server

## License

This project is part of a coding assessment for Pixel Image.
