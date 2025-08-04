const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  preferences: {
    destinations: [String],
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly'],
      default: 'monthly'
    },
    categories: [{
      type: String,
      enum: ['deals', 'destinations', 'tips', 'news']
    }]
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active'
  },
  source: {
    type: String,
    enum: ['website', 'social', 'referral', 'import'],
    default: 'website'
  },
  lastEmailSent: {
    type: Date
  },
  unsubscribedAt: {
    type: Date
  },
  unsubscribeReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ createdAt: -1 });
newsletterSchema.index({ 'preferences.categories': 1 });

module.exports = mongoose.model('Newsletter', newsletterSchema);