# Haki Kenya - Legal Aid Platform

![Haki Kenya Logo](https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=200&fit=crop&crop=center)

**Empowering Kenyans with accessible legal resources and affordable professional guidance.**

## 🌟 Overview

Haki Kenya is a comprehensive legal aid platform designed to bridge the justice gap in Kenya by providing:

- **Affordable Legal Consultations** - Connect with qualified lawyers at transparent rates
- **Pro Bono Legal Services** - Access to lawyers offering free legal assistance
- **Legal Document Templates** - Download ready-to-use legal forms and documents
- **Step-by-Step Legal Guides** - Clear instructions for common legal procedures
- **Anonymous Reporting** - Secure platform for reporting legal issues
- **Real-time Legal Q&A** - Get answers from qualified legal professionals

## 🚀 Features

### For Clients
- ✅ **Legal Question Submission** - Ask legal questions and get professional answers
- ✅ **Consultation Booking** - Schedule video, phone, or in-person consultations
- ✅ **Document Library** - Access and download legal document templates
- ✅ **File Upload & Management** - Securely store and manage legal documents
- ✅ **Anonymous Reporting** - Report legal issues while maintaining anonymity
- ✅ **Review System** - Rate and review legal consultations
- ✅ **Real-time Notifications** - Get instant updates on your cases

### For Lawyers & Paralegals
- ✅ **Case Management Dashboard** - Manage legal questions and consultations
- ✅ **Calendar Integration** - Schedule and manage appointments
- ✅ **Client Communication** - Respond to questions and provide legal guidance
- ✅ **Report Management** - Review and manage anonymous reports
- ✅ **Profile Management** - Showcase specializations and experience

### Platform Features
- ✅ **Multilingual Support** - Available in English and Kiswahili
- ✅ **Real-time Updates** - Live notifications and status updates
- ✅ **Secure Authentication** - Email/password authentication with Supabase
- ✅ **Role-based Access Control** - Different permissions for clients, lawyers, and admins
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile devices
- ✅ **Error Handling** - Comprehensive error boundaries and user-friendly messages

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible UI components
- **React Hook Form** - Performant forms with easy validation
- **React Query** - Server state management and caching
- **React Router** - Client-side routing
- **React Dropzone** - File upload with drag-and-drop

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security (RLS)** - Database-level security policies
- **Real-time Subscriptions** - Live updates using Supabase real-time
- **Supabase Storage** - Secure file storage with access controls
- **Supabase Auth** - Authentication and user management

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic vendor prefixing

## 📁 Project Structure

```
haki-kenya/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── auth/             # Authentication components
│   │   ├── consultations/    # Consultation-related components
│   │   ├── documents/        # Document management components
│   │   ├── i18n/            # Internationalization components
│   │   ├── legal/           # Legal question components
│   │   ├── notifications/   # Notification system
│   │   ├── reports/         # Anonymous reporting components
│   │   └── ui/              # Base UI components (shadcn/ui)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries and configurations
│   ├── pages/               # Page components
│   └── assets/              # Images and other assets
├── supabase/
│   └── migrations/          # Database migration files
├── deployment-guide.md      # Detailed deployment instructions
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/haki-kenya.git
   cd haki-kenya
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the migration files in `supabase/migrations/` in the Supabase SQL editor
   - Set up storage buckets (see deployment guide)

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8080`

## 🗄️ Database Schema

### Core Tables

