# Haki Kenya - Legal Aid Platform

## Overview

Haki Kenya is a comprehensive legal aid platform designed to provide accessible legal resources and affordable professional guidance to Kenyans. The application features a modern web interface built with React, TypeScript, and Tailwind CSS, backed by a robust Express server with PostgreSQL database integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: React Router DOM for client-side navigation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Supabase Auth for user management and security

### Database Design
- **Primary Database**: PostgreSQL with Drizzle schema definitions
- **Schema Location**: `shared/schema.ts` for shared type definitions
- **Migration Strategy**: Drizzle Kit for schema migrations
- **Connection**: Neon serverless PostgreSQL with connection pooling

## Key Components

### User Management System
- Multi-role authentication (clients, lawyers, paralegals)
- Profile management with role-specific fields
- Secure password reset functionality
- Real-time session management

### Legal Services Platform
- **Question & Answer System**: Clients can submit legal questions for lawyer review
- **Consultation Booking**: Scheduled video/phone/in-person consultations
- **Document Library**: Template downloads and user document storage
- **Anonymous Reporting**: Secure reporting system for sensitive legal issues

### Communication Features
- Real-time notifications system
- Multi-language support (English/Kiswahili)
- Responsive design for mobile and desktop access
- File upload and document management

### Professional Features
- Lawyer directory with specialization filtering
- Calendar management for legal professionals
- Administrative dashboard for report management
- Review and rating system for service quality

## Data Flow

1. **User Authentication**: Supabase handles authentication, profile data stored in PostgreSQL
2. **Legal Questions**: Client submits → Stored in database → Real-time notification to lawyers → Lawyer responds → Client notified
3. **Consultations**: Client books → Lawyer confirms → Calendar integration → Meeting link generation → Follow-up reviews
4. **Documents**: Template browsing → Download tracking → User uploads → Secure storage → Access control
5. **Reports**: Anonymous submission → Admin review → Assignment to lawyers → Status tracking → Resolution

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Supabase**: Authentication and real-time subscriptions
- **Replit**: Development environment and deployment platform

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **React Hook Form**: Form handling with validation

### Development Tools
- **Vite**: Build tool with hot module replacement
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast JavaScript bundler for production
- **Drizzle Kit**: Database migrations and introspection

## Deployment Strategy

### Development Environment
- Vite dev server with hot reload
- Express server with middleware for API routes
- Real-time database connections for immediate feedback
- Error boundary implementation for graceful error handling

### Production Build
- Vite builds optimized React client bundle
- ESBuild compiles Express server for Node.js runtime
- Static assets served from Express with proper caching headers
- Environment variables for database and authentication configuration

### Database Management
- Schema defined in shared TypeScript files
- Migrations managed through Drizzle Kit
- Connection pooling for efficient resource usage
- Backup and recovery through Neon platform

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 03, 2025. Initial setup