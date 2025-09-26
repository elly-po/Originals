import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// JWT Configuration
// Environment validation
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is required');
  process.exit(1);
}
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required');
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

// Initialize Stripe conditionally
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = 'uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `product-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'));
    }
  }
});

// Interfaces for database entities
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  description?: string;
  tags: string[];
  gender?: 'men' | 'women' | 'kids' | 'unisex';
  productType?: 'apparel' | 'footwear' | 'accessories';
  subCategory?: string;
  brand?: string;
  material?: string[];
  colors?: string[];
  sizes?: string[];
  priceRange?: 'budget' | 'mid' | 'premium' | 'luxury';
  season?: 'spring' | 'summer' | 'fall' | 'winter' | 'all-season';
  // Enhanced inventory management fields
  status?: 'active' | 'sold' | 'archived' | 'draft';
  inventory?: {
    total: number;
    bySize?: Record<string, number>;
  };
  soldAt?: string;
  featured?: boolean;
  views?: number;
  favoritesCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsEvent {
  id: string;
  type: 'view' | 'favorite:add' | 'favorite:remove' | 'cart:add' | 'cart:remove' | 'cart:update' | 'search' | 'login' | 'signup' | 'order:created';
  userId?: string;
  anonId?: string;
  productId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

interface User {
  id: string;
  email: string;
  password: string; // Hashed password
  firstName: string;
  lastName: string;
  favoriteProducts: string[]; // Array of product IDs
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  isAdmin?: boolean;
}

interface AuthenticatedRequest extends express.Request {
  user?: User;
}

// Data storage
let products: Product[] = [];
let users: User[] = [];
let analyticsEvents: AnalyticsEvent[] = [];
const PRODUCTS_FILE = 'products.json';
const USERS_FILE = 'users.json';
const EVENTS_FILE = 'events.json';

// Simple rate limiting for events
const eventRateLimit = new Map<string, { count: number; resetTime: number }>();

const loadProducts = () => {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      products = JSON.parse(data);
    } else {
      // Initialize with some default products
      products = [
        {
          id: '1',
          name: 'Vintage Leather Jacket - Original 1970s Design',
          price: 299,
          image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=500',
          category: 'outerwear',
          description: 'Authentic 1970s leather jacket with original hardware',
          tags: ['vintage', 'leather', 'jacket', 'outerwear', '1970s', 'authentic'],
          gender: 'men',
          productType: 'apparel',
          subCategory: 'outerwear',
          brand: 'Heritage & Co',
          material: ['leather', 'cotton lining'],
          colors: ['black', 'brown', 'cognac'],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          priceRange: 'mid',
          season: 'fall',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      saveProducts();
    }
  } catch (error) {
    console.error('Error loading products:', error);
    products = [];
  }
};

const saveProducts = () => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

// User storage functions
const loadUsers = () => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      users = JSON.parse(data);
    } else {
      users = [];
      saveUsers();
    }
  } catch (error) {
    console.error('Error loading users:', error);
    users = [];
  }
};

const saveUsers = () => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// Analytics events storage functions
const loadAnalyticsEvents = () => {
  try {
    if (fs.existsSync(EVENTS_FILE)) {
      const data = fs.readFileSync(EVENTS_FILE, 'utf8');
      analyticsEvents = JSON.parse(data);
    } else {
      analyticsEvents = [];
      saveAnalyticsEvents();
    }
  } catch (error) {
    console.error('Error loading analytics events:', error);
    analyticsEvents = [];
  }
};

const saveAnalyticsEvents = () => {
  try {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(analyticsEvents, null, 2));
  } catch (error) {
    console.error('Error saving analytics events:', error);
  }
};