#### `profiles`
User profiles with role-based information
```sql
- id (uuid, primary key)
- email (text, unique)
- full_name (text)
- role (enum: client, lawyer, paralegal)
- phone (text, optional)
- location (text, optional)
- specialization (text, optional)
- bar_number (text, optional)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `legal_questions`
Legal questions submitted by clients
```sql
- id (uuid, primary key)
- client_id (uuid, foreign key)
- lawyer_id (uuid, foreign key, optional)
- title (text)
- description (text)
- category (text)
- status (enum: pending, answered, closed)
- answer (text, optional)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `consultations`
Consultation appointments between clients and lawyers
```sql
- id (uuid, primary key)
- client_id (uuid, foreign key)
- lawyer_id (uuid, foreign key)
- title (text)
- description (text)
- consultation_type (enum: video, phone, in_person)
- scheduled_date (timestamptz)
- duration_minutes (integer)
- status (enum: pending, confirmed, completed, cancelled)
- meeting_link (text, optional)
- location (text, optional)
- price (decimal)
- notes (text, optional)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `document_templates`
Public legal document templates
```sql
- id (uuid, primary key)
- title (text)
- description (text, optional)
- category (text)
- file_path (text)
- file_size (bigint, optional)
- file_type (text, optional)
- download_count (integer)
- is_active (boolean)
- created_by (uuid, foreign key, optional)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `user_documents`
Private user-uploaded documents
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- title (text)
- description (text, optional)
- file_path (text)
- file_size (bigint, optional)
- file_type (text, optional)
- is_private (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `anonymous_reports`
Anonymous legal issue reports
```sql
- id (uuid, primary key)
- category (text)
- title (text)
- description (text)
- location (text, optional)
- incident_date (date, optional)
- status (enum: pending, under_review, resolved, closed)
- priority (enum: low, medium, high, urgent)
- assigned_to (uuid, foreign key, optional)
- admin_notes (text, optional)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `consultation_reviews`
Client reviews for completed consultations
```sql
- id (uuid, primary key)
- consultation_id (uuid, foreign key)
- client_id (uuid, foreign key)
- lawyer_id (uuid, foreign key)
- rating (integer, 1-5)
- review_text (text, optional)
- is_approved (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)
```

## 🔐 Security & Permissions

### Row Level Security (RLS) Policies

The application implements comprehensive RLS policies to ensure data security:

#### Client Permissions
- Can only view/manage their own questions, consultations, and documents
- Can submit anonymous reports (no authentication required)
- Can create reviews for their completed consultations

#### Lawyer/Paralegal Permissions
- Can view and respond to all legal questions
- Can manage consultations assigned to them
- Can view and manage anonymous reports
- Can approve consultation reviews

#### Public Access
- Anyone can view active document templates
- Anonymous report submission (no authentication required)

### Authentication
- Email/password authentication via Supabase Auth
- Email confirmation disabled by default (can be enabled)
- Password reset functionality included
- Role-based access control throughout the application

## 🌐 Internationalization

The platform supports multiple languages:

### Supported Languages
- **English** (default)
- **Kiswahili** (Swahili)

### Implementation
- Translation system in `src/components/i18n/translations.ts`
- Language switcher component with persistent preferences
- Comprehensive translation coverage for all UI elements
- Cultural adaptation for legal terminology

### Adding New Languages
1. Add translations to `translations.ts`
2. Update the language list in `LanguageSwitcher.tsx`
3. Test all UI components with new language

## 📱 Real-time Features

### Live Notifications
- New legal questions for lawyers
- Question answers for clients
- Consultation status updates
- Anonymous report submissions
- Review submissions

### Real-time Updates
- Question status changes
- Consultation confirmations
- Document uploads
- Report status updates

### Implementation
Uses Supabase real-time subscriptions with custom hooks for:
- `useNotifications` - Manages notification state and real-time updates
- Real-time database subscriptions for live data updates
- Toast notifications for immediate user feedback

## 🎨 UI/UX Design

### Design System
- **Color Palette**: Professional blue and green theme with trust-building colors
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent 8px spacing system
- **Components**: Accessible, reusable components from shadcn/ui
- **Responsive**: Mobile-first design with breakpoints for all screen sizes

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast color ratios
- Focus management

### User Experience
- Intuitive navigation with clear information architecture
- Progressive disclosure for complex features
- Loading states and error handling
- Contextual help and guidance
- Smooth animations and transitions

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and authentication
- [ ] Legal question submission and answering
- [ ] Consultation booking and management
- [ ] Document upload and download
- [ ] Anonymous report submission
- [ ] Real-time notifications
- [ ] Language switching
- [ ] Mobile responsiveness
- [ ] Error handling

### Recommended Testing Tools
- **Cypress** - End-to-end testing
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Lighthouse** - Performance and accessibility auditing

## 📈 Performance Optimization

### Implemented Optimizations
- **Code Splitting** - Lazy loading of route components
- **Image Optimization** - Responsive images with proper sizing
- **Bundle Analysis** - Vite's built-in bundle analyzer
- **Caching** - React Query for server state caching
- **Real-time Efficiency** - Targeted Supabase subscriptions

### Performance Monitoring
- Web Vitals tracking
- Error boundary implementation
- Loading state management
- Optimistic UI updates

## 🚀 Deployment

### Supported Platforms
- **Vercel** (Recommended)
- **Netlify**
- **Any static hosting service**

### Quick Deploy
1. **Vercel**: Connect GitHub repository and deploy automatically
2. **Netlify**: Drag and drop the `dist` folder after building

### Detailed Instructions
See `deployment-guide.md` for comprehensive deployment instructions including:
- Environment variable setup
- Supabase configuration
- Custom domain setup
- CI/CD pipeline configuration
- Security considerations
- Monitoring and analytics setup

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use ESLint configuration provided
- Write meaningful commit messages
- Add comments for complex logic
- Ensure responsive design
- Test on multiple browsers

### Areas for Contribution
- Additional language translations
- New legal document templates
- Enhanced UI components
- Performance optimizations
- Accessibility improvements
- Testing coverage
- Documentation improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and deployment guide
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

### Common Issues
1. **Supabase Connection**: Verify environment variables and project settings
2. **Build Errors**: Ensure Node.js 18+ and clear node_modules if needed
3. **Authentication Issues**: Check Supabase auth settings and RLS policies
4. **File Upload Problems**: Verify storage bucket configuration and policies

## 🙏 Acknowledgments

- **Supabase** - For providing an excellent backend-as-a-service platform
- **shadcn/ui** - For beautiful and accessible UI components
- **Tailwind CSS** - For the utility-first CSS framework
- **React Community** - For the amazing ecosystem and tools
- **Legal Aid Organizations** - For inspiration and guidance on legal aid best practices

## 📊 Project Status

### Current Version: 1.0.0

### Completed Features ✅
- User authentication and role management
- Legal question submission and answering system
- Consultation booking and calendar management
- Document library and file upload system
- Anonymous reporting system
- Real-time notifications
- Multilingual support (English/Kiswahili)
- Review and rating system
- Admin dashboard for lawyers
- Responsive design
- Error handling and user feedback

### Roadmap 🗺️
- [ ] Mobile app development (React Native)
- [ ] Advanced search and filtering
- [ ] Payment integration for consultations
- [ ] Video call integration
- [ ] AI-powered legal document analysis
- [ ] SMS notifications
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations
- [ ] Offline support
- [ ] Advanced reporting and insights

---

**Built with ❤️ for the people of Kenya**

*Haki Kenya - Making justice accessible to all*