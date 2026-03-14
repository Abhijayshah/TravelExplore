# Details for Developer

**Project Name**: TravelExplore  
**Description**: A fully functional, responsive travel tour website with a comprehensive booking system, user authentication, and admin statistics.  
**Last Updated**: 2026-03-15  
**Version**: 1.0.0  

---

## 1. PROJECT OVERVIEW
- **Goal**: To provide a seamless platform for users to discover, search, and book travel packages across various destinations.
- **Target Audience**: Travelers looking for curated tour packages in India (e.g., Manali, Goa, Ladakh, Kerala) and administrators managing bookings and inquiries.
- **Key Features**:
  - Interactive Hero Slider and Destination Showcases.
  - User Authentication (Local & Google OAuth).
  - Booking Management System with MongoDB.
  - Newsletter Subscription and Contact Inquiries.
  - Admin Dashboard for site statistics.

---

## 2. TECH STACK
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3.
- **Backend**: Node.js with Express.js.
- **Database**: MongoDB (Mongoose ORM).
- **Authentication**: JWT (JSON Web Tokens), Passport.js (Google OAuth 2.0 Strategy), bcryptjs for password hashing.
- **Styling**: Custom CSS3 with Flexbox/Grid, FontAwesome for icons, AOS (Animate On Scroll) for animations.
- **Build/Dev Tools**: Nodemon (development), dotenv (environment management).
- **Package Manager**: npm.
- **Deployment**: Vercel (Production Ready), Docker (Containerized).

---

## 3. FILE STRUCTURE

```text
TravelExplore/
├── config/                 # Configuration files
│   ├── database.js         # MongoDB connection & health checks
│   └── passport.js         # Passport.js Google OAuth strategy
├── css/                    # Stylesheets
│   ├── styles.css          # Main global styles
│   └── aos.css             # AOS animation library styles
├── js/                     # Frontend logic
│   ├── script.js           # Main UI logic (sliders, toggles, basic API calls)
│   └── aos.js              # AOS initialization
├── middleware/             # Express middlewares
│   └── auth.js             # JWT verification & admin authorization
├── models/                 # Mongoose Data Models
│   ├── User.js             # User schema (auth, profile, roles)
│   ├── Booking.js          # Booking details & reference numbers
│   ├── Contact.js          # Contact form submissions
│   ├── Newsletter.js       # Newsletter subscribers
│   └── Review.js           # User reviews & ratings
├── images/                 # Static SVG/Image assets
├── data/                   # JSON backups (Legacy/Backup)
├── server.js               # Entry point (Express app & API routes)
├── vercel.json             # Vercel deployment configuration
├── package.json            # Dependencies and scripts
└── *.html                  # Static page views (index, about, etc.)
```

---

## 4. KEY COMPONENTS (Frontend Logic)

### UI Controllers ([script.js](file:///Users/abhijayhome/MEGA_2/VSCODE/PROJECT/TravelExplore/js/script.js))
- **`initHeroSlider()`**: Handles the main homepage slider with auto-play and manual controls.
- **`initTestimonialsSlider()`**: Manages the rotating customer reviews section.
- **`initSearch()`**: Captures search parameters (destination, date, travelers) and redirects to the packages page.

### Data Models ([models/](file:///Users/abhijayhome/MEGA_2/VSCODE/PROJECT/TravelExplore/models/))
- **`User`**: Handles `bcrypt` password hashing on save and provides `comparePassword` methods. Supports both local and Google OAuth IDs.
- **`Booking`**: Generates unique `bookingReference` and tracks payment/status.

---

## 5. ROUTING STRUCTURE

### Frontend Pages (Static)
- `/` -> `index.html` (Home)
- `/about` -> `about.html`
- `/destinations` -> `destinations.html`
- `/packages` -> `packages.html`
- `/booking` -> `booking.html` (Requires Auth in future)
- `/login` -> `login.html`
- `/dashboard` -> `dashboard.html` (User/Admin view)

---

## 6. API ENDPOINTS

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | User registration | No |
| **POST** | `/api/auth/login` | User login (returns JWT) | No |
| **GET** | `/api/auth/me` | Get current user profile | Yes (JWT) |
| **POST** | `/api/booking` | Submit a new booking | No (Optional UserID) |
| **GET** | `/api/user/:userId/bookings` | Fetch bookings for a specific user | No (Demo support) |
| **POST** | `/api/contact` | Submit contact form | No |
| **POST** | `/api/newsletter` | Subscribe to newsletter | No |
| **GET** | `/api/admin/stats` | Get system-wide stats | Yes (Admin Role) |

---

## 7. STYLING SYSTEM
- **Architecture**: Single monolithic `styles.css` using standard CSS variables (to be added) and a mobile-first responsive approach.
- **Breakpoints**: 
  - Mobile: `< 768px` (Nav menu transforms to hamburger).
  - Desktop: `> 768px`.
- **Animations**: AOS library used for scroll-reveal effects (fade-up, zoom-in).

---

## 8. ENVIRONMENT VARIABLES

Required in `.env`:
- `PORT`: Server port (default 3000).
- `MONGODB_URI`: MongoDB connection string (Local or Atlas).
- `JWT_SECRET`: Secret key for signing JSON Web Tokens.
- `SESSION_SECRET`: Secret for Express Session management.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: For Google OAuth.
- `CORS_ORIGIN`: Allowed origin for frontend requests (Production URL).

---

## 9. SCRIPTS & COMMANDS

```bash
# Install dependencies
npm install

# Start production server
npm start

# Run in development mode (with nodemon)
npm run dev

# Run in production mode with env variable
npm run prod

# Build & Run with Docker
npm run docker:build
npm run docker:run
```

---

## 10. DEPLOYMENT NOTES
- **Vercel**: Deployment is configured via `vercel.json`. The `server.js` file exports `app` for serverless execution.
- **MongoDB**: Use MongoDB Atlas for production. Ensure the IP whitelist in Atlas includes `0.0.0.0/0` for Vercel.
- **Persistence**: Vercel filesystem is ephemeral. Use MongoDB for all data persistence.

---

## 11. FUTURE SECTIONS (TODO)
- [ ] Implement robust Image Upload using Cloudinary/S3.
- [ ] Add Payment Gateway integration (Stripe/Razorpay).
- [ ] Migrate static HTML to a Template Engine (EJS) or Frontend Framework (React).
- [ ] Add comprehensive Unit and Integration tests.
