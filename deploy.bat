@echo off
echo Starting deployment to GitHub Pages...

rem Ensure gh-pages is installed
echo Installing/updating gh-pages...
call npm install gh-pages@latest --save-dev

rem Build the React app
echo Building React app...
call npm run build

rem Copy index.html to build folder
echo Copying index.html to build folder...
copy index.html build\index.html

rem Create temp directory with short path
echo Creating temporary directory...
if not exist C:\temp mkdir C:\temp
if not exist C:\temp\gh-deploy mkdir C:\temp\gh-deploy

rem Copy build files to temp directory
echo Copying build files to temporary directory...
xcopy build C:\temp\gh-deploy /E /I /Y

rem Deploy from temp directory
echo Deploying from temporary directory...
cd C:\temp\gh-deploy
call npx gh-pages -d . -b gh-pages -r https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

rem Clean up
echo Cleaning up...
cd %~dp0
rmdir /S /Q C:\temp\gh-deploy

echo Deployment completed! Your app should be available at your GitHub Pages URL soon.
pause 