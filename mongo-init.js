// MongoDB initialization script for Docker
// This script runs when the MongoDB container starts for the first time

// Switch to the travelexplore database
db = db.getSiblingDB('travelexplore');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
          description: 'must be a valid email and is required'
        },
        password: {
          bsonType: 'string',
          minLength: 6,
          description: 'must be a string with minimum 6 characters and is required'
        },
        role: {
          bsonType: 'string',
          enum: ['user', 'admin'],
          description: 'must be either user or admin'
        },
        isActive: {
          bsonType: 'bool',
          description: 'must be a boolean'
        }
      }
    }
  }
});

db.createCollection('bookings');
db.createCollection('contacts');
db.createCollection('newsletters');
db.createCollection('reviews');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

db.bookings.createIndex({ userId: 1 });
db.bookings.createIndex({ status: 1 });
db.bookings.createIndex({ bookingReference: 1 }, { unique: true });
db.bookings.createIndex({ 'travelDetails.startDate': 1 });
db.bookings.createIndex({ createdAt: -1 });

db.contacts.createIndex({ status: 1 });
db.contacts.createIndex({ email: 1 });
db.contacts.createIndex({ createdAt: -1 });

db.newsletters.createIndex({ email: 1 }, { unique: true });
db.newsletters.createIndex({ status: 1 });
db.newsletters.createIndex({ createdAt: -1 });

db.reviews.createIndex({ userId: 1 });
db.reviews.createIndex({ packageName: 1 });
db.reviews.createIndex({ destination: 1 });
db.reviews.createIndex({ 'rating.overall': -1 });
db.reviews.createIndex({ status: 1 });
db.reviews.createIndex({ createdAt: -1 });

// Insert demo data
db.users.insertOne({
  name: 'Demo User',
  email: 'demo@user.com',
  password: '123456', // In production, this should be hashed
  phone: '+91 98765 43210',
  role: 'user',
  isActive: true,
  preferences: {
    destinations: ['adventure', 'beach', 'luxury'],
    budget: 'medium',
    travelStyle: 'comfort'
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

db.users.insertOne({
  name: 'Admin User',
  email: 'admin@travelexplore.com',
  password: 'admin123', // In production, this should be hashed
  phone: '+91 98765 43211',
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Insert sample packages data (for reference)
db.packages.insertMany([
  {
    name: 'Bali Adventure Package',
    destination: 'Bali, Indonesia',
    duration: 7,
    price: 899,
    description: 'Experience the beauty of Bali with our comprehensive adventure package.',
    features: ['Hotel Accommodation', 'Airport Transfer', 'Guided Tours', 'Meals'],
    category: 'adventure',
    rating: 4.8,
    availability: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Paris Romantic Getaway',
    destination: 'Paris, France',
    duration: 5,
    price: 1299,
    description: 'A romantic escape to the City of Light with luxury accommodations.',
    features: ['Luxury Hotel', 'Seine River Cruise', 'Eiffel Tower Visit', 'Fine Dining'],
    category: 'luxury',
    rating: 4.9,
    availability: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Tokyo Cultural Experience',
    destination: 'Tokyo, Japan',
    duration: 6,
    price: 1099,
    description: 'Immerse yourself in Japanese culture and modern city life.',
    features: ['Traditional Ryokan', 'Temple Tours', 'Sushi Making Class', 'City Guide'],
    category: 'cultural',
    rating: 4.7,
    availability: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Database initialized successfully with demo data!');