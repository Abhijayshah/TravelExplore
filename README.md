# TravelExplore - Complete Travel Tour Website

🌍 A fully functional, responsive travel tour website built with HTML5, CSS3, Vanilla JavaScript, and Node.js backend.

## 🚀 Features

### Frontend Features
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern UI/UX**: Beautiful animations, hover effects, and smooth transitions
- **Interactive Components**: Image sliders, carousels, and dynamic content
- **Multiple Pages**: Home, About, Destinations, Packages, Booking, Contact, Login, Dashboard
- **User Authentication**: Login/Signup with demo credentials
- **Booking System**: Multi-step booking form with validation
- **Search & Filter**: Package search and destination filtering
- **Responsive Navigation**: Sticky header with mobile-friendly menu

### Backend Features
- **Express.js Server**: RESTful API endpoints
- **Form Handling**: Contact, booking, and newsletter submissions
- **Data Storage**: JSON file-based storage (easily replaceable with database)
- **User Management**: Registration, login, and profile management
- **Demo Data**: Pre-populated sample data for testing

### Key Destinations
- 🏔️ Manali - Adventure & Mountain Tours
- 🏖️ Goa - Beach Holidays & Water Sports
- 🏔️ Ladakh - High Altitude Expeditions
- 🌴 Kerala - Backwater Cruises
- 🏝️ Andaman - Island Paradise
- ❄️ Shimla - Hill Station Retreats
- 🏰 Jaipur - Cultural Heritage Tours
- 🕌 Golden Triangle - Classic India Tour

## 📁 Project Structure

```
travelexplore-website/
├── index.html              # Home page
├── about.html              # About us page
├── destinations.html       # Destinations listing
├── packages.html           # Tour packages
├── booking.html            # Booking form
├── contact.html            # Contact page with map
├── login.html              # Login/Signup page
├── dashboard.html          # User dashboard
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── script.js           # Main JavaScript file
├── images/                 # Image assets (if any)
├── data/                   # JSON data storage
│   ├── bookings.json       # Booking records
│   ├── contacts.json       # Contact form submissions
│   ├── newsletters.json    # Newsletter subscriptions
│   ├── users.json          # User accounts
│   └── reviews.json        # User reviews
├── server.js               # Express.js backend server
├── package.json            # Node.js dependencies
└── README.md               # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Modern web browser

### Quick Start

1. **Clone or Download the Project**
   ```bash
   # If using git
   git clone <repository-url>
   cd travelexplore-website
   
   # Or download and extract the ZIP file
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Server**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with auto-restart)
   npm run dev
   ```

4. **Open in Browser**
   ```
   http://localhost:3000
   ```

### Alternative: Frontend Only

If you want to run just the frontend without the backend:

1. Open `index.html` directly in your browser
2. Or use a simple HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server
   
   # Using Live Server (VS Code extension)
   ```

## 🔐 Demo Credentials

**Login Details:**
- Email: `demo@user.com`
- Password: `123456`

## 📱 Pages Overview

### 1. Home Page (`index.html`)
- Hero section with image slider
- Popular destinations showcase
- Featured tour packages
- Customer testimonials
- Newsletter subscription

### 2. About Us (`about.html`)
- Company introduction
- Mission and vision
- Why choose us section
- Team profiles
- Statistics and achievements

### 3. Destinations (`destinations.html`)
- Destination categories (Mountains, Beaches, Cultural, Adventure)
- Interactive filtering
- Detailed destination cards
- Climate and duration information

### 4. Tour Packages (`packages.html`)
- Package listings with filters
- Detailed package information
- Pricing and inclusions
- Booking buttons
- Package comparison

### 5. Booking Page (`booking.html`)
- Multi-step booking form
- Package selection
- Personal details
- Travel preferences
- Payment options
- Booking confirmation

### 6. Contact Page (`contact.html`)
- Contact information cards
- Interactive contact form
- Embedded Google Maps
- Quick contact options
- FAQ section
- Callback request feature

