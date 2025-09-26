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
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
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
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  password: string; // Hashed password
  firstName: string;
  lastName: string;
  favoriteProducts: string[]; // Array of product IDs
  createdAt: string;
  updatedAt: string;
}

interface AuthenticatedRequest extends express.Request {
  user?: User;
}

// Data storage
let products: Product[] = [];
let users: User[] = [];
const PRODUCTS_FILE = 'products.json';
const USERS_FILE = 'users.json';

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

// Initialize data
loadProducts();
loadUsers();

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
    
    // Find user by ID from token
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  });
};

// Admin authentication middleware
const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Handle both JSON and FormData requests
  const adminPassword = req.body?.adminPassword;
  const authHeader = req.headers.authorization;
  
  // Simple password check (in production, use proper authentication)
  const validPassword = 'admin123';
  
  if (adminPassword === validPassword || authHeader === `Bearer ${validPassword}`) {
    next();
  } else {
    console.log('Authentication failed. Received password:', adminPassword, 'Expected:', validPassword);
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
};

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
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
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

    // Find user
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
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
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

// Get all products
app.get('/api/products', (req, res) => {
  res.json({ products });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// Admin: Create new product
app.post('/api/admin/products', upload.array('images', 6), authenticateAdmin, (req, res) => {
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
app.put('/api/admin/products/:id', authenticateAdmin, upload.array('images', 6), (req, res) => {
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
app.delete('/api/admin/products/:id', authenticateAdmin, (req, res) => {
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
        const fullPath = path.join(process.cwd(), imagePath);
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