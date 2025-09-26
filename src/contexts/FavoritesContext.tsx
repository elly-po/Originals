import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE } from '../utils/api';

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  addedAt: Date;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: Omit<FavoriteItem, 'addedAt'>) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'originals-store-favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const { user, isAuthenticated, updateFavorites } = useAuth();

  // Load favorites when user authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // Load favorites from user's data (backend)
      loadFavoritesFromUser();
    } else {
      // Load favorites from localStorage for unauthenticated users
      loadFavoritesFromLocalStorage();
    }
  }, [isAuthenticated, user]);

  const loadFavoritesFromUser = async () => {
    if (!user?.favoriteProducts) return;
    
    try {
      // Fetch product details for each favorite product ID
      const favoriteDetails = await Promise.all(
        user.favoriteProducts.map(async (productId) => {
          const response = await fetch(`${API_BASE}/api/products/${productId}`);
          if (response.ok) {
            const data = await response.json();
            return {
              id: data.product.id,
              name: data.product.name,
              price: data.product.price,
              image: data.product.image,
              addedAt: new Date() // We don't have the exact date from backend
            };
          }
          return null;
        })
      );
      
      const validFavorites = favoriteDetails.filter(Boolean) as FavoriteItem[];
      setFavorites(validFavorites);
    } catch (error) {
      console.error('Error loading favorites from user data:', error);
    }
  };

  const loadFavoritesFromLocalStorage = () => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        // Convert addedAt strings back to Date objects
        const favoritesWithDates = parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        setFavorites(favoritesWithDates);
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  };

  // Save favorites to localStorage for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
    }
  }, [favorites, isAuthenticated]);

  const addToFavorites = async (item: Omit<FavoriteItem, 'addedAt'>) => {
    // Check if item is already in favorites
    if (favorites.some(fav => fav.id === item.id)) {
      return;
    }

    const newFavorite: FavoriteItem = {
      ...item,
      addedAt: new Date()
    };

    // Update local state immediately for responsive UI
    setFavorites(prev => [newFavorite, ...prev]);

    // If user is authenticated, update backend
    if (isAuthenticated) {
      try {
        await updateFavorites(item.id, 'add');
      } catch (error) {
        console.error('Error adding to favorites on backend:', error);
        // Revert local state on error
        setFavorites(prev => prev.filter(fav => fav.id !== item.id));
      }
    }
  };

  const removeFromFavorites = async (id: string) => {
    // Update local state immediately for responsive UI
    setFavorites(prev => prev.filter(item => item.id !== id));

    // If user is authenticated, update backend
    if (isAuthenticated) {
      try {
        await updateFavorites(id, 'remove');
      } catch (error) {
        console.error('Error removing from favorites on backend:', error);
        // Note: We don't revert the local state here as the user expects it to be removed
        // The backend will be synced on next load
      }
    }
  };

  const isFavorite = (id: string) => {
    return favorites.some(item => item.id === id);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      clearFavorites,
      favoritesCount: favorites.length,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}