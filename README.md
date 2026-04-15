# Automation Test Reporting Dashboard

A modern web-based dashboard for tracking, reporting, and managing automated test execution. This internal tool provides real-time monitoring, historical reporting, and detailed test case analysis.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Development Guidelines](#development-guidelines)
- [Architecture](#architecture)
- [Contributing](#contributing)

---

## ✨ Features

### Live Tracking
- Real-time monitoring of test suite execution
- Live status updates with visual indicators
- WebSocket support for instant notifications

### Reports & Analytics
- Comprehensive test execution reports
- Historical data tracking and trends
- Pass/fail statistics and visualizations
- Detailed test case breakdowns

### Dashboard Views
- **Home Page** - Overview of available tools and features
- **Automation Report** - Live tracking and historical reports
- **Report Details** - In-depth analysis of specific test runs
- **Test Case Details** - Granular view of individual test cases

### User Experience
- Responsive design with modern UI components
- Dark/Light theme support
- Smooth scroll position preservation on navigation
- Toast notifications for user feedback
- Error boundaries for graceful error handling

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.2.0** - UI library with hooks and functional components
- **React Router DOM 6.20.0** - Client-side routing
- **React Scripts 5.0.1** - Create React App tooling

### Styling & UI
- **CSS-in-JS** - Inline styles and theme system
- **Responsive Design** - Mobile-friendly layout

### Code Quality
- **ESLint 8.49.0** - Code linting with Airbnb config
- **Prettier 3.8.1** - Code formatting
- **JSDoc** - Inline code documentation

### Development Tools
- **Node.js** - Runtime environment
- **npm** - Package management

### State Management & Contexts
- **React Context API** - Theme and Toast notifications
- **React Hooks** - Custom hooks for data fetching

---

## 📁 Project Structure

```
op-web-internal-tool-service/
├── public/                          # Static assets
│   └── index.html                  # HTML entry point
│
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── icons/                 # Icon components
│   │   ├── layout/                # Layout components (Sidebar, etc.)
│   │   ├── ActionDropdown.js      # Action menu dropdown
│   │   ├── Badge.js               # Status badge component
│   │   ├── Card.js                # Reusable card component
│   │   ├── DonutChart.js          # Chart visualization
│   │   ├── ErrorBoundary.js       # Error boundary wrapper
│   │   ├── FilterComponents.js    # Filter UI components
│   │   ├── LogLine.js             # Log display component
│   │   ├── ToastContainer.js      # Toast notification display
│   │   └── ...                    # Other components
│   │
│   ├── pages/                      # Page components (for views)
│   │   ├── Home.jsx               # Home/landing page
│   │   ├── Automation.jsx         # Automation dashboard page
│   │   ├── Report.js              # Report list page
│   │   ├── ReportDetail.jsx       # Detailed report view
│   │   ├── TestCaseDetailView.jsx # Test case details
│   │   └── ...                    # Other pages
│   │
│   ├── views/                      # View wrappers for routing
│   │   ├── HomeView.jsx
│   │   ├── AutomationView.jsx
│   │   ├── ReportDetailView.jsx
│   │   └── TestCaseView.jsx
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useSuiteDetail.js      # Hook for suite data
│   │   ├── useTestCaseDetail.js   # Hook for test case data
│   │   └── automation/            # Automation-specific hooks
│   │
│   ├── contexts/                   # React Context providers
│   │   ├── ThemeContext.js        # Theme (dark/light) context
│   │   └── ToastContext.js        # Toast notifications context
│   │
│   ├── services/                   # API and business logic
│   │   ├── api.js                 # API client with environment config
│   │   └── automation/            # Automation-specific services
│   │
│   ├── constants/                  # Application constants
│   │   ├── index.js               # Exports all constants
│   │   ├── statusLevels.js        # Test status definitions
│   │   └── theme.js               # Theme color constants
│   │
│   ├── utils/                      # Utility functions
│   │   └── helpers.js             # Helper functions
│   │
│   ├── routes/                     # Route definitions
│   │   └── AppRoutes.jsx          # Route configuration with lazy loading
│   │
│   ├── App.js                      # Root application component
│   ├── index.js                    # ReactDOM entry point
│   └── ...                         # Other files
│
├── .env                            # Environment variables (gitignored)
├── .env.example                    # Environment template
├── .env.jenkins.example            # Jenkins configuration template
├── .gitignore                      # Git ignore rules
├── package.json                    # Project dependencies and scripts
├── package-lock.json              # Locked dependency versions
├── ENVIRONMENT_SETUP.md            # Environment configuration guide
├── SECURITY_CHANGES.md             # Security hardening documentation
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 14.0 or higher
- **npm** 6.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd op-web-internal-tool-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API endpoints
   vim .env
   ```

4. **Start development server**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3001`

---

## ⚙️ Configuration

### Environment Variables

The application uses environment variables for configuration. See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed setup instructions.

**Key Variables:**

```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_API_QA_URL=https://api-qa.example.com
REACT_APP_API_PROD_URL=https://api.example.com

# Application Settings
REACT_APP_ENV=development
PORT=3001
```

### API Configuration

The API client automatically configures endpoints based on environment variables:

- **Development**: `http://localhost:3000`
- **QA**: Uses `REACT_APP_API_QA_URL`
- **Production**: Uses `REACT_APP_API_PROD_URL`

See [src/services/api.js](./src/services/api.js) for implementation details.

---

## 📝 Available Scripts

### Development
```bash
npm start
```
Runs the app in development mode. Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

### Production Build
```bash
npm run build
```
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### Testing
```bash
npm test
```
Launches the test runner in interactive watch mode.

### Code Formatting
```bash
npm run format
```
Formats all code using Prettier according to project style guidelines.

### Eject Configuration
```bash
npm run eject
```
⚠️ This is a one-way operation. Once ejected, you can't go back!

---

## 🏗️ Architecture

### Component Hierarchy

```
App (Root)
├── BrowserRouter
├── ThemeProvider
│   └── ToastProvider
│       └── AppShell
│           ├── Sidebar
│           │   └── NavItem
│           ├── AppRoutes
│           │   ├── HomeView
│           │   ├── AutomationView
│           │   ├── ReportDetailView
│           │   └── TestCaseView
│           ├── ToastContainer
│           └── ErrorBoundary
└── Main routes with lazy loading
```

### Data Flow

1. **API Layer** (`services/api.js`)
   - HTTP client with environment-based configuration
   - Request/response handling with error management

2. **Hooks Layer** (`hooks/`)
   - Custom React hooks for data fetching
   - Automation-specific hooks for domain logic

3. **Context Layer** (`contexts/`)
   - Theme context for styling
   - Toast context for notifications

4. **Component Layer** (`components/`)
   - Reusable UI components
   - Layout components
   - Data presentation components

### Routing

Routes are configured with lazy loading for performance:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | HomeView | Landing page with tool cards |
| `/automation` | AutomationView | Main automation dashboard |
| `/automation/report` | ReportDetailView | Detailed report analysis |
| `/automation/test-case` | TestCaseView | Test case details |

---

## 💻 Development Guidelines

### Code Style

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Run `npm run format` before committing
- Use ESLint configuration for linting

### Component Best Practices

1. **Functional Components** - Use React hooks instead of class components
2. **Custom Hooks** - Create reusable logic in `hooks/` directory
3. **Props Validation** - Use prop-types or TypeScript (if added)
4. **Memoization** - Use `React.memo()` for performance optimization
5. **Error Handling** - Wrap routes with ErrorBoundary

### File Naming

- **Components**: PascalCase (e.g., `Card.js`, `ToolCard.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useSuiteDetail.js`)
- **Utilities**: camelCase (e.g., `helpers.js`)
- **Constants**: camelCase with descriptive names

### State Management

- Use React Context API for global state (theme, notifications)
- Use custom hooks for component-specific logic
- Lift state up only when necessary

### API Calls

- All API calls go through `services/api.js`
- Use environment variables for endpoint configuration
- Handle errors gracefully with user feedback

---

## 🔒 Security

Sensitive configuration has been externalized to environment variables. See [SECURITY_CHANGES.md](./SECURITY_CHANGES.md) for:
- Removed hardcoded sensitive data
- Environment variable configuration
- Git security setup

---

## 📦 Deployment

### Build for Production

```bash
npm run build
```

The `build` folder contains the production-ready application.

### Jenkins/CI-CD

Configure the following environment variables in Jenkins:

```bash
SERVICE_GITHUB_URL
SERVICE_ECR_REGISTRY
SERVICE_NAME
SERVICE_DEPLOYMENT_FILE
SONAR_PROJECT_KEY
SONAR_HOST_URL
SONAR_LOGIN
```

See [.env.jenkins.example](./.env.jenkins.example) for reference.

---

## 🤝 Contributing

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow code style guidelines
   - Add comments for complex logic

3. **Format and lint**
   ```bash
   npm run format
   ```

4. **Test your changes**
   ```bash
   npm test
   ```

5. **Commit changes**
   ```bash
   git commit -m "feat: description of your changes"
   ```

6. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Guidelines

- Use conventional commits format
- Keep messages concise and descriptive
- Reference issues when applicable

---

## 📚 Documentation

Additional documentation:

- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - Environment configuration guide
- [SECURITY_CHANGES.md](./SECURITY_CHANGES.md) - Security hardening details

---

## 🆘 Troubleshooting

### Common Issues

**Issue:** API connection errors
```bash
# Solution: Verify .env file has correct API endpoints
cat .env | grep REACT_APP_API
```

**Issue:** Port 3001 already in use
```bash
# Solution: Change PORT in .env
PORT=3002 npm start
```

**Issue:** Module not found errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

## 📞 Support

For issues and questions:
1. Check existing documentation
2. Review code comments and JSDoc
3. Check Git commit history for context
4. Contact the development team

---

**Version:** 1.0.0  
**Last Updated:** April 2026  
**Node Version:** 14.0+  
**npm Version:** 6.0+