// Migration function to add default inventory fields to existing products
const migrateProducts = () => {
  let hasChanges = false;
  products = products.map(product => {
    const updatedProduct = { ...product };
    
    // Add default inventory management fields if missing
    if (!updatedProduct.status) {
      updatedProduct.status = 'active';
      hasChanges = true;
    }
    if (!updatedProduct.inventory) {
      updatedProduct.inventory = { total: 10 }; // Default inventory
      hasChanges = true;
    }
    if (updatedProduct.featured === undefined) {
      updatedProduct.featured = false;
      hasChanges = true;
    }
    if (!updatedProduct.views) {
      updatedProduct.views = 0;
      hasChanges = true;
    }
    if (!updatedProduct.favoritesCount) {
      updatedProduct.favoritesCount = 0;
      hasChanges = true;
    }
    
    return updatedProduct;
  });
  
  if (hasChanges) {
    saveProducts();
    console.log('📦 Migrated existing products with inventory management fields');
  }
};

// Initialize data
loadProducts();
loadUsers();
loadAnalyticsEvents();
migrateProducts();

// JWT authentication middleware
const authenticateToken = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Handle admin user
    if (decoded.isAdmin && decoded.userId === 'admin') {
      req.user = {
        id: 'admin',
        email: decoded.email,
        firstName: 'Admin',
        lastName: 'User',
        favoriteProducts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        password: '', // Not used for admin
        isAdmin: true
      };
      return next();
    }
    
    // Find regular user by ID from token
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = { ...user, isAdmin: false };
    next();
  });
};

// Admin authentication middleware - JWT-based
const requireAdmin = [
  authenticateToken,
  (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  }
];

// API Routes

// Authentication Routes

