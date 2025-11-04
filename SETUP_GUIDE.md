# Deployment Dashboard Setup Guide

## Overview
This guide will help you set up and configure the deployment dashboard for your repository.

## Prerequisites
- GitHub repository with admin access
- GitHub Pages enabled (or permissions to enable it)

## Setup Steps

### 1. Enable GitHub Pages
1. Navigate to your repository on GitHub
2. Go to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the configuration

### 2. Configure Repository Permissions
Ensure the repository has the following permissions:
- **Read and write permissions** for workflows
- **GitHub Pages** deployment permissions

To check/update:
1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests**
4. Save the changes

### 3. Trigger Initial Deployment

#### Option A: Manual Trigger
1. Go to the **Actions** tab
2. Select **Deploy Dashboard** workflow
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow**

#### Option B: Push to Main
Simply merge this PR to the `main` branch to trigger automatic deployment.

### 4. Verify Deployment
After the workflow completes:
1. Go to **Settings** → **Pages**
2. You'll see the deployed URL: `https://[username].github.io/[repo-name]/`
3. Click the URL to view your dashboard

## Dashboard Features

### Real-time Monitoring
- View deployment status and history
- Track success/failure rates
- Monitor uptime statistics

### Automatic Updates
- Dashboard updates automatically on every push to main
- Manual refresh available via button

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Dark mode support based on system preferences

## Customization

### Update Repository Information
Edit `dashboard/api.js` and update:
```javascript
const REPO_OWNER = 'your-username';
const REPO_NAME = 'your-repo-name';
```

### Modify Dashboard Appearance
1. Edit `dashboard/index.html` for structure changes
2. Edit inline styles or `dashboard/styles.css` for design changes

### Add Custom Metrics
Extend `dashboard/api.js` to fetch additional data:
```javascript
async function fetchCustomMetrics() {
    // Your implementation
}
```

## Troubleshooting

### Dashboard Not Deploying
1. Check workflow run in **Actions** tab for errors
2. Verify GitHub Pages is enabled
3. Ensure workflow has proper permissions

### Dashboard Shows "404"
1. Wait a few minutes after first deployment
2. Check if GitHub Pages is set to use GitHub Actions
3. Verify the deployment workflow completed successfully

### Dashboard Not Updating
1. Check if automatic deployments are enabled
2. Manually trigger the workflow
3. Clear browser cache

## Monitoring

### View Deployment Status
- **GitHub Actions**: Check workflow runs
- **Dashboard Badge**: View in README
- **Status Check**: Runs hourly via workflow

### Check Logs
1. Go to **Actions** tab
2. Select a workflow run
3. Click on job to view detailed logs

## Maintenance

### Update Dependencies
GitHub Actions updates automatically, but you can:
1. Update action versions in `.github/workflows/deploy.yml`
2. Test changes on a feature branch first

### Backup Configuration
All configuration is stored in the repository:
- Workflows: `.github/workflows/`
- Dashboard: `dashboard/`
- Documentation: `DEPLOYMENT.md` and `README.md`

## Security

### API Rate Limits
The dashboard fetches data from GitHub API:
- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5000 requests/hour

To increase limits, add GitHub token to your dashboard API calls.

### Access Control
- Dashboard is public if repository is public
- Use private repository for private dashboard
- Configure branch protection rules as needed

## Support

For issues or questions:
1. Check GitHub Actions logs
2. Review this setup guide
3. Consult [GitHub Pages documentation](https://docs.github.com/en/pages)
4. Check [GitHub Actions documentation](https://docs.github.com/en/actions)

## Next Steps

After setup:
1. ✅ Customize dashboard appearance
2. ✅ Add custom metrics
3. ✅ Configure monitoring alerts
4. ✅ Share dashboard URL with team

## Examples

### Access Your Dashboard
```
https://divinedesign333.github.io/red_pill_rally_loop.mp3/
```

### View Workflow Status
```
https://github.com/DivineDesign333/red_pill_rally_loop.mp3/actions
```

### Check Deployment Logs
```
Actions → Deploy Dashboard → Select run → View logs
```

---

**Note**: Replace `divinedesign333` and `red_pill_rally_loop.mp3` with your GitHub username and repository name.