### 7. Login/Signup (`login.html`)
- Toggle between login and signup
- Form validation
- Password strength indicator
- Social login buttons (UI only)
- Terms and privacy checkboxes

### 8. Dashboard (`dashboard.html`)
- User profile overview
- Booking history
- Wishlist management
- Reviews and ratings
- Loyalty points and rewards
- Quick actions

## 🎨 Design Features

### Color Scheme
- Primary: `#2c5aa0` (Blue)
- Secondary: `#1e3d6f` (Dark Blue)
- Accent: `#28a745` (Green)
- Background: `#f8f9fa` (Light Gray)
- Text: `#333` (Dark Gray)

### Typography
- Font Family: System fonts with fallbacks
- Responsive font sizes
- Proper heading hierarchy
- Readable line heights

### Animations
- CSS transitions and transforms
- AOS (Animate On Scroll) library
- Hover effects on cards and buttons
- Smooth scrolling navigation
- Loading animations

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Bookings
- `POST /api/booking` - Submit booking
- `GET /api/user/:userId/bookings` - Get user bookings

### Contact & Communication
- `POST /api/contact` - Contact form submission
- `POST /api/newsletter` - Newsletter subscription
- `POST /api/callback` - Callback request

### Packages & Reviews
- `GET /api/packages` - Get tour packages
- `GET /api/packages/search` - Search packages
- `POST /api/reviews` - Submit review
- `GET /api/user/:userId/reviews` - Get user reviews

### Admin
- `GET /api/admin/stats` - Get statistics

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 481px - 768px
- **Desktop**: 769px - 1024px
- **Large Desktop**: > 1024px

## 🌐 External Resources

### CDN Libraries
- Font Awesome 6.0.0 (Icons)
- AOS 2.3.1 (Scroll Animations)

### Image Sources
- Unsplash (High-quality travel photos)
- Pexels (Additional stock photos)

## 🔒 Security Features

- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers
- Environment variables for sensitive data
- XSS protection

## 🚀 Deployment Options

### Local Development
```bash
npm run dev
```

### Production Deployment

**Heroku:**
```bash
# Install Heroku CLI
heroku create your-app-name
git push heroku main
```

**Netlify (Frontend only):**
1. Connect your GitHub repository
2. Set build command: `npm run build` (if applicable)
3. Set publish directory: `/`

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Traditional Hosting:**
1. Upload files to your web server
2. Install Node.js on server
3. Run `npm install` and `npm start`
4. Configure reverse proxy (nginx/Apache)

## 🔧 Customization

### Adding New Destinations
1. Add destination data in `js/script.js`
2. Update the destinations page
3. Add corresponding images

### Modifying Packages
1. Update package data in server.js or create a packages.json file
2. Modify the packages display logic
3. Update pricing and inclusions

### Styling Changes
1. Modify `css/styles.css`
2. Update color variables
3. Adjust responsive breakpoints
4. Customize animations

### Backend Modifications
1. Add new API endpoints in `server.js`
2. Implement database integration
3. Add authentication middleware
4. Integrate payment gateways

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

**Dependencies Not Installing:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Images Not Loading:**
- Check internet connection for external images
- Verify image URLs are accessible
- Use local images if needed

## 📈 Performance Optimization

### Frontend
- Optimized images (WebP format recommended)
- Minified CSS and JavaScript
- Lazy loading for images
- Efficient animations

### Backend
- Gzip compression
- Caching headers
- Database indexing (when implemented)
- Rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@travelexplore.com
- Phone: +91 98765 43210
- Website: [TravelExplore](http://localhost:3000)

## 🙏 Acknowledgments

- Unsplash and Pexels for beautiful travel photography
- Font Awesome for comprehensive icon library
- AOS library for smooth scroll animations
- Express.js community for excellent documentation

---

**Happy Traveling! 🌍✈️**

Built with ❤️ by the TravelExplore Team