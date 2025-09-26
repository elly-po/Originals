import { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  tags: string[];
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  filteredProducts: Product[];
  allProducts: Product[];
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Enhanced mock data with search capabilities
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Vintage Leather Jacket - Original 1970s Design',
    price: 299,
    image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'outerwear',
    description: 'Authentic 1970s leather jacket with original hardware',
    tags: ['vintage', 'leather', 'jacket', 'outerwear', '1970s', 'authentic']
  },
  {
    id: '2',
    name: 'Classic Denim Jeans - Heritage Wash',
    price: 149,
    image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'denim',
    description: 'Heritage wash denim with classic straight cut',
    tags: ['denim', 'jeans', 'heritage', 'classic', 'vintage', 'blue']
  },
  {
    id: '3',
    name: 'Handcrafted Wool Sweater - Traditional Knit',
    price: 189,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'knitwear',
    description: 'Traditional hand-knitted wool sweater with authentic patterns',
    tags: ['wool', 'sweater', 'handcrafted', 'traditional', 'knit', 'warm']
  },
  {
    id: '4',
    name: 'Original Canvas Sneakers - 1960s Style',
    price: 89,
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'footwear',
    description: 'Authentic 1960s style canvas sneakers with original rubber sole',
    tags: ['sneakers', 'canvas', '1960s', 'vintage', 'footwear', 'casual']
  },
  {
    id: '5',
    name: 'Authentic Silk Scarf - Hand-printed Pattern',
    price: 79,
    image: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'accessories',
    description: 'Hand-printed silk scarf with traditional patterns and authentic craftsmanship',
    tags: ['silk', 'scarf', 'handprinted', 'accessories', 'pattern', 'luxury']
  },
  {
    id: '6',
    name: 'Vintage Leather Boots - Handmade Quality',
    price: 249,
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'footwear',
    description: 'Handmade vintage leather boots with authentic stitching and durable construction',
    tags: ['boots', 'leather', 'vintage', 'handmade', 'footwear', 'durable']
  },
];

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      activeCategory,
      setActiveCategory,
      filteredProducts,
      allProducts: mockProducts,
      isSearchOpen,
      setIsSearchOpen,
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