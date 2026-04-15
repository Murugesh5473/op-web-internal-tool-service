@Library('jenkins-shared-library-v2') _

// Load configuration from environment variables
// All sensitive values must be configured in Jenkins environment variables
// See .env.jenkins.example for required configuration
def config = [
  serviceGithubUrl: env.SERVICE_GITHUB_URL ?: "https://git.your-org.io/your-org/op-web-internal-tool-service.git",
  serviceEcr: env.SERVICE_ECR_REGISTRY ?: "your-org-service-ecr-registry",
  serviceName: env.SERVICE_NAME ?: "op-web-internal-tool-service",
  serviceDeploymentFile: env.SERVICE_DEPLOYMENT_FILE ?: "op-web-internal-tool-service.yaml",
  sonarProjectKey: env.SONAR_PROJECT_KEY ?: "your-org_op-web-internal-tool-service"
]

tcWebAppCdn(config)