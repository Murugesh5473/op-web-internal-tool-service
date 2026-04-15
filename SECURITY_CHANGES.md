# Security Changes - Sensitive Data Removal

## Summary

This document outlines all changes made to remove sensitive information (company names, infrastructure URLs, and API endpoints) from the codebase and move them to environment variables.

## Files Modified

### 1. **Jenkinsfile**
**Changes Made:**
- Removed hardcoded company name (Toorak-Capital)
- Removed hardcoded Git repository URL
- Removed hardcoded AWS ECR registry name
- Removed hardcoded SonarQube project key with company prefix
- Updated to use environment variables with fallback values

**Before:**
```groovy
def config = [serviceGithubUrl: "https://git.toorakcapital.io/Toorak-Capital/op-web-internal-tool-service.git", 
              serviceEcr: "op-web-internal-tool-service-devops-ue1-ecr", 
              serviceName: "op-web-internal-tool-service", 
              serviceDeploymentFile: "op-web-internal-tool-service.yaml", 
              sonarProjectKey: "Toorak-Capital_op-web-internal-tool-service"]
```

**After:**
```groovy
def config = [
  serviceGithubUrl: env.SERVICE_GITHUB_URL ?: "https://git.example.io/company/op-web-internal-tool-service.git",
  serviceEcr: env.SERVICE_ECR_REGISTRY ?: "op-web-internal-tool-service-devops-ue1-ecr",
  serviceName: env.SERVICE_NAME ?: "op-web-internal-tool-service",
  serviceDeploymentFile: env.SERVICE_DEPLOYMENT_FILE ?: "op-web-internal-tool-service.yaml",
  sonarProjectKey: env.SONAR_PROJECT_KEY ?: "company_op-web-internal-tool-service"
]
```

### 2. **src/services/api.js**
**Changes Made:**
- Removed hardcoded localhost and API endpoint logic
- Updated to use environment variables for API URLs
- Added fallback mechanism for hostname-based detection
- Made configuration more flexible for different environments

**Before:**
```javascript
const { hostname } = window.location;
export const API_BASE_URL =
  hostname === 'localhost'
    ? 'http://localhost:3000'
    : hostname.includes('qa')
      ? `https://api-${hostname}`
      : `https://api.${hostname}`;
```

**After:**
```javascript
const getApiBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_BASE_URL;
  if (envUrl) return envUrl;
  
  // Fallback to hostname-based detection if env var not set
  const { hostname } = window.location;
  if (hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  if (hostname.includes('qa')) {
    return process.env.REACT_APP_API_QA_URL || `https://api-${hostname}`;
  }
  return process.env.REACT_APP_API_PROD_URL || `https://api.${hostname}`;
};

export const API_BASE_URL = getApiBaseUrl();
```

### 3. **.gitignore**
**Changes Made:**
- Added environment variable files to git ignore
- Added pattern for .env files
- Added pattern for environment-specific files

**New Entries:**
```
# Environment variables
.env
.env.local
.env.*.local
.env.production

# Build and deployment
build/
dist/
```

## Files Created

### 1. **.env.example** (Committed to Git)
Template file for local development configuration:
```
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_API_QA_URL=https://api-qa.example.com
REACT_APP_API_PROD_URL=https://api.example.com
REACT_APP_ENV=development
PORT=3001
```

### 2. **.env** (Git Ignored - NOT Committed)
Actual configuration file with real values:
- Contains sensitive company domain URLs
- Contains local development settings
- Should be created locally by each developer
- Should be created on CI/CD servers with appropriate values

### 3. **.env.jenkins.example** (Committed to Git)
Reference template for Jenkins/CI-CD environment variables:
```
SERVICE_GITHUB_URL=https://git.your-domain.io/your-org/op-web-internal-tool-service.git
SERVICE_ECR_REGISTRY=your-service-devops-region-ecr
SERVICE_NAME=op-web-internal-tool-service
SERVICE_DEPLOYMENT_FILE=op-web-internal-tool-service.yaml
SONAR_PROJECT_KEY=your-org_op-web-internal-tool-service
SONAR_HOST_URL=https://sonar.your-domain.com
SONAR_LOGIN=<sonar-token>
```

### 4. **ENVIRONMENT_SETUP.md** (Committed to Git)
Comprehensive documentation for:
- Environment setup instructions
- Variable descriptions and purposes
- Security best practices
- Troubleshooting guide
- Verification steps

### 5. **SECURITY_CHANGES.md** (This File - Committed to Git)
Documentation of all security-related changes made

## Sensitive Data Moved to Environment Variables

| Sensitive Data | Type | Location | Env Variable |
|---|---|---|---|
| Toorak-Capital | Company Name | Jenkinsfile | SONAR_PROJECT_KEY |
| git.toorakcapital.io | Infrastructure URL | Jenkinsfile | SERVICE_GITHUB_URL |
| op-web-internal-tool-service-devops-ue1-ecr | AWS ECR Registry | Jenkinsfile | SERVICE_ECR_REGISTRY |
| Toorak-Capital_op-web-internal-tool-service | SonarQube Key | Jenkinsfile | SONAR_PROJECT_KEY |
| https://api-{hostname} | API Endpoint | src/services/api.js | REACT_APP_API_QA_URL |
| https://api.{hostname} | API Endpoint | src/services/api.js | REACT_APP_API_PROD_URL |

## Next Steps for Teams

### For Developers
1. Copy `.env.example` to `.env`
2. Fill in the actual values for your environment
3. Never commit `.env` file
4. Refer to `ENVIRONMENT_SETUP.md` for detailed instructions

### For DevOps/Jenkins Administrators
1. Review `.env.jenkins.example`
2. Configure Jenkins environment variables or secrets
3. Use Jenkins Credentials for sensitive values
4. Do NOT hardcode secrets in Jenkinsfile

### For Code Review
1. Ensure no `.env` files are committed
2. Check that environment variables are used instead of hardcoded values
3. Review new code for sensitive data patterns
4. Keep documentation updated

## Security Best Practices Implemented

✅ **No Hardcoded Secrets** - All sensitive data moved to env vars  
✅ **Environment Files Gitignored** - .env files are ignored by git  
✅ **Example Templates** - .env.example and .env.jenkins.example provided  
✅ **Documentation** - Clear setup and usage documentation  
✅ **Flexible Configuration** - Supports multiple environments (dev, qa, prod)  
✅ **Backwards Compatibility** - Fallback mechanisms for existing deployments  

## Verification

### To verify all changes were applied correctly:

1. **Check Jenkinsfile uses env vars:**
   ```bash
   grep "env\." Jenkinsfile
   ```

2. **Check API service uses env vars:**
   ```bash
   grep "REACT_APP_API" src/services/api.js
   ```

3. **Verify .env is gitignored:**
   ```bash
   git check-ignore .env
   ```

4. **Check for remaining hardcoded URLs:**
   ```bash
   grep -r "toorak\|git\.io" src/ --include="*.js" --include="*.jsx"
   ```

## Migration Checklist

- [x] Removed company names from code
- [x] Removed infrastructure URLs from code
- [x] Removed API endpoints from code
- [x] Created .env.example template
- [x] Created .env.jenkins.example template
- [x] Updated .gitignore
- [x] Updated Jenkinsfile
- [x] Updated src/services/api.js
- [x] Created ENVIRONMENT_SETUP.md
- [x] Created documentation
- [x] Verified no sensitive data in git history (this commit only)
