# CareerFlow

A full-stack job application tracker for organizing companies, job applications, deadlines, and recruitment progress in one secure workspace.

CareerFlow is built with Next.js, TypeScript, PostgreSQL, Prisma, and Auth.js. The project focuses on secure data ownership, structured application tracking, responsive interfaces, and maintainable full-stack architecture.

## Project Status

**Active development**

The current version includes authentication, role-based authorization, company management, and job application creation and listing.

Additional recruitment workflow features are planned and documented in the roadmap below.

## Current Features

### Authentication and Authorization

- User registration, login, and logout
- Secure password hashing with bcrypt
- JWT-based sessions using Auth.js
- `USER` and `ADMIN` roles
- Protected dashboard and admin routes
- Guest-only login and registration routes
- Inactive-account access prevention
- Server-side authentication and authorization guards

### Company Management

- View companies owned by the authenticated user
- Search active companies
- Create and edit company profiles
- Store website, industry, size, location, description, logo, and LinkedIn URL
- Archive companies without permanently deleting their data
- View and restore archived companies
- Prevent access to companies owned by another user
- Loading, error, empty, and not-found states

### Job Application Management

- View active job applications
- Search applications by position or company
- Filter applications by status and company
- Sort applications using supported query parameters
- Create job applications linked to active companies
- Track employment type, work type, location, salary range, priority, and source
- Store job descriptions, requirements, deadlines, and recruiter contact details
- Create the initial application status history automatically
- Validate company ownership before creating an application
- Display responsive empty, filtered, and success states

### Interface

- Responsive dashboard layout
- Desktop sidebar and mobile navigation
- Light and dark theme support
- Accessible form labels and validation messages
- Reusable components built with shadcn/ui and Radix UI
- Loading, error, and not-found pages
- Consistent feedback for form and data-management actions

## Application Statuses

CareerFlow supports the following recruitment stages:

- Wishlist
- Applied
- Screening
- Interview
- Technical Test
- Offer
- Accepted
- Rejected
- Withdrawn

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Radix UI
- Lucide React
- next-themes

### Backend and Validation

- Next.js Server Actions
- Auth.js
- Zod
- bcryptjs

### Database

- PostgreSQL
- Prisma ORM 7
- Prisma PostgreSQL adapter
- Database migrations and seed data

### Development Tools

- ESLint
- Prettier
- TypeScript Compiler
- Git and GitHub

## Architecture Highlights

- Next.js App Router architecture
- Server Components and Server Actions
- Centralized Zod validation schemas
- Reusable authentication and authorization guards
- User-scoped database queries
- Transactional job application creation
- Soft deletion for company records
- Relational PostgreSQL data model
- Environment-variable validation
- Reusable loading, error, and empty states

## Data Model

The database schema includes models for:

- Users and authentication sessions
- Companies
- Job applications
- Application status history
- Interviews
- Notes
- Documents
- Reminders
- Tags
- Activity logs
- Notifications

Some schema modules are prepared for future development and are not yet available through the user interface.

## Getting Started

### Prerequisites

Make sure the following tools are installed:

- Node.js 20.19 or newer
- npm
- PostgreSQL database
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/farrellokajaya/careerflow.git
```

Enter the project directory:

```bash
cd careerflow
```

Install dependencies:

```bash
npm install
```

Create a local environment file from `.env.example`, then configure at least:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

AUTH_SECRET="replace-with-a-secure-random-secret"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

SEED_ADMIN_EMAIL="your-admin-email@example.com"
SEED_ADMIN_PASSWORD="replace-with-a-strong-password"
SEED_USER_EMAIL="your-user-email@example.com"
SEED_USER_PASSWORD="replace-with-a-strong-password"
```

Never commit the `.env` file or real credentials.

Generate the Prisma Client:

```bash
npm run db:generate
```

Apply database migrations:

```bash
npm run db:migrate
```

Optionally populate the database with development data:

```bash
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint |
| `npm run lint:fix` | Fixes supported ESLint issues |
| `npm run typecheck` | Checks TypeScript types |
| `npm run format` | Formats project files with Prettier |
| `npm run format:check` | Checks file formatting |
| `npm run check` | Runs lint, type checking, formatting checks, and production build |
| `npm run db:generate` | Generates the Prisma Client |
| `npm run db:migrate` | Creates and applies development migrations |
| `npm run db:migrate:deploy` | Applies existing migrations in production |
| `npm run db:seed` | Populates the development database |
| `npm run db:studio` | Opens Prisma Studio |
| `npm run db:validate` | Validates the Prisma schema |
| `npm run db:check` | Checks database connectivity and configuration |

## Quality Checks

Before committing changes, run:

```bash
npm run check
```

This verifies:

1. ESLint rules
2. TypeScript type safety
3. Prettier formatting
4. Production build readiness

## Security Considerations

CareerFlow applies several security controls:

- Passwords are hashed before storage
- Database queries are scoped to the authenticated user
- Protected routes require an active authenticated session
- Admin pages require the `ADMIN` role
- Company ownership is verified during mutations
- Archived companies cannot be used for new applications
- Inputs and query parameters are validated with Zod
- Sensitive configuration is loaded through environment variables
- Destructive company deletion is replaced with a recoverable archive flow

## Roadmap

Planned development includes:

- Job application detail and editing
- Application archive and restore flow
- Status history management
- Interview scheduling
- Notes and reminders
- Document management
- Tags and advanced filtering
- Dashboard analytics
- Notifications
- Automated testing
- Production deployment

## Repository

[View CareerFlow on GitHub](https://github.com/farrellokajaya/careerflow)

## Author

**Farrel Lokajaya**

- [Portfolio](https://farrel-portofolio-liard.vercel.app/)
- [LinkedIn](https://www.linkedin.com/in/farrel-lokajaya-a25944203/)
- [GitHub](https://github.com/farrellokajaya)