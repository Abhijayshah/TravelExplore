require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('./config/passport');
const bcrypt = require('bcryptjs');

// Database connection
const { connectDB, checkDBHealth } = require('./config/database');

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelexplore';
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Models
const User = require('./models/User');
const Booking = require('./models/Booking');
const Contact = require('./models/Contact');
const Newsletter = require('./models/Newsletter');
const Review = require('./models/Review');

// Middleware
const { generateToken, verifyToken, requireAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"]
    }
  }
}));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('.'));

// Helper function to generate unique IDs
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    const dbHealth = checkDBHealth();
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: dbHealth,
        uptime: process.uptime()
    });
});

// Routes

// Serve main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/destinations', (req, res) => {
    res.sendFile(path.join(__dirname, 'destinations.html'));
});

app.get('/packages', (req, res) => {
    res.sendFile(path.join(__dirname, 'packages.html'));
});

app.get('/booking', (req, res) => {
    res.sendFile(path.join(__dirname, 'booking.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// API Routes

// Contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }
        
        const contact = new Contact({
            name,
            email,
            phone: phone || '',
            subject,
            message
        });
        
        await contact.save();
        
        res.json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
            contactId: contact._id
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error sending your message. Please try again.'
        });
    }
});

// Google OAuth routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login?error=auth_failed' }),
    async (req, res) => {
        try {
            // Update last login
            await req.user.updateLastLogin();
            
            // Generate JWT token
            const token = generateToken(req.user._id);
            
            // Redirect to dashboard with token
            res.redirect(`/dashboard?token=${token}&user=${encodeURIComponent(JSON.stringify({
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                avatar: req.user.avatar
            }))}`);
        } catch (error) {
            console.error('Google OAuth callback error:', error);
            res.redirect('/login?error=auth_failed');
        }
    }
);

// Logout route
app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error during logout'
            });
        }
        
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error destroying session'
                });
            }
            
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        });
    });
});

// Get current user route
app.get('/api/auth/me', verifyToken, async (req, res) => {
    try {
        // req.user is already set by verifyToken middleware
        const user = req.user;
        
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data'
        });
    }
});

// Newsletter subscription
app.post('/api/newsletter', async (req, res) => {
    try {
        const { email, name } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email address is required'
            });
        }
        
        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({
                success: false,
                message: 'This email is already subscribed to our newsletter'
            });
        }
        
        const subscriber = new Newsletter({
            email,
            name: name || ''
        });
        
        await subscriber.save();
        
        res.json({
            success: true,
            message: 'Thank you for subscribing to our newsletter!'
        });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error processing your subscription. Please try again.'
        });
    }
});

// Booking submission
app.post('/api/booking', async (req, res) => {
    try {
        const {
            packageName,
            destination,
            customerInfo,
            travelDetails,
            pricing,
            specialRequests
        } = req.body;
        
        // Validate required fields
        if (!packageName || !destination || !customerInfo || !travelDetails) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required booking information'
            });
        }
        
        const booking = new Booking({
            userId: req.user?._id, // If user is logged in
            packageName,
            destination,
            customerInfo,
            travelDetails,
            pricing: pricing || { basePrice: 0, totalPrice: 0 },
            specialRequests
        });
        
        await booking.save();
        
        res.json({
            success: true,
            message: 'Your booking has been submitted successfully! We will contact you within 24 hours to confirm your reservation.',
            bookingId: booking._id,
            bookingReference: booking.bookingReference
        });
    } catch (error) {
        console.error('Booking submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error processing your booking. Please try again.'
        });
    }
});

// User authentication
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        
        // Check for demo user first
        if (email === 'demo@user.com' && password === '123456') {
            // Create or find demo user
            let user = await User.findOne({ email: 'demo@user.com' });
            
            if (!user) {
                user = new User({
                    name: 'Demo User',
                    email: 'demo@user.com',
                    password: '123456',
                    role: 'user',
                    isActive: true,
                    authProvider: 'local'
                });
                await user.save();
            }
            
            // Update last login
            await user.updateLastLogin();
            
            // Generate JWT token
            const token = generateToken(user._id);
            
            const userResponse = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                lastLogin: user.lastLogin
            };
            
            return res.json({
                success: true,
                message: 'Login successful',
                user: userResponse,
                token
            });
        }
        
        // Find user in database
        const user = await User.findOne({ email, isActive: true });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // Update last login
        await user.updateLastLogin();
        
        // Generate JWT token
        const token = generateToken(user._id);
        
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            lastLogin: user.lastLogin
        };
        
        res.json({
            success: true,
            message: 'Login successful',
            user: userResponse,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error during login. Please try again.'
        });
    }
});

