const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const buildDir = path.join(__dirname, 'build');
const tempDir = path.join('C:', 'temp', 'ghdeploy');
const zipPath = path.join('C:', 'temp', 'github-pages-build.zip');

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
  
  // Add .nojekyll file to disable Jekyll processing
  fs.writeFileSync(path.join(buildDir, '.nojekyll'), '');
  
  // Add CNAME file for custom domain if needed
  // fs.writeFileSync(path.join(buildDir, 'CNAME'), 'cv.huygoodboy.io.vn');
  
  // Create temporary directory with short path
  console.log('Creating temporary directory...');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Clear previous content
  console.log('Clearing previous content...');
  try {
    execSync(`del /Q /S "${tempDir}\\*"`, { stdio: 'inherit', shell: true });
  } catch (e) {
    // Ignore errors from trying to delete non-existent files
  }
  
  // Copy build files to temp directory
  console.log('Copying build files to temporary directory...');
  execSync(`xcopy "${buildDir}" "${tempDir}" /E /I /Y`, { stdio: 'inherit', shell: true });
  
  // Create a ZIP file for easy manual upload
  console.log('Creating ZIP file for manual upload...');
  try {
    // Delete existing zip file if it exists
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    
    // Using PowerShell to create zip (works on Windows 10+)
    execSync(
      `powershell -command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${zipPath}' -Force"`,
      { stdio: 'inherit' }
    );
    
    console.log('\nDeployment ZIP file created successfully!');
    console.log(`ZIP file location: ${zipPath}`);
    console.log('\nTo deploy:');
    console.log('1. Go to your GitHub repository');
    console.log('2. Go to Settings > Pages');
    console.log('3. Select "Deploy from a branch" and choose "gh-pages"');
    console.log('4. Go to the Code tab and switch to the gh-pages branch');
    console.log('5. Click "Add file" > "Upload files"');
    console.log('6. Extract and upload the contents of the ZIP file');
    console.log('7. Commit the changes');
  } catch (e) {
    console.error('Error creating ZIP file:', e);
    console.log('\nAlternative manual deployment:');
    console.log(`Copy files from: ${tempDir}`);
    console.log('And upload them to GitHub manually');
  }
  
} catch (error) {
  console.error('Deployment preparation failed:', error);
  process.exit(1);
} 