import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

// Simple in-memory database (in production, use a real database)
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

// Load initial products from file or use defaults
let products: Product[] = [];
const PRODUCTS_FILE = 'products.json';

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

// Initialize products
loadProducts();

// Admin authentication middleware
const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { adminPassword } = req.body;
  const authHeader = req.headers.authorization;
  
  // Simple password check (in production, use proper authentication)
  const validPassword = 'admin123';
  
  if (adminPassword === validPassword || authHeader === `Bearer ${validPassword}`) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
};

// API Routes

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
app.post('/api/admin/products', authenticateAdmin, upload.array('images', 6), (req, res) => {
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