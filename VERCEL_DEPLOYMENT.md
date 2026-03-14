# Deploying TravelExplore to Vercel

This guide provides step-by-step instructions to deploy the TravelExplore website to Vercel.

## 📋 Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2.  **GitHub Repository**: Push this code to a GitHub repository.
3.  **MongoDB Atlas**: A cloud MongoDB instance (Vercel cannot use a local MongoDB).
    *   Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
    *   Get your connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/travelexplore`).

## 🚀 Deployment Steps

1.  **Import Project**:
    *   Go to the Vercel Dashboard and click **"Add New"** -> **"Project"**.
    *   Import your GitHub repository.

2.  **Configure Project**:
    *   **Framework Preset**: Other (Vercel will automatically detect `vercel.json`).
    *   **Build and Output Settings**: Leave as default.

3.  **Environment Variables**:
    You must add the following environment variables in the Vercel project settings:

    | Variable | Description | Example Value |
    | :--- | :--- | :--- |
    | `MONGODB_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
    | `SESSION_SECRET` | A random string for session encryption | `your-secret-key-123` |
    | `JWT_SECRET` | A random string for JWT tokens | `your-jwt-secret-456` |
    | `NODE_ENV` | Set to production | `production` |
    | `CORS_ORIGIN` | Your Vercel deployment URL | `https://your-app.vercel.app` |

4.  **Deploy**:
    *   Click **"Deploy"**. Vercel will build and host your application.

## 🔑 Credentials Needed

To successfully deploy, you will need to have these credentials ready:

### 1. MongoDB Atlas URI
*   **Where to get**: [MongoDB Atlas Dashboard](https://cloud.mongodb.com).
*   **Format**: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority`

### 2. Session & JWT Secrets
*   **Where to get**: You can generate these yourself using a tool like [Password Generator](https://passwordsgenerator.net/) or by running `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` in your terminal.

### 3. Google OAuth (Optional)
If you want to use Google Login, you'll need:
*   `GOOGLE_CLIENT_ID`
*   `GOOGLE_CLIENT_SECRET`
*   `GOOGLE_CALLBACK_URL` (e.g., `https://your-app.vercel.app/auth/google/callback`)
*   **Where to get**: [Google Cloud Console](https://console.cloud.google.com).

## ⚠️ Important Notes

*   **File Persistence**: Vercel uses a read-only filesystem. Any files uploaded to `/tmp/uploads` will be deleted when the serverless function restarts. For permanent file storage, use a service like AWS S3 or Cloudinary.
*   **Database**: Ensure your MongoDB Atlas cluster allows connections from all IP addresses (`0.0.0.0/0`) since Vercel's IP addresses are dynamic.