// User registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone, firstName, lastName } = req.body;
        
        // Combine firstName and lastName if provided
        const fullName = firstName && lastName ? `${firstName} ${lastName}` : name;
        
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }
        
        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        
        // Create new user (password will be hashed by pre-save middleware)
        const user = new User({
            name: fullName,
            email,
            password,
            phone: phone || '',
            role: 'user',
            isActive: true,
            authProvider: 'local'
        });
        
        await user.save();
        
        // Generate JWT token
        const token = generateToken(user._id);
        
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        };
        
        res.json({
            success: true,
            message: 'Registration successful! Welcome to TravelExplore!',
            user: userResponse,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error processing your registration. Please try again.'
        });
    }
});

// Get user bookings
app.get('/api/user/:userId/bookings', (req, res) => {
    try {
        const { userId } = req.params;
        const userBookings = bookings.filter(booking => booking.userId === userId || booking.email === 'demo@user.com');
        
        // Add some demo bookings for demo user
        if (userId === 'demo-user-123' && userBookings.length === 0) {
            const demoBookings = [
                {
                    id: 'booking-1',
                    packageName: 'Manali Adventure Package',
                    destination: 'Manali',
                    startDate: '2024-12-25',
                    endDate: '2024-12-30',
                    travelers: 2,
                    totalAmount: 45000,
                    status: 'confirmed',
                    paymentStatus: 'paid',
                    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'booking-2',
                    packageName: 'Goa Beach Holiday',
                    destination: 'Goa',
                    startDate: '2025-01-15',
                    endDate: '2025-01-20',
                    travelers: 4,
                    totalAmount: 80000,
                    status: 'upcoming',
                    paymentStatus: 'paid',
                    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'booking-3',
                    packageName: 'Kerala Backwaters',
                    destination: 'Kerala',
                    startDate: '2024-11-10',
                    endDate: '2024-11-15',
                    travelers: 2,
                    totalAmount: 35000,
                    status: 'completed',
                    paymentStatus: 'paid',
                    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                }
            ];
            return res.json({ success: true, bookings: demoBookings });
        }
        
        res.json({ success: true, bookings: userBookings });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving bookings'
        });
    }
});

// Get user reviews
app.get('/api/user/:userId/reviews', (req, res) => {
    try {
        const { userId } = req.params;
        const userReviews = reviews.filter(review => review.userId === userId);
        
        // Add demo reviews for demo user
        if (userId === 'demo-user-123' && userReviews.length === 0) {
            const demoReviews = [
                {
                    id: 'review-1',
                    packageName: 'Kerala Backwaters',
                    destination: 'Kerala',
                    rating: 5,
                    title: 'Amazing Experience!',
                    comment: 'The Kerala backwaters tour was absolutely magical. The houseboat experience was unforgettable and the local cuisine was delicious.',
                    date: '2024-11-20',
                    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                },
                {
                    id: 'review-2',
                    packageName: 'Shimla Hill Station',
                    destination: 'Shimla',
                    rating: 4,
                    title: 'Great Mountain Getaway',
                    comment: 'Beautiful mountain views and pleasant weather. The hotel was comfortable and the local sightseeing was well organized.',
                    date: '2024-10-05',
                    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                }
            ];
            return res.json({ success: true, reviews: demoReviews });
        }
        
        res.json({ success: true, reviews: userReviews });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving reviews'
        });
    }
});

// Submit review
app.post('/api/reviews', (req, res) => {
    try {
        const reviewData = {
            id: generateId(),
            ...req.body,
            timestamp: new Date().toISOString(),
            status: 'published'
        };
        
        reviews.push(reviewData);
        saveData('reviews.json', reviews);
        
        console.log('New review submission:', reviewData);
        
        res.json({
            success: true,
            message: 'Thank you for your review! It has been published.',
            review: reviewData
        });
    } catch (error) {
        console.error('Review submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error submitting your review. Please try again.'
        });
    }
});

