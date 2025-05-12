const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const GITHUB_USERNAME = 'YOUR_USERNAME'; // Change this
const GITHUB_REPO = 'YOUR_REPO_NAME';     // Change this
const COMMIT_MESSAGE = 'Deploy to GitHub Pages';
const BRANCH = 'gh-pages';

// Paths
const buildDir = path.join(__dirname, 'build');
const tempDir = path.join('C:', 'temp', 'ghdeploy');

// Ensure the build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

try {
  // Build the React app
  console.log('Building React app...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Copy index.html to build folder
  console.log('Copying index.html to build folder...');
  if (fs.existsSync(path.join(__dirname, 'index.html'))) {
    fs.copyFileSync(
      path.join(__dirname, 'index.html'),
      path.join(buildDir, 'index.html')
    );
  }
  
  // Copy config files
  console.log('Copying configuration files...');
  const configContent = `// Application configuration
window.APP_CONFIG = {
  API_URL: 'https://cv.tdconsulting.vn',
  VERSION: '1.0.0',
  ENV: 'production'
};`;
  fs.writeFileSync(path.join(buildDir, 'config.js'), configContent);
  
  // Create loader.js if needed
  if (fs.existsSync(path.join(__dirname, 'public', 'loader.js'))) {
    fs.copyFileSync(
      path.join(__dirname, 'public', 'loader.js'),
      path.join(buildDir, 'loader.js')
    );
  }
  
  // Create temporary directory with short path
  console.log('Creating temporary directory...');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Clear previous content
  console.log('Clearing previous content...');
  try {
    execSync(`del /Q /S "${tempDir}\\*"`, { stdio: 'inherit', shell: true });
    execSync(`rmdir /S /Q "${tempDir}\\.git"`, { stdio: 'inherit', shell: true, windowsHide: true });
  } catch (e) {
    // Ignore errors from trying to delete non-existent files
  }
  
  // Copy build files to temp directory
  console.log('Copying build files to temporary directory...');
  execSync(`xcopy "${buildDir}" "${tempDir}" /E /I /Y`, { stdio: 'inherit', shell: true });
  
  // Navigate to temp directory and create git repo
  console.log('Setting up Git repository...');
  process.chdir(tempDir);
  
  // Initialize git repo in temp directory
  execSync('git init', { stdio: 'inherit' });
  execSync('git config user.name "GitHub Pages Deployment"', { stdio: 'inherit' });
  execSync('git config user.email "deployment@example.com"', { stdio: 'inherit' });
  
  // Add .nojekyll file to disable Jekyll processing
  fs.writeFileSync(path.join(tempDir, '.nojekyll'), '');
  
  // Add CNAME file for custom domain if needed
  // fs.writeFileSync(path.join(tempDir, 'CNAME'), 'cv.huygoodboy.io.vn');
  
  // Commit files
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "${COMMIT_MESSAGE}"`, { stdio: 'inherit' });
  
  // Create branch and prepare for push
  execSync(`git branch -M ${BRANCH}`, { stdio: 'inherit' });
  
  // Push to GitHub (using simple URI to avoid path length issues)
  console.log('Pushing to GitHub...');
  execSync(`git remote add origin https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git`, { stdio: 'inherit' });
  
  // Push using SSH or HTTPS (uncomment the one you prefer)
  // execSync(`git push -f origin ${BRANCH}`, { stdio: 'inherit' }); // HTTPS (may require credentials)
  console.log('\nTo complete deployment, run this command in the temporary directory:');
  console.log(`cd "${tempDir}" && git push -f origin ${BRANCH}`);
  console.log('\nOr upload manually via GitHub web interface.');
  
  console.log('\nDeployment preparation completed!');
  console.log(`Build files are ready in: ${tempDir}`);
  console.log('If automatic push fails, you can manually upload these files to GitHub.');
  
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
} 