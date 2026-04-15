# Environment Setup Guide

This project uses environment variables to manage sensitive configuration data such as API endpoints, company information, and infrastructure details.

## Overview

Sensitive information is no longer hardcoded in the source code. Instead, it's managed through environment variables:

- **Development**: Use `.env` file (ignored by git)
- **Example/Template**: `.env.example` (committed to git)
- **Jenkins/CI-CD**: `.env.jenkins.example` (reference for CI/CD environment setup)

## Setup Instructions

### For Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your local configuration:
   ```
   REACT_APP_API_BASE_URL=http://localhost:3000
   REACT_APP_API_QA_URL=https://api-qa.your-domain.com
   REACT_APP_API_PROD_URL=https://api.your-domain.com
   REACT_APP_ENV=development
   PORT=3001
   ```

3. The application will automatically load these variables when you run:
   ```bash
   npm start
   ```

### For Jenkins/CI-CD Pipeline

1. Reference `.env.jenkins.example` for required environment variables
2. Set these variables in Jenkins:
   - Via Jenkins credentials
   - Via Jenkins environment configuration
   - Via Jenkins secrets plugin (recommended for sensitive data)

3. Key variables to configure:
   - `SERVICE_GITHUB_URL` - Git repository URL
   - `SERVICE_ECR_REGISTRY` - AWS ECR registry name
   - `SERVICE_NAME` - Service identifier
   - `SERVICE_DEPLOYMENT_FILE` - Kubernetes deployment file
   - `SONAR_PROJECT_KEY` - SonarQube project identifier

## Environment Variables

### Application Configuration

| Variable | Purpose | Example |
|----------|---------|---------|
| `REACT_APP_API_BASE_URL` | Default API base URL | `http://localhost:3000` |
| `REACT_APP_API_QA_URL` | QA environment API URL | `https://api-qa.example.com` |
| `REACT_APP_API_PROD_URL` | Production API URL | `https://api.example.com` |
| `REACT_APP_ENV` | Environment name | `development`, `qa`, `production` |
| `PORT` | Port for development server | `3001` |

### Jenkins Configuration

| Variable | Purpose | Sensitivity |
|----------|---------|-------------|
| `SERVICE_GITHUB_URL` | Git repository URL | High |
| `SERVICE_ECR_REGISTRY` | AWS ECR registry | Medium |
| `SERVICE_NAME` | Service identifier | Low |
| `SERVICE_DEPLOYMENT_FILE` | Kubernetes file | Medium |
| `SONAR_PROJECT_KEY` | SonarQube project | Low |
| `SONAR_HOST_URL` | SonarQube server | Medium |
| `SONAR_LOGIN` | SonarQube token | High |

## Security Best Practices

1. **Never commit `.env` files** - They are in `.gitignore`
2. **Use `.env.example`** - As a template for new developers
3. **Rotate secrets regularly** - Update credentials periodically
4. **Use Jenkins Credentials** - Store sensitive data in Jenkins secret store
5. **Audit access** - Monitor who has access to sensitive configuration
6. **Document patterns** - Update this file when adding new configuration

## Files

- `.env` - Local development configuration (git ignored)
- `.env.example` - Template for development (committed)
- `.env.jenkins.example` - Template for Jenkins/CI-CD (committed)
- `ENVIRONMENT_SETUP.md` - This documentation file

## Common Issues

### Missing API URL

If `REACT_APP_API_BASE_URL` is not set, the application will attempt to auto-detect based on hostname:
- `localhost` → `http://localhost:3000`
- contains `qa` → `https://api-qa.{hostname}`
- otherwise → `https://api.{hostname}`

### Jenkins Build Failures

Ensure all required variables in `.env.jenkins.example` are set in your Jenkins environment before running builds.

## Verification

To verify environment variables are correctly loaded:

1. Check React app configuration:
   ```bash
   npm start
   # Check browser console for API base URL
   ```

2. Check Jenkins configuration:
   ```bash
   echo $SERVICE_NAME
   ```
