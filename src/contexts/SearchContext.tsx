import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  tags: string[];
  // Enhanced categorization
  gender?: 'men' | 'women' | 'kids' | 'unisex';
  productType?: 'apparel' | 'footwear' | 'accessories';
  subCategory?: string; // e.g., 'outerwear', 'sneakers', 'bags'
  // Level 3 refinement properties
  brand?: string;
  material?: string[];
  colors?: string[];
  sizes?: string[];
  priceRange?: 'budget' | 'mid' | 'premium' | 'luxury';
  season?: 'spring' | 'summer' | 'fall' | 'winter' | 'all-season';
}

// Level 3 refinement filter state
interface RefinementFilters {
  brands: string[];
  materials: string[];
  colors: string[];
  priceRanges: string[];
  seasons: string[];
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  // Level 3 refinement filters
  activeRefinements: RefinementFilters;
  setActiveRefinements: (refinements: RefinementFilters) => void;
  updateRefinement: (category: keyof RefinementFilters, value: string, add: boolean) => void;
  clearAllRefinements: () => void;
  filteredProducts: Product[];
  allProducts: Product[];
  products: Product[]; // Add products alias for compatibility
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  // Admin functionality
  addProduct: (product: Product) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Enhanced mock data with comprehensive categorization
const mockProducts: Product[] = [
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
    season: 'fall'
  },
  {
    id: '2',
    name: 'Classic Denim Jeans - Heritage Wash',
    price: 149,
    image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'denim',
    description: 'Heritage wash denim with classic straight cut',
    tags: ['denim', 'jeans', 'heritage', 'classic', 'vintage', 'blue'],
    gender: 'unisex',
    productType: 'apparel',
    subCategory: 'bottoms',
    brand: 'Authentic Denim',
    material: ['denim', 'cotton'],
    colors: ['indigo', 'black', 'stone wash'],
    sizes: ['28', '30', '32', '34', '36', '38'],
    priceRange: 'mid',
    season: 'all-season'
  },
  {
    id: '3',
    name: 'Handcrafted Wool Sweater - Traditional Knit',
    price: 189,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'knitwear',
    description: 'Traditional hand-knitted wool sweater with authentic patterns',
    tags: ['wool', 'sweater', 'handcrafted', 'traditional', 'knit', 'warm'],
    gender: 'women',
    productType: 'apparel',
    subCategory: 'tops',
    brand: 'Nordic Craft',
    material: ['wool', 'alpaca'],
    colors: ['cream', 'grey', 'navy'],
    sizes: ['XS', 'S', 'M', 'L'],
    priceRange: 'mid',
    season: 'winter'
  },
  {
    id: '4',
    name: 'Original Canvas Sneakers - 1960s Style',
    price: 89,
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'footwear',
    description: 'Authentic 1960s style canvas sneakers with original rubber sole',
    tags: ['sneakers', 'canvas', '1960s', 'vintage', 'footwear', 'casual'],
    gender: 'unisex',
    productType: 'footwear',
    subCategory: 'sneakers',
    brand: 'Retro Steps',
    material: ['canvas', 'rubber'],
    colors: ['white', 'black', 'navy'],
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    priceRange: 'budget',
    season: 'all-season'
  },
  {
    id: '5',
    name: 'Authentic Silk Scarf - Hand-printed Pattern',
    price: 79,
    image: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'accessories',
    description: 'Hand-printed silk scarf with traditional patterns and authentic craftsmanship',
    tags: ['silk', 'scarf', 'handprinted', 'accessories', 'pattern', 'luxury'],
    gender: 'women',
    productType: 'accessories',
    subCategory: 'headwear',
    brand: 'Artisan Silk',
    material: ['silk'],
    colors: ['floral', 'geometric', 'paisley'],
    sizes: ['one size'],
    priceRange: 'budget',
    season: 'all-season'
  },
  {
    id: '6',
    name: 'Vintage Leather Boots - Handmade Quality',
    price: 249,
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'footwear',
    description: 'Handmade vintage leather boots with authentic stitching and durable construction',
    tags: ['boots', 'leather', 'vintage', 'handmade', 'footwear', 'durable'],
    gender: 'men',
    productType: 'footwear',
    subCategory: 'boots',
    brand: 'Cobbler & Sons',
    material: ['leather', 'rubber sole'],
    colors: ['brown', 'black', 'tan'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    priceRange: 'mid',
    season: 'fall'
  },
  // Additional products for better categorization demonstration
  {
    id: '7',
    name: 'Kids Rainbow Sneakers - Playful Design',
    price: 45,
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'footwear',
    description: 'Colorful sneakers designed for active kids with comfort in mind',
    tags: ['kids', 'sneakers', 'colorful', 'comfortable', 'playful'],
    gender: 'kids',
    productType: 'footwear',
    subCategory: 'sneakers',
    brand: 'Little Steps',
    material: ['synthetic', 'mesh'],
    colors: ['rainbow', 'pink', 'blue'],
    sizes: ['10', '11', '12', '13', '1', '2', '3'],
    priceRange: 'budget',
    season: 'all-season'
  },
  {
    id: '8',
    name: 'Minimalist Leather Handbag - Contemporary Style',
    price: 199,
    image: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'accessories',
    description: 'Clean-lined leather handbag perfect for modern professionals',
    tags: ['handbag', 'leather', 'minimalist', 'professional', 'contemporary'],
    gender: 'women',
    productType: 'accessories',
    subCategory: 'bags',
    brand: 'Modern Craft',
    material: ['leather', 'cotton lining'],
    colors: ['black', 'tan', 'navy'],
    sizes: ['one size'],
    priceRange: 'mid',
    season: 'all-season'
  },
  // Add missing subcategory products
  {
    id: '9',
    name: 'Silk Slip Dress - Vintage Inspired',
    price: 195,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'dresses',
    description: 'Luxurious silk slip dress with vintage-inspired cut.',
    tags: ['dress', 'silk', 'elegant', 'vintage-inspired'],
    gender: 'women',
    productType: 'apparel',
    subCategory: 'dresses-skirts',
    brand: 'Silk Studio',
    material: ['silk'],
    colors: ['champagne', 'black', 'navy'],
    sizes: ['XS', 'S', 'M', 'L'],
    priceRange: 'mid',
    season: 'spring'
  },
  {
    id: '10',
    name: 'Modal Lounge Set - Ultimate Comfort',
    price: 78,
    image: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'loungewear',
    description: 'Ultra-soft modal lounge set for ultimate comfort.',
    tags: ['loungewear', 'comfort', 'soft', 'modal'],
    gender: 'women',
    productType: 'apparel',
    subCategory: 'underwear-lounge',
    brand: 'Comfort Zone',
    material: ['modal', 'spandex'],
    colors: ['blush', 'grey', 'white'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    priceRange: 'budget',
    season: 'all-season'
  },
  {
    id: '11',
    name: 'Gold Chain Necklace - Delicate Layer',
    price: 145,
    image: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'jewelry',
    description: 'Delicate 14k gold chain necklace, perfect for layering.',
    tags: ['necklace', 'gold', 'chain', 'delicate', 'layering'],
    gender: 'women',
    productType: 'accessories',
    subCategory: 'jewelry',
    brand: 'Golden Hour',
    material: ['gold'],
    colors: ['gold'],
    sizes: ['one size'],
    priceRange: 'mid',
    season: 'all-season'
  },
  {
    id: '12',
    name: 'Italian Leather Oxfords - Classic Craft',
    price: 285,
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'formal shoes',
    description: 'Classic Italian leather oxford shoes for the modern gentleman.',
    tags: ['oxford', 'leather', 'formal', 'Italian', 'classic'],
    gender: 'men',
    productType: 'footwear',
    subCategory: 'formal-shoes',
    brand: 'Milano Craft',
    material: ['leather'],
    colors: ['black', 'brown'],
    sizes: ['8', '9', '10', '11', '12'],
    priceRange: 'mid',
    season: 'all-season'
  },
  {
    id: '13',
    name: 'Minimalist Sunglasses - UV Protection',
    price: 125,
    image: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'sunglasses',
    description: 'Sleek minimalist sunglasses with premium UV protection.',
    tags: ['sunglasses', 'minimalist', 'UV protection', 'sleek'],
    gender: 'unisex',
    productType: 'accessories',
    subCategory: 'small-goods',
    brand: 'Clear Vision',
    material: ['acetate', 'metal'],
    colors: ['black', 'tortoise'],
    sizes: ['one size'],
    priceRange: 'mid',
    season: 'summer'
  },
  {
    id: '14',
    name: 'Suede Desert Boots - Heritage Style',
    price: 165,
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'casual shoes',
    description: 'Classic suede desert boots with heritage styling and crepe sole.',
    tags: ['desert boots', 'suede', 'casual', 'heritage', 'crepe sole'],
    gender: 'men',
    productType: 'footwear',
    subCategory: 'casual-shoes',
    brand: 'Heritage Walk',
    material: ['suede'],
    colors: ['tan', 'navy'],
    sizes: ['8', '9', '10', '11', '12'],
    priceRange: 'mid',
    season: 'fall'
  },
  {
    id: '15',
    name: 'Leather Slide Sandals - Summer Essential',
    price: 89,
    image: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'sandals',
    description: 'Premium leather slide sandals with cushioned footbed.',
    tags: ['sandals', 'leather', 'slides', 'summer', 'comfort'],
    gender: 'women',
    productType: 'footwear',
    subCategory: 'sandals-slides',
    brand: 'Summer Steps',
    material: ['leather'],
    colors: ['tan', 'black', 'white'],
    sizes: ['6', '7', '8', '9', '10'],
    priceRange: 'budget',
    season: 'summer'
  }
];

// Level 3 refinement filters
export const refinementFilters = {
  brands: Array.from(new Set(mockProducts.map(p => p.brand).filter(Boolean))),
  materials: Array.from(new Set(mockProducts.flatMap(p => p.material || []))),
  colors: Array.from(new Set(mockProducts.flatMap(p => p.colors || []))),
  priceRanges: ['budget', 'mid', 'premium', 'luxury'] as const,
  seasons: ['spring', 'summer', 'fall', 'winter', 'all-season'] as const
};

const initialRefinements: RefinementFilters = {
  brands: [],
  materials: [],
  colors: [],
  priceRanges: [],
  seasons: []
};

export function SearchProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeRefinements, setActiveRefinements] = useState<RefinementFilters>(initialRefinements);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        } else {
          console.error('Failed to fetch products:', response.statusText);
          // Fallback to mock products if API fails
          setProducts(mockProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock products if API fails
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  const updateRefinement = (category: keyof RefinementFilters, value: string, add: boolean) => {
    setActiveRefinements(prev => ({
      ...prev,
      [category]: add 
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };
  
  const clearAllRefinements = () => {
    setActiveRefinements(initialRefinements);
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const refreshProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
  };
  
  const filteredProducts = products.filter(product => {
    // Text search
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    // Level 1 & 2 category matching
    const matchesCategory = activeCategory === 'all' || 
      product.category === activeCategory ||
      product.gender === activeCategory ||
      product.productType === activeCategory ||
      product.subCategory === activeCategory ||
      // Handle transformed subcategory names
      (activeCategory.includes('-') && 
        product.subCategory?.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-') === activeCategory) ||
      // Handle special mappings
      (activeCategory === 'handbags' && product.subCategory === 'bags') ||
      (activeCategory === 'headwear' && product.subCategory === 'headwear');

    // Level 3 refinement filters
    const matchesBrand = activeRefinements.brands.length === 0 || 
      (product.brand && activeRefinements.brands.includes(product.brand));
      
    const matchesMaterial = activeRefinements.materials.length === 0 || 
      (product.material && product.material.some(m => activeRefinements.materials.includes(m)));
      
    const matchesColor = activeRefinements.colors.length === 0 || 
      (product.colors && product.colors.some(c => activeRefinements.colors.includes(c)));
      
    const matchesPriceRange = activeRefinements.priceRanges.length === 0 || 
      (product.priceRange && activeRefinements.priceRanges.includes(product.priceRange));
      
    const matchesSeason = activeRefinements.seasons.length === 0 || 
      (product.season && activeRefinements.seasons.includes(product.season));

    return matchesSearch && matchesCategory && matchesBrand && matchesMaterial && matchesColor && matchesPriceRange && matchesSeason;
  });

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      activeCategory,
      setActiveCategory,
      activeRefinements,
      setActiveRefinements,
      updateRefinement,
      clearAllRefinements,
      filteredProducts,
      allProducts: products,
      products: products, // Add products alias for compatibility
      isSearchOpen,
      setIsSearchOpen,
      addProduct,
      loading,
      refreshProducts
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}