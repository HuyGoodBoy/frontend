@echo off
echo Starting manual deployment to GitHub Pages...

rem Build the React app
echo Building React app...
call npm run build

rem Copy index.html to build folder
echo Copying index.html to build folder...
copy index.html build\index.html

rem Copy configuration files to build folder
echo Copying configuration files...
copy public\config.js build\config.js
copy public\loader.js build\loader.js

rem Create temp directory with short path
echo Creating temporary directory...
if not exist C:\temp mkdir C:\temp
if not exist C:\temp\ghdeploy mkdir C:\temp\ghdeploy

rem Clear previous content
echo Clearing previous content...
del /Q /S C:\temp\ghdeploy\*
rmdir /S /Q C:\temp\ghdeploy\.git 2>nul

rem Copy build files to temp directory
echo Copying build files to temporary directory...
xcopy build C:\temp\ghdeploy /E /I /Y

rem Initialize git repo in temp directory
echo Initializing Git repository...
cd C:\temp\ghdeploy
git init
git config user.name "GitHub Pages Deployment"
git config user.email "deployment@example.com"

rem Create and commit files
echo Creating and committing files...
git add .
git commit -m "Deploy to GitHub Pages"

rem Push to GitHub
echo Pushing to GitHub...
git branch -M gh-pages
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -f origin gh-pages

rem Clean up
echo Cleaning up...
cd %~dp0
rmdir /S /Q C:\temp\ghdeploy

echo Deployment completed! Your app should be available at your GitHub Pages URL soon.
pause 