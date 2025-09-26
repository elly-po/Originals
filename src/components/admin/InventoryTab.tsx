import { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  MoreVertical, 
  AlertTriangle,
  CheckCircle,
  Archive,
  Eye,
  Edit
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  status?: 'active' | 'sold' | 'archived' | 'draft';
  inventory?: {
    total: number;
    bySize?: Record<string, number>;
  };
  category: string;
  subCategory?: string;
  brand?: string;
  soldAt?: string;
  featured?: boolean;
  views?: number;
  favoritesCount?: number;
  updatedAt: string;
}

interface InventoryTabProps {
  token: string | null;
}

function InventoryTab({ token }: InventoryTabProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSoldModal, setShowSoldModal] = useState<{ show: boolean; product: Product | null }>({
    show: false,
    product: null
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState<{ show: boolean; action: string }>({
    show: false,
    action: ''
  });

  // Fetch products from admin endpoint
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProducts();
    }
  }, [token]);

  // Filter products based on status and search
  useEffect(() => {
    let filtered = products;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, statusFilter, searchTerm]);

  const handleMarkAsSold = async (product: Product, action: 'archive' | 'keep') => {
    try {
      const response = await fetch(`/api/admin/products/${product.id}/sold`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        // Refresh products
        const updatedProducts = products.map(p =>
          p.id === product.id
            ? { 
                ...p, 
                status: action === 'archive' ? 'archived' as const : 'sold' as const,
                soldAt: new Date().toISOString(),
                inventory: { total: 0 }
              }
            : p
        );
        setProducts(updatedProducts);
        setShowSoldModal({ show: false, product: null });
      }
    } catch (error) {
      console.error('Error marking product as sold:', error);
    }
  };

  const handleUpdateStatus = async (productId: string, newStatus: 'active' | 'archived' | 'draft') => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedProducts = products.map(p =>
          p.id === productId ? { ...p, status: newStatus } : p
        );
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) return;

    try {
      for (const productId of selectedProducts) {
        if (action === 'activate') {
          await handleUpdateStatus(productId, 'active');
        } else if (action === 'archive') {
          await handleUpdateStatus(productId, 'archived');
        } else if (action === 'draft') {
          await handleUpdateStatus(productId, 'draft');
        }
      }
      setSelectedProducts([]);
      setShowBulkModal({ show: false, action: '' });
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
            <CheckCircle size={12} />
            Active
          </span>
        );
      case 'sold':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            <Package size={12} />
            Sold
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
            <Archive size={12} />
            Archived
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
            <Edit size={12} />
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
            <AlertTriangle size={12} />
            Unknown
          </span>
        );
    }
  };

  const getInventoryStatus = (inventory?: { total: number }) => {
    const total = inventory?.total || 0;
    if (total === 0) {
      return (
        <span className="text-red-600 font-medium">Out of Stock</span>
      );
    } else if (total <= 5) {
      return (
        <span className="text-yellow-600 font-medium">Low Stock ({total})</span>
      );
    } else {
      return (
        <span className="text-green-600 font-medium">In Stock ({total})</span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-oatmeal-500 mb-4" />
          <p className="font-sans-clean text-charcoal-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-serif text-2xl text-charcoal-800 text-distressed">Inventory Management</h2>
          <p className="font-sans-clean text-charcoal-600 mt-1">
            Manage product status, inventory levels, and sold-out items
          </p>
        </div>
      </div>

      {/* Filters and Bulk Actions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-charcoal-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="archived">Archived</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-4 flex items-center justify-between">
            <span className="font-sans-clean text-blue-800">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBulkModal({ show: true, action: 'activate' })}
                className="px-3 py-2 bg-green-600 text-white text-sm font-sans-clean hover:bg-green-700 transition-colors"
              >
                Activate
              </button>
              <button
                onClick={() => setShowBulkModal({ show: true, action: 'archive' })}
                className="px-3 py-2 bg-gray-600 text-white text-sm font-sans-clean hover:bg-gray-700 transition-colors"
              >
                Archive
              </button>
              <button
                onClick={() => setShowBulkModal({ show: true, action: 'draft' })}
                className="px-3 py-2 bg-yellow-600 text-white text-sm font-sans-clean hover:bg-yellow-700 transition-colors"
              >
                Set Draft
              </button>
              <button
                onClick={() => setSelectedProducts([])}
                className="px-3 py-2 bg-oatmeal-400 text-charcoal-700 text-sm font-sans-clean hover:bg-oatmeal-500 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-oatmeal-50 border border-oatmeal-300 overflow-hidden">
        <table className="min-w-full divide-y divide-oatmeal-300">
          <thead className="bg-oatmeal-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-700 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-oatmeal-600 focus:ring-oatmeal-500 border-oatmeal-400 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-700 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-700 uppercase tracking-wider">
                Inventory
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-700 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-700 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-charcoal-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-oatmeal-50 divide-y divide-oatmeal-300">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-oatmeal-100 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="h-4 w-4 text-oatmeal-600 focus:ring-oatmeal-500 border-oatmeal-400 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 object-cover border border-oatmeal-300"
                      src={product.image}
                      alt={product.name}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-charcoal-900 font-sans-clean">
                        {product.name}
                      </div>
                      <div className="text-sm text-charcoal-500 font-sans-clean">
                        {product.brand} • {product.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(product.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-sans-clean">
                  {getInventoryStatus(product.inventory)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-900 font-sans-clean">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-900 font-sans-clean">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {product.views || 0} views
                    </span>
                    <span className="text-xs text-charcoal-500">
                      {product.favoritesCount || 0} favorites
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {product.status === 'active' && (
                      <button
                        onClick={() => setShowSoldModal({ show: true, product })}
                        className="text-blue-600 hover:text-blue-800 font-sans-clean"
                      >
                        Mark Sold
                      </button>
                    )}
                    <div className="relative group">
                      <button className="text-charcoal-400 hover:text-charcoal-600">
                        <MoreVertical size={16} />
                      </button>
                      <div className="absolute right-0 mt-1 w-48 bg-white border border-oatmeal-300 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => handleUpdateStatus(product.id, 'active')}
                          disabled={product.status === 'active'}
                          className="block w-full text-left px-4 py-2 text-sm text-charcoal-700 hover:bg-oatmeal-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Set Active
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(product.id, 'archived')}
                          disabled={product.status === 'archived'}
                          className="block w-full text-left px-4 py-2 text-sm text-charcoal-700 hover:bg-oatmeal-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Archive
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(product.id, 'draft')}
                          disabled={product.status === 'draft'}
                          className="block w-full text-left px-4 py-2 text-sm text-charcoal-700 hover:bg-oatmeal-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Set Draft
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-oatmeal-400 mb-4" />
            <p className="font-sans-clean text-charcoal-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'No products match your filters' 
                : 'No products found'
              }
            </p>
          </div>
        )}
      </div>

      {/* Sold Modal */}
      {showSoldModal.show && showSoldModal.product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-oatmeal-100 border border-oatmeal-300 p-6 max-w-md w-full mx-4">
            <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">
              Mark Product as Sold
            </h3>
            <p className="font-sans-clean text-charcoal-600 mb-6">
              What would you like to do with "{showSoldModal.product.name}" after marking it as sold?
            </p>
            <div className="space-y-4">
              <button
                onClick={() => handleMarkAsSold(showSoldModal.product!, 'keep')}
                className="w-full bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-sans-clean font-medium py-3 px-4 transition-colors"
              >
                Keep Visible (Show as "Sold")
              </button>
              <button
                onClick={() => handleMarkAsSold(showSoldModal.product!, 'archive')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-sans-clean font-medium py-3 px-4 transition-colors"
              >
                Archive (Hide from Public)
              </button>
              <button
                onClick={() => setShowSoldModal({ show: false, product: null })}
                className="w-full bg-oatmeal-300 hover:bg-oatmeal-400 text-charcoal-700 font-sans-clean font-medium py-3 px-4 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Confirmation Modal */}
      {showBulkModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-oatmeal-100 border border-oatmeal-300 p-6 max-w-md w-full mx-4">
            <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">
              Confirm Bulk Action
            </h3>
            <p className="font-sans-clean text-charcoal-600 mb-6">
              Are you sure you want to {showBulkModal.action} {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''}?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleBulkAction(showBulkModal.action)}
                className="flex-1 bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-sans-clean font-medium py-3 px-4 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowBulkModal({ show: false, action: '' })}
                className="flex-1 bg-oatmeal-300 hover:bg-oatmeal-400 text-charcoal-700 font-sans-clean font-medium py-3 px-4 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryTab;