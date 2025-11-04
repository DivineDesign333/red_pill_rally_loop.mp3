/**
 * Dashboard API Module
 * Handles fetching deployment data from GitHub API
 */

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'DivineDesign333';
const REPO_NAME = 'red_pill_rally_loop.mp3';

/**
 * Fetches workflow runs from GitHub Actions
 */
async function fetchWorkflowRuns() {
    try {
        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs?per_page=10`
        );
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.workflow_runs || [];
    } catch (error) {
        console.error('Error fetching workflow runs:', error);
        return [];
    }
}

/**
 * Fetches deployment information
 */
async function fetchDeployments() {
    try {
        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/deployments?per_page=10`
        );
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Error fetching deployments:', error);
        return [];
    }
}

/**
 * Transforms workflow run data for display
 */
function transformWorkflowData(runs) {
    return runs.map(run => ({
        name: run.name,
        time: new Date(run.created_at).toLocaleString(),
        status: run.conclusion === 'success' ? 'success' : 
                run.conclusion === 'failure' ? 'failed' : 'pending',
        url: run.html_url
    }));
}

/**
 * Calculates deployment statistics
 */
function calculateStats(deployments) {
    const total = deployments.length;
    const successful = deployments.filter(d => d.status === 'success').length;
    const failed = deployments.filter(d => d.status === 'failed').length;
    const uptime = total > 0 ? ((successful / total) * 100).toFixed(1) : '0.0';
    
    return {
        total,
        successful,
        failed,
        uptime: `${uptime}%`
    };
}

// Export functions for use in the dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchWorkflowRuns,
        fetchDeployments,
        transformWorkflowData,
        calculateStats
    };
}
