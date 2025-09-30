@echo off
echo Starting deployment to Vercel...
echo.
echo Please follow these steps:
echo 1. Run: npx vercel
echo 2. Answer 'y' to deploy
echo 3. Select your scope
echo 4. Choose project name (or press Enter for default)
echo 5. Choose framework: Next.js
echo 6. Choose build command: npm run build
echo 7. Choose output directory: .next
echo 8. Choose install command: npm install
echo.
echo After deployment, you'll get a URL like: https://your-project.vercel.app
echo.
echo IMPORTANT: After deployment, you need to:
echo 1. Go to Vercel Dashboard
echo 2. Go to your project settings
echo 3. Add environment variables:
echo    - MONGODB_URI
echo    - NEXTAUTH_SECRET
echo    - NEXTAUTH_URL (your Vercel domain)
echo    - STRIPE_SECRET_KEY
echo    - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
echo    - STRIPE_WEBHOOK_SECRET
echo.
pause
