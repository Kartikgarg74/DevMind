# DevMind - AI-Powered Development Intelligence Platform

A modern, immersive developer intelligence platform that combines AI-powered code analysis, project management, and real-time collaboration features.

## 🚀 Features

### Core Features
- **AI-Powered Commit Messages**: Intelligent commit message generation with context awareness
- **Real-time Analytics**: Live project metrics and productivity insights
- **Project Management**: Comprehensive project tracking and task management
- **Voice Chat Interface**: Natural language interaction with AI assistant
- **3D Neural Core**: Immersive 3D visualization of AI processing
- **Real-time Notifications**: Live updates and collaboration features

### Technical Features
- **Modern UI/UX**: Futuristic design inspired by JARVIS and modern developer tools
- **TypeScript**: Full type safety and modern development experience
- **Supabase Integration**: Real-time database with authentication
- **Responsive Design**: Optimized for desktop and mobile devices
- **Performance Optimized**: Lazy loading, code splitting, and efficient rendering

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4, Framer Motion
- **3D Graphics**: React Three Fiber, Three.js
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI Integration**: Custom AI service with fallback mock data
- **Voice Recognition**: Web Speech API
- **State Management**: React Context + Custom hooks

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd devmind
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# GitHub OAuth (for authentication)
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
API_SECRET_KEY=your-api-secret-key-here

# Development Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Supabase Setup

1. **Create Supabase Project**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Database Setup**
   - Go to SQL Editor in Supabase Dashboard
   - Run the migration script from `supabase/migrations/001_initial_schema.sql`

3. **Authentication Setup**
   - Enable GitHub OAuth in Authentication > Settings
   - Create GitHub OAuth app and add credentials

4. **Storage Setup**
   - Create storage buckets: `avatars`, `documents`
   - Configure bucket policies for authenticated access

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
devmind/
├── src/
│   ├── components/          # React components
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── CommitTimeline.tsx
│   │   ├── CreateCommitForm.tsx
│   │   ├── NeuralCore3D.tsx
│   │   ├── NotificationSystem.tsx
│   │   ├── ProjectManager.tsx
│   │   ├── Sidebar.tsx
│   │   └── VoiceChatTerminal.tsx
│   ├── lib/                 # Utility libraries
│   │   ├── ai.ts           # AI service integration
│   │   ├── api.ts          # API service layer
│   │   ├── auth.ts         # Authentication service
│   │   ├── realtime.ts     # Real-time features
│   │   └── supabaseClient.ts
│   ├── pages/              # Next.js pages
│   │   ├── auth/           # Authentication pages
│   │   └── index.tsx       # Main dashboard
│   ├── styles/             # Global styles
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── supabase/               # Database migrations
└── package.json
```

## 🎨 Design System

### Color Palette
- **Background**: `#10131A` (Dark primary)
- **Neon Aqua**: `#00FFF7` (Primary accent)
- **Neon Indigo**: `#7F5CFF` (Secondary accent)
- **Neon Emerald**: `#00FF85` (Success/positive)
- **Neon Blue**: `#1E90FF` (Info/links)

### Typography
- **Primary**: Inter, Roboto (sans-serif)
- **Monospace**: Fira Code, JetBrains Mono (code)

### Components
- **Cards**: Rounded corners with subtle borders and shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Animations**: Framer Motion for smooth transitions
- **3D Elements**: React Three Fiber for immersive experiences

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error handling
- Add accessibility attributes

### Component Guidelines
- Use motion components for animations
- Implement proper loading states
- Add error boundaries where appropriate
- Use TypeScript interfaces for props
- Follow the established design patterns

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Similar to Vercel setup
- **Railway**: Good for full-stack deployments
- **Docker**: Use the provided Dockerfile

## 🔒 Security

### Environment Variables
- Never commit `.env.local` to version control
- Use different keys for development and production
- Rotate API keys regularly

### Authentication
- Implement proper session management
- Use Row Level Security (RLS) in Supabase
- Validate all user inputs

### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS in production
- Implement rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow
1. Create an issue for new features
2. Follow the established code style
3. Add tests for new functionality
4. Update documentation as needed
5. Ensure all checks pass before merging

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Turbopack Compilation Errors**
- Clear `.next` directory: `rm -rf .next`
- Restart development server

**Supabase Connection Issues**
- Verify environment variables
- Check Supabase project status
- Ensure database migrations are applied

**Authentication Problems**
- Verify GitHub OAuth setup
- Check callback URLs
- Clear browser cache and cookies

### Getting Help
- Create an issue on GitHub
- Check the documentation
- Review existing issues for solutions

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core UI components
- ✅ Authentication system
- ✅ Basic CRUD operations
- ✅ Real-time features

### Phase 2 (Next)
- 🔄 Advanced AI integration
- 🔄 Code analysis features
- 🔄 Team collaboration tools
- 🔄 Performance optimization

### Phase 3 (Future)
- 📋 Advanced analytics
- 📋 Machine learning insights
- 📋 Mobile application
- 📋 Enterprise features

---

**Built with ❤️ for developers who dream in code.**