// Get packages (demo data)
app.get('/api/packages', (req, res) => {
    const packages = [
        {
            id: 'manali-adventure',
            name: 'Manali Adventure Package',
            destination: 'Manali',
            duration: '5 Days / 4 Nights',
            price: 22500,
            originalPrice: 25000,
            rating: 4.8,
            reviews: 156,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            highlights: ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple', 'Adventure Sports'],
            inclusions: ['Accommodation', 'Meals', 'Transportation', 'Sightseeing'],
            category: 'adventure'
        },
        {
            id: 'goa-beach',
            name: 'Goa Beach Holiday',
            destination: 'Goa',
            duration: '4 Days / 3 Nights',
            price: 18000,
            originalPrice: 20000,
            rating: 4.6,
            reviews: 203,
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            highlights: ['Beach Activities', 'Water Sports', 'Nightlife', 'Local Cuisine'],
            inclusions: ['Beach Resort', 'Breakfast', 'Airport Transfer', 'Water Sports'],
            category: 'beach'
        },
        {
            id: 'ladakh-expedition',
            name: 'Ladakh Expedition',
            destination: 'Ladakh',
            duration: '7 Days / 6 Nights',
            price: 35000,
            originalPrice: 40000,
            rating: 4.9,
            reviews: 89,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            highlights: ['Leh Palace', 'Pangong Lake', 'Nubra Valley', 'Monasteries'],
            inclusions: ['Accommodation', 'All Meals', 'Inner Line Permits', 'Oxygen Support'],
            category: 'adventure'
        }
    ];
    
    res.json({ success: true, packages });
});

// Search packages
app.get('/api/packages/search', (req, res) => {
    try {
        const { destination, duration, budget, category } = req.query;
        
        // This would normally query a database
        // For demo, return filtered results
        res.json({
            success: true,
            message: `Found packages for ${destination || 'all destinations'}`,
            packages: [], // Would contain filtered packages
            searchParams: { destination, duration, budget, category }
        });
    } catch (error) {
        console.error('Package search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching packages'
        });
    }
});

// Callback request
app.post('/api/callback', (req, res) => {
    try {
        const callbackData = {
            id: generateId(),
            ...req.body,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        // In a real app, this would trigger a callback system
        console.log('Callback request:', callbackData);
        
        res.json({
            success: true,
            message: 'Callback request submitted! We will call you back within the specified time.',
            callbackId: callbackData.id
        });
    } catch (error) {
        console.error('Callback request error:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error processing your callback request. Please try again.'
        });
    }
});

// Admin routes (basic)
app.get('/api/admin/stats', (req, res) => {
    try {
        const stats = {
            totalBookings: bookings.length,
            totalContacts: contacts.length,
            totalNewsletterSubscribers: newsletters.length,
            totalUsers: users.length,
            totalReviews: reviews.length,
            recentBookings: bookings.slice(-5),
            recentContacts: contacts.slice(-5)
        };
        
        res.json({ success: true, stats });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving statistics'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 TravelExplore Server running on http://localhost:${PORT}`);
    console.log('📁 Serving static files from current directory');
    console.log('💾 Data will be stored in ./data/ directory');
    console.log('🔐 Demo login: demo@user.com / 123456');
    console.log('\n📋 Available endpoints:');
    console.log('   GET  /                     - Home page');
    console.log('   GET  /about               - About page');
    console.log('   GET  /destinations        - Destinations page');
    console.log('   GET  /packages            - Packages page');
    console.log('   GET  /booking             - Booking page');
    console.log('   GET  /contact             - Contact page');
    console.log('   GET  /login               - Login page');
    console.log('   GET  /dashboard           - Dashboard page');
    console.log('   POST /api/contact         - Contact form submission');
    console.log('   POST /api/newsletter      - Newsletter subscription');
    console.log('   POST /api/booking         - Booking submission');
    console.log('   POST /api/auth/login      - User login');
    console.log('   POST /api/auth/register   - User registration');
    console.log('   GET  /api/packages        - Get packages');
    console.log('   GET  /api/packages/search - Search packages');
    console.log('   POST /api/callback        - Callback request');
    console.log('   GET  /api/admin/stats     - Admin statistics');
});

module.exports = app;