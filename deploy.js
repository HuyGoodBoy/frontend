const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure the build directory exists
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy the index.html to the build folder
console.log('Copying index.html to build folder...');
fs.copyFileSync(
  path.join(__dirname, 'index.html'),
  path.join(buildDir, 'index.html')
);

// Build the React app
console.log('Building React app...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Deploy to GitHub Pages
console.log('Deploying to GitHub Pages...');
try {
  execSync('npm run deploy', { stdio: 'inherit' });
  console.log('Deployment completed successfully!');
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
}

console.log('All done! Your app should be available at your GitHub Pages URL soon.'); 