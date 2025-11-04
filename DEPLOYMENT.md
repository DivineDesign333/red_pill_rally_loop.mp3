# Deployment Configuration

## Environment Variables
These environment variables can be configured for deployments:

### Production Environment
- `DEPLOY_ENV`: production
- `DEPLOY_BRANCH`: main
- `DEPLOY_TARGET`: github-pages

### Staging Environment
- `DEPLOY_ENV`: staging
- `DEPLOY_BRANCH`: develop
- `DEPLOY_TARGET`: github-pages

## Deployment Workflow
The deployment process is automated through GitHub Actions:

1. **Trigger**: Push to main branch or manual workflow dispatch
2. **Build**: Compiles and prepares dashboard files
3. **Deploy**: Publishes to GitHub Pages
4. **Verify**: Checks deployment status

## Deployment Environments
- **Production**: https://[username].github.io/[repo-name]/
- **Staging**: Can be configured as needed

## Manual Deployment
To trigger a manual deployment:
1. Go to Actions tab in GitHub
2. Select "Deploy Dashboard" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## Rollback Procedure
If a deployment fails:
1. Go to the repository settings
2. Navigate to Pages section
3. Select a previous deployment from the history
4. Redeploy the previous version

## Monitoring
- Deployment status: Check GitHub Actions tab
- Live dashboard: Visit the GitHub Pages URL
- Logs: Available in GitHub Actions workflow runs
