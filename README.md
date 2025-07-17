# CyberAware - Frontend Application

A modern cybersecurity education platform designed to teach digital safety in just 10 days. Built for lecturers, staff, and students to learn essential cybersecurity skills through interactive modules and assessments.

## 🛡️ About CyberAware

CyberAware is an educational platform that makes cybersecurity accessible to everyone, regardless of technical background. The application provides a structured 10-day learning journey covering essential topics like phishing detection, password security, and social engineering awareness.

### Key Features

- **📚 10-Day Learning Program**: Structured daily modules covering essential cybersecurity topics
- **🎯 Beginner-Friendly**: No technical background required - designed for everyone
- **📱 Mobile-First Design**: Responsive interface optimized for mobile devices
- **🏆 Certification System**: Earn digital certificates by scoring 80% or above on quizzes
- **🔐 User Authentication**: Secure signup, signin, password reset, and account verification
- **📊 Progress Tracking**: Visual progress indicators and completion tracking
- **🎨 Modern UI**: Clean, accessible interface with custom design system

## 🏗️ Architecture & Tech Stack

### Frontend Framework
- **Next.js 15.4.1** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript** - Type-safe development

### Styling & UI
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Custom Design System** - Consistent UI components and theming
- **Responsive Design** - Mobile-first approach

### State Management & Data Fetching
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management and caching
- **React Hook Form** - Form handling with validation

### Development Tools
- **ESLint** - Code linting with custom configuration
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality
- **TypeScript** - Static type checking

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── (home)/                   # Landing page route group
│   ├── auth/                     # Authentication pages
│   │   ├── signin/               # User login
│   │   ├── signup/               # User registration
│   │   ├── reset-password/       # Password reset
│   │   └── verify-account/       # Account verification
│   ├── dashboard/                # User dashboard
│   ├── -components/              # Shared app components
│   ├── layout.tsx                # Root layout
│   └── Providers.tsx             # App providers setup
├── components/                   # Reusable UI components
│   ├── common/                   # Common utilities
│   ├── icons/                    # Icon components
│   └── ui/                       # UI component library
├── lib/                          # Utility functions
├── public/                       # Static assets
└── tailwind.css                  # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd cyber-aware
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `pnpm dev` - Start development server with Turbo
- `pnpm build` - Build production application
- `pnpm start` - Start production server
- `pnpm lint:eslint` - Run ESLint checks
- `pnpm lint:format` - Format code with Prettier
- `pnpm lint:type-check` - Run TypeScript type checking

## 🎨 Design System

The application uses a custom design system with:

- **Color Palette**: AECES Blue, Unizik Orange, and neutral grays
- **Typography**: Work Sans font family with multiple weights
- **Components**: Consistent button styles, form inputs, and layout components
- **Responsive Breakpoints**: Mobile-first responsive design

## 🔐 Authentication Flow

1. **User Registration**: Email-based signup with form validation
2. **Account Verification**: Email verification process
3. **User Login**: Secure authentication
4. **Password Reset**: Self-service password recovery

## 📚 Learning Experience

### Dashboard Features
- **Progress Tracking**: Visual progress bar showing completion percentage
- **Module Access**: Sequential unlocking of daily modules
- **Quiz System**: Assessment with multiple attempts (up to 5)
- **Certificate Generation**: Digital certificates for successful completion

### Content Structure
- **Day 1-10**: Progressive learning modules
- **Interactive Elements**: Engaging content delivery
- **Assessment**: Final quiz requiring 80% score
- **Certification**: Downloadable completion certificates

## 🏫 Institutional Partnership

Powered by:
- **AECES** (Association of Electronic and Computer Engineering Students)
- **Nnamdi Azikiwe University, Awka**

Developed by the 2025 final-year students of the Department of Electronics and Computer Engineering.

## 🤝 Contributing

This project is developed by students for educational purposes. For contributions or questions, please contact the development team.

## 📄 License

This project is developed as part of an academic initiative by AECES 2025 Set - Computer Option.

---

**Ready to Stay Safe Online?** Join thousands of users becoming cyber smart in just 10 days! 🛡️