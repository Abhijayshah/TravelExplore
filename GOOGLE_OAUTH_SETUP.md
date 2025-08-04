# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the TravelExplore application.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. The TravelExplore application running locally

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `TravelExplore` (or your preferred name)
4. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "People API"
3. Click on it and press "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in required fields:
     - App name: `TravelExplore`
     - User support email: Your email
     - Developer contact information: Your email
   - Add scopes: `email`, `profile`
   - Add test users (your email) if in testing mode

4. Create OAuth client ID:
   - Application type: "Web application"
   - Name: `TravelExplore Web Client`
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/auth/google/callback`

5. Copy the Client ID and Client Secret

## Step 4: Update Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-google-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

## Step 5: Restart the Application

1. Stop the current server (Ctrl+C)
2. Start it again: `npm start`
3. The server should now be running with Google OAuth enabled

## Step 6: Test Authentication

### Testing Demo Login
1. Go to `http://localhost:3000/login`
2. Use demo credentials:
   - Email: `demo@user.com`
   - Password: `123456`
3. Should redirect to dashboard upon successful login

### Testing New User Registration
1. Go to `http://localhost:3000/login`
2. Click "Sign Up" tab
3. Fill in the registration form with valid details
4. Should create account and redirect to dashboard

### Testing Google OAuth
1. Go to `http://localhost:3000/login`
2. Click "Google" button
3. Should redirect to Google login
4. After successful Google authentication, should redirect back to dashboard

## Troubleshooting

### Common Issues

1. **"Error 400: redirect_uri_mismatch"**
   - Check that the redirect URI in Google Console matches exactly: `http://localhost:3000/auth/google/callback`
   - Ensure no trailing slashes or extra characters

2. **"This app isn't verified"**
   - This is normal for development. Click "Advanced" → "Go to TravelExplore (unsafe)"
   - For production, you'll need to verify your app with Google

3. **"Access blocked: This app's request is invalid"**
   - Check that you've enabled the correct APIs (Google+ API or People API)
   - Verify your OAuth consent screen is properly configured

4. **Environment variables not loading**
   - Ensure `.env` file is in the project root
   - Restart the server after making changes to `.env`
   - Check that `dotenv` package is installed

### Debug Steps

1. Check server logs for any error messages
2. Verify MongoDB connection is working
3. Test API endpoints directly:
   - `POST /api/auth/login` for demo login
   - `POST /api/auth/register` for registration
   - `GET /auth/google` for Google OAuth initiation

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique secrets for production
- For production deployment, update redirect URIs to match your domain
- Consider implementing rate limiting for authentication endpoints

## Production Deployment

When deploying to production:

1. Update Google OAuth settings:
   - Add your production domain to authorized origins
   - Update redirect URI to your production callback URL

2. Update environment variables:
   - Use production MongoDB URI
   - Generate strong, unique secrets
   - Set `NODE_ENV=production`

3. Enable HTTPS for secure authentication

## Support

If you encounter issues:
1. Check the server console for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Test with demo credentials first before trying Google OAuth