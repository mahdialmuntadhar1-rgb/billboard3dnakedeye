const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const DATA_FILE = path.join(__dirname, '../data/businesses.json');

// Load businesses data
let businessesData = [];

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      businessesData = JSON.parse(data);
      console.log(`Loaded ${businessesData.length} businesses from data file`);
    } else {
      console.log('Data file not found, using empty dataset');
      businessesData = [];
    }
  } catch (error) {
    console.error('Error loading data:', error);
    businessesData = [];
  }
}

// Load data on startup
loadData();

// API Routes

// Get all businesses with optional filters
app.get('/api/businesses', (req, res) => {
  const { governorate, category, search } = req.query;
  
  let filtered = [...businessesData];
  
  // Filter by governorate
  if (governorate && governorate !== 'all') {
    filtered = filtered.filter(b => 
      b.governorate && b.governorate.toLowerCase() === governorate.toLowerCase()
    );
  }
  
  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter(b => 
      b.category && b.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Search by name or address
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(b => 
      (b.name && b.name.toLowerCase().includes(searchLower)) ||
      (b.address && b.address.toLowerCase().includes(searchLower)) ||
      (b.bio && b.bio.toLowerCase().includes(searchLower))
    );
  }
  
  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// Get unique governorates
app.get('/api/governorates', (req, res) => {
  const governorates = [...new Set(businessesData.map(b => b.governorate).filter(Boolean))];
  governorates.sort();
  res.json({
    success: true,
    data: governorates
  });
});

// Get unique categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(businessesData.map(b => b.category).filter(Boolean))];
  categories.sort();
  res.json({
    success: true,
    data: categories
  });
});

// Get business by ID
app.get('/api/businesses/:id', (req, res) => {
  const business = businessesData.find(b => b.id === req.params.id);
  
  if (!business) {
    return res.status(404).json({
      success: false,
      message: 'Business not found'
    });
  }
  
  res.json({
    success: true,
    data: business
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    dataCount: businessesData.length
  });
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});
