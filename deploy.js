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

// Alternative deployment method to avoid ENAMETOOLONG error
console.log('Deploying to GitHub Pages with alternative method...');
try {
  // Create a temporary directory with a short path
  const tempDir = path.join('C:\\', 'temp', 'gh-pages-deploy');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Copy build files to temp directory
  console.log('Copying build files to temporary directory...');
  execSync(`xcopy "${buildDir}" "${tempDir}" /E /I /Y`, { stdio: 'inherit' });
  
  // Navigate to temp directory and deploy from there
  console.log('Deploying from temporary directory...');
  execSync(`cd "${tempDir}" && npx gh-pages -d . -b gh-pages`, { stdio: 'inherit' });
  
  console.log('Deployment completed successfully!');
  
  // Clean up temp directory
  console.log('Cleaning up...');
  execSync(`rmdir /S /Q "${tempDir}"`, { stdio: 'inherit' });
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
}

console.log('All done! Your app should be available at your GitHub Pages URL soon.'); 