// User signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if this is admin email (prevent admin signup via normal route)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && email.toLowerCase() === adminEmail.toLowerCase()) {
      return res.status(400).json({ error: 'Cannot register with this email address' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      favoriteProducts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, isAdmin: false },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'User created successfully',
      user: { ...userWithoutPassword, isAdmin: false },
      token
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if this is admin login
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (adminEmail && adminPassword && email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      // Generate admin JWT
      const token = jwt.sign(
        { 
          userId: 'admin', 
          email: adminEmail, 
          isAdmin: true 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      const adminUser = {
        id: 'admin',
        email: adminEmail,
        firstName: 'Admin',
        lastName: 'User',
        favoriteProducts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isAdmin: true
      };

      return res.json({
        message: 'Admin login successful',
        user: adminUser,
        token
      });
    }

    // Find regular user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: false },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      user: { ...userWithoutPassword, isAdmin: false },
      token
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
app.get('/api/auth/user', authenticateToken, (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user favorites
app.put('/api/auth/user/favorites', authenticateToken, (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const { productId, action } = req.body; // action: 'add' or 'remove'

    if (!productId || !action) {
      return res.status(400).json({ error: 'Product ID and action are required' });
    }

    // Find the user in the users array
    const userIndex = users.findIndex(u => u.id === req.user!.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update favorites
    if (action === 'add') {
      if (!users[userIndex].favoriteProducts.includes(productId)) {
        users[userIndex].favoriteProducts.push(productId);
      }
    } else if (action === 'remove') {
      users[userIndex].favoriteProducts = users[userIndex].favoriteProducts.filter(id => id !== productId);
    } else {
      return res.status(400).json({ error: 'Invalid action. Use "add" or "remove"' });
    }

    users[userIndex].updatedAt = new Date().toISOString();
    saveUsers();

    // Return updated user
    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json({
      message: 'Favorites updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error updating favorites:', error);
    res.status(500).json({ error: 'Failed to update favorites' });
  }
});

// Product Routes

// Get all products (public - only show active/sold products)
app.get('/api/products', (req, res) => {
  // Always filter out archived and draft products for public endpoint
  // Admin should use /api/admin/products for full access
  const filteredProducts = products.filter(p => p.status !== 'archived' && p.status !== 'draft');
  res.json({ products: filteredProducts });
});

// Get single product (public - filter archived/draft)
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product || product.status === 'archived' || product.status === 'draft') {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// Admin: Create new product
app.post('/api/admin/products', ...requireAdmin, upload.array('images', 6), (req: AuthenticatedRequest, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      subCategory,
      gender,
      productType,
      brand,
      materials,
      colors,
      sizes,
      priceRange,
      season,
      tags
    } = req.body;

    // Generate new product ID
    const id = Date.now().toString();
    
    // Process uploaded images
    const files = req.files as Express.Multer.File[];
    const imagePaths = files?.map(file => `/uploads/${file.filename}`) || [];
    
    const newProduct: Product = {
      id,
      name,
      price: parseFloat(price),
      image: imagePaths[0] || 'https://via.placeholder.com/300',
      images: imagePaths,
      category: subCategory || category,
      description,
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
      gender,
      productType,
      subCategory,
      brand,
      material: Array.isArray(materials) ? materials : (materials ? [materials] : []),
      colors: Array.isArray(colors) ? colors : (colors ? [colors] : []),
      sizes: Array.isArray(sizes) ? sizes : (sizes ? [sizes] : []),
      priceRange,
      season,
      // Enhanced inventory management defaults
      status: 'active',
      inventory: { total: Math.max(0, parseInt(req.body.inventory) || 10) },
      featured: req.body.featured === 'true' || req.body.featured === true || false,
      views: 0,
      favoritesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);
    saveProducts();

    res.status(201).json({ 
      message: 'Product created successfully', 
      product: newProduct 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Admin: Update product
app.put('/api/admin/products/:id', ...requireAdmin, upload.array('images', 6), (req: AuthenticatedRequest, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existingProduct = products[productIndex];
    const files = req.files as Express.Multer.File[];
    const newImagePaths = files?.map(file => `/uploads/${file.filename}`) || [];
    
    // Merge existing data with updates
    const updatedProduct: Product = {
      ...existingProduct,
      ...req.body,
      price: req.body.price ? parseFloat(req.body.price) : existingProduct.price,
      images: newImagePaths.length > 0 ? newImagePaths : existingProduct.images,
      image: newImagePaths.length > 0 ? newImagePaths[0] : existingProduct.image,
      updatedAt: new Date().toISOString()
    };

    products[productIndex] = updatedProduct;
    saveProducts();

    res.json({ 
      message: 'Product updated successfully', 
      product: updatedProduct 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Admin: Delete product
app.delete('/api/admin/products/:id', ...requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    saveProducts();

    // Clean up uploaded images
    if (deletedProduct.images) {
      deletedProduct.images.forEach(imagePath => {
        // Remove leading slash to make path relative
        const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        const fullPath = path.join(process.cwd(), relativePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    res.json({ 
      message: 'Product deleted successfully', 
      product: deletedProduct 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ENHANCED INVENTORY MANAGEMENT ENDPOINTS

// Admin: Get products with filtering and status
app.get('/api/admin/products', ...requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const { status, featured, category, search } = req.query;
    let filteredProducts = [...products];

    // Filter by status
    if (status && typeof status === 'string') {
      filteredProducts = filteredProducts.filter(p => p.status === status);
    }

    // Filter by featured
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured === true);
    }

    // Filter by category
    if (category && typeof category === 'string') {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase().includes(category.toLowerCase()) ||
        p.subCategory?.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Search filter
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.brand?.toLowerCase().includes(searchLower)
      );
    }

    res.json({ 
      products: filteredProducts,
      total: filteredProducts.length,
      filters: { status, featured, category, search }
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Admin: Update product (PATCH for partial updates)
app.patch('/api/admin/products/:id', ...requireAdmin, upload.array('images', 6), (req: AuthenticatedRequest, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existingProduct = products[productIndex];
    const files = req.files as Express.Multer.File[];
    
    // Handle image uploads if provided
    let updatedImages = existingProduct.images || [];
    if (files && files.length > 0) {
      const newImagePaths = files.map(file => `/uploads/${file.filename}`);
      updatedImages = [...updatedImages, ...newImagePaths];
    }

    // Update fields selectively
    const updates: Partial<Product> = {};
    const allowedFields = ['name', 'price', 'description', 'status', 'featured', 'inventory', 'category', 'subCategory', 'gender', 'productType', 'brand', 'priceRange', 'season'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === 'price') {
          updates[field] = parseFloat(req.body[field]);
        } else if (field === 'featured') {
          updates[field] = req.body[field] === 'true' || req.body[field] === true;
        } else if (field === 'inventory' && typeof req.body[field] === 'string') {
          try {
            updates[field] = JSON.parse(req.body[field]);
          } catch {
            updates[field] = { total: parseInt(req.body[field]) || 0 };
          }
        } else {
          updates[field] = req.body[field];
        }
      }
    }

    // Handle array fields
    if (req.body.materials) {
      updates.material = Array.isArray(req.body.materials) ? req.body.materials : req.body.materials.split(',');
    }
    if (req.body.colors) {
      updates.colors = Array.isArray(req.body.colors) ? req.body.colors : req.body.colors.split(',');
    }
    if (req.body.sizes) {
      updates.sizes = Array.isArray(req.body.sizes) ? req.body.sizes : req.body.sizes.split(',');
    }

    // Update the product
    products[productIndex] = {
      ...existingProduct,
      ...updates,
      images: updatedImages,
      updatedAt: new Date().toISOString()
    };

    saveProducts();

    res.json({ 
      message: 'Product updated successfully', 
      product: products[productIndex] 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Admin: Mark product as sold
app.post('/api/admin/products/:id/sold', ...requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { action } = req.body; // 'archive' or 'keep'
    
    if (!action || !['archive', 'keep'].includes(action)) {
      return res.status(400).json({ error: 'Action must be "archive" or "keep"' });
    }

    // Update product
    products[productIndex] = {
      ...products[productIndex],
      status: action === 'archive' ? 'archived' : 'sold',
      soldAt: new Date().toISOString(),
      inventory: { total: 0 },
      updatedAt: new Date().toISOString()
    };

    saveProducts();

    res.json({ 
      message: `Product marked as sold and ${action === 'archive' ? 'archived' : 'kept visible'}`, 
      product: products[productIndex] 
    });
  } catch (error) {
    console.error('Error marking product as sold:', error);
    res.status(500).json({ error: 'Failed to mark product as sold' });
  }
});

// ANALYTICS ENDPOINTS

// Track analytics events (public endpoint with rate limiting)
app.post('/api/events', (req, res) => {
  try {
    const { type, userId, anonId, productId, metadata } = req.body;
    
    // IP-based rate limiting: 100 events per hour per IP (not client-controlled)
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;
    
    const rateData = eventRateLimit.get(clientIP);
    if (rateData && now < rateData.resetTime) {
      if (rateData.count >= 100) {
        return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
      }
      rateData.count++;
    } else {
      eventRateLimit.set(clientIP, { count: 1, resetTime: now + hourInMs });
    }
    
    // Clean up old rate limit entries periodically
    if (Math.random() < 0.01) { // 1% chance
      for (const [key, data] of eventRateLimit.entries()) {
        if (now >= data.resetTime) {
          eventRateLimit.delete(key);
        }
      }
    }
    
    // Validate event type
    const validTypes = ['view', 'favorite:add', 'favorite:remove', 'cart:add', 'cart:remove', 'cart:update', 'search', 'login', 'signup', 'order:created'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid event type' });
    }

    // Create event
    const event: AnalyticsEvent = {
      id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
      type,
      userId,
      anonId,
      productId,
      metadata: metadata || {},
      timestamp: new Date().toISOString()
    };

    // Add to events array (keep last 10000 events)
    analyticsEvents.push(event);
    if (analyticsEvents.length > 10000) {
      analyticsEvents = analyticsEvents.slice(-10000);
    }

    saveAnalyticsEvents();

    // Update product metrics if relevant
    if (productId && (type === 'view' || type === 'favorite:add' || type === 'favorite:remove')) {
      const productIndex = products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        if (type === 'view') {
          products[productIndex].views = (products[productIndex].views || 0) + 1;
        } else if (type === 'favorite:add') {
          products[productIndex].favoritesCount = (products[productIndex].favoritesCount || 0) + 1;
        } else if (type === 'favorite:remove') {
          products[productIndex].favoritesCount = Math.max(0, (products[productIndex].favoritesCount || 0) - 1);
        }
        products[productIndex].updatedAt = new Date().toISOString();
        saveProducts();
      }
    }

    res.json({ message: 'Event tracked successfully' });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// Admin: Get metrics and analytics
app.get('/api/admin/metrics', ...requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // User metrics
    const totalUsers = users.length;
    const signups7d = users.filter(u => new Date(u.createdAt) >= sevenDaysAgo).length;
    const signups30d = users.filter(u => new Date(u.createdAt) >= thirtyDaysAgo).length;

    // Product metrics
    const activeProducts = products.filter(p => p.status === 'active').length;
    const soldProducts7d = products.filter(p => p.soldAt && new Date(p.soldAt) >= sevenDaysAgo).length;
    const soldProducts30d = products.filter(p => p.soldAt && new Date(p.soldAt) >= thirtyDaysAgo).length;

    // Category analysis
    const categoryStats = products.reduce((acc, product) => {
      const category = product.subCategory || product.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Search terms from events
    const searchEvents = analyticsEvents.filter(e => e.type === 'search' && e.metadata?.query);
    const searchTerms = searchEvents.reduce((acc, event) => {
      const term = event.metadata?.query?.toLowerCase();
      if (term) {
        acc[term] = (acc[term] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Activity metrics
    const events7d = analyticsEvents.filter(e => new Date(e.timestamp) >= sevenDaysAgo);
    const uniqueUsers7d = new Set([
      ...events7d.filter(e => e.userId).map(e => e.userId),
      ...events7d.filter(e => e.anonId).map(e => e.anonId)
    ]).size;

    // Most viewed/favorited products
    const topProducts = products
      .filter(p => p.views || p.favoritesCount)
      .sort((a, b) => ((b.views || 0) + (b.favoritesCount || 0)) - ((a.views || 0) + (a.favoritesCount || 0)))
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        name: p.name,
        views: p.views || 0,
        favorites: p.favoritesCount || 0,
        status: p.status
      }));

    res.json({
      users: {
        total: totalUsers,
        signups7d,
        signups30d,
        activeUsers7d: uniqueUsers7d
      },
      products: {
        active: activeProducts,
        sold7d: soldProducts7d,
        sold30d: soldProducts30d,
        total: products.length
      },
      categories: Object.entries(categoryStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([category, count]) => ({ category, count })),
      searches: Object.entries(searchTerms)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([term, count]) => ({ term, count })),
      topProducts,
      activity: {
        events7d: events7d.length,
        uniqueUsers7d
      }
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Admin: Get user statistics
app.get('/api/admin/users/stats', ...requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const { window = '30' } = req.query;
    const days = parseInt(window as string) || 30;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const recentUsers = users.filter(u => new Date(u.createdAt) >= cutoffDate);
    const activeUsers = users.filter(u => u.lastLoginAt && new Date(u.lastLoginAt) >= cutoffDate);

    res.json({
      total: users.length,
      recent: recentUsers.length,
      active: activeUsers.length,
      window: days
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// Stripe: Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ 
        error: 'Payment processing not configured. Stripe API key required.' 
      });
    }

    const { amount, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        source: 'originals-store'
      }
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create payment intent', 
      message: error.message 
    });
  }
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // In production, you'd send an email or save to database
    console.log('Contact form submission:', { name, email, subject, message });
    
    // For now, just log and return success
    res.json({ 
      message: 'Thank you for your message! We will get back to you soon.',
      success: true 
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    productsCount: products.length
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Products loaded: ${products.length}`);
  console.log(`💳 Stripe ${stripe ? 'configured' : 'not configured'}`);
});

export default app;