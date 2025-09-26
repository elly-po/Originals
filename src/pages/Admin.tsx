import { useState, useRef, DragEvent } from 'react';
import Layout from '../components/Layout';
import { Plus, Shield, X, Eye, EyeOff, LogOut, ImagePlus } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';

function Admin() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Product form state
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  // Removed unused fields sku and inventory for simplicity
  
  // Image upload state
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addProduct } = useSearch();

  // Admin authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple admin password check (in real app, this would be secure authentication)
    if (adminPassword === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid admin password');
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminPassword('');
    // Reset form
    resetForm();
  };
  
  const resetForm = () => {
    setProductName('');
    setProductPrice('');
    setProductDescription('');
    setSelectedGender('');
    setSelectedProductType('');
    setSelectedSubCategory('');
    setSelectedBrand('');
    setSelectedMaterials([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedPriceRange('');
    setSelectedSeason('');
    // Removed sku and inventory for simplicity
    setUploadedImages([]);
    setImagePreviews([]);
    setErrors({});
  };
  
  // Image handling
  const handleImageUpload = (files: FileList) => {
    const newFiles = Array.from(files).slice(0, 6 - uploadedImages.length); // Limit to 6 images total
    const newPreviews: string[] = [];
    
    newFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === newFiles.length) {
            setUploadedImages(prev => [...prev, ...newFiles]);
            setImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleImageUpload(e.dataTransfer.files);
    }
  };
  
  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!productName.trim()) newErrors.productName = 'Product name is required';
    if (!productPrice || parseFloat(productPrice) <= 0) newErrors.productPrice = 'Valid price is required';
    if (!selectedGender) newErrors.selectedGender = 'Gender selection is required';
    if (!selectedProductType) newErrors.selectedProductType = 'Product type is required';
    if (!selectedSubCategory) newErrors.selectedSubCategory = 'Sub-category is required';
    if (uploadedImages.length === 0) newErrors.images = 'At least one product image is required';
    if (selectedSizes.length === 0) newErrors.sizes = 'At least one size is required';
    if (selectedColors.length === 0) newErrors.colors = 'At least one color is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare form data for backend submission
      const formData = new FormData();
      
      // Add all form fields
      formData.append('name', productName);
      formData.append('price', productPrice);
      formData.append('description', productDescription || '');
      formData.append('category', selectedSubCategory);
      formData.append('subCategory', selectedSubCategory);
      formData.append('gender', selectedGender);
      formData.append('productType', selectedProductType);
      formData.append('brand', selectedBrand || '');
      formData.append('priceRange', selectedPriceRange || '');
      formData.append('season', selectedSeason || '');
      
      // Add arrays
      selectedMaterials.forEach(material => formData.append('materials', material));
      selectedColors.forEach(color => formData.append('colors', color));
      selectedSizes.forEach(size => formData.append('sizes', size));
      
      // Add admin password for authentication
      formData.append('adminPassword', adminPassword);
      
      // Add image files
      uploadedImages.forEach(file => {
        formData.append('images', file);
      });

      // Submit to backend API
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const result = await response.json();
      
      // Add to local context for immediate UI update
      addProduct(result.product);

      alert('Product added successfully and saved to database!');
      resetForm();
    } catch (error) {
      console.error('Error creating product:', error);
      alert(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Options for form fields
  const genderOptions = ['men', 'women', 'kids', 'unisex'];
  const productTypeOptions = ['apparel', 'footwear', 'accessories'];
  const subCategoryOptions = {
    apparel: ['outerwear', 'tops', 'bottoms', 'dresses', 'suits'],
    footwear: ['sneakers', 'boots', 'dress-shoes', 'sandals'],
    accessories: ['bags', 'jewelry', 'watches', 'hats', 'scarves']
  };
  const materialOptions = ['leather', 'cotton', 'wool', 'silk', 'denim', 'canvas', 'linen', 'cashmere'];
  const colorOptions = ['black', 'brown', 'cognac', 'navy', 'indigo', 'white', 'gray', 'beige', 'burgundy'];
  const sizeOptions = {
    apparel: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    footwear: ['6', '7', '8', '9', '10', '11', '12', '13'],
    accessories: ['OS', 'Small', 'Medium', 'Large']
  };
  const priceRangeOptions = ['budget', 'mid', 'premium', 'luxury'];
  const seasonOptions = ['spring', 'summer', 'fall', 'winter', 'all-season'];
  
  const currentSubCategories = selectedProductType ? subCategoryOptions[selectedProductType as keyof typeof subCategoryOptions] : [];
  const currentSizes = selectedProductType ? sizeOptions[selectedProductType as keyof typeof sizeOptions] : [];
  
  // Authentication screen
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative">
            <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
            
            <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-8 shadow-oatmeal">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-oatmeal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={28} className="text-oatmeal-100" />
                </div>
                <h1 className="font-serif text-2xl text-charcoal-800 text-distressed mb-2">
                  Admin Access Required
                </h1>
                <p className="font-sans-clean text-charcoal-600 text-sm">
                  Please enter admin credentials to access the product management system.
                </p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean"
                      placeholder="Enter admin password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-charcoal-500 hover:text-charcoal-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {authError && (
                    <p className="text-red-600 text-sm mt-1 font-sans-clean">{authError}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 font-serif font-semibold py-3 transition-all duration-300 shadow-oatmeal hover:shadow-charcoal transform hover:scale-[1.02]"
                >
                  Access Admin Panel
                </button>
              </form>
              
              <div className="mt-6 pt-4 border-t border-oatmeal-300">
                <p className="font-sans-clean text-xs text-charcoal-500 text-center">
                  Demo password: admin123
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          <div className="absolute inset-0 bg-texture-paper opacity-10"></div>
          
          <div className="relative bg-oatmeal-100 border border-oatmeal-300 p-8 shadow-oatmeal">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-serif text-4xl text-charcoal-800 text-distressed">
              Add New Original
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-oatmeal-300 hover:bg-oatmeal-400 text-charcoal-700 font-sans-clean font-medium px-4 py-2 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Enhanced Image Upload */}
            <div>
              <label className="block font-serif text-xl text-charcoal-800 text-distressed mb-4">
                Product Images *
              </label>
              
              {/* Image Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-oatmeal-600 bg-oatmeal-200/50'
                    : 'border-oatmeal-400 hover:border-oatmeal-600 bg-oatmeal-50/50'
                }`}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-texture-vintage opacity-5"></div>
                  <ImagePlus className="mx-auto h-16 w-16 text-oatmeal-600 mb-4" />
                  <p className="font-sans-clean text-charcoal-700 mb-2 font-medium">
                    {isDragging ? 'Drop images here' : 'Drag & drop images here, or click to select'}
                  </p>
                  <p className="font-sans-clean text-sm text-charcoal-500">
                    Support for JPG, PNG, WebP • Maximum 6 images • First image will be primary
                  </p>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                className="hidden"
              />
              
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <p className="font-sans-clean text-charcoal-700 text-sm mb-3">
                    {imagePreviews.length} image{imagePreviews.length !== 1 ? 's' : ''} selected
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full aspect-square object-cover border border-oatmeal-300"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-oatmeal-600 text-oatmeal-100 text-xs font-sans-clean px-2 py-1">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {errors.images && (
                <p className="text-red-600 text-sm mt-2 font-sans-clean">{errors.images}</p>
              )}
            </div>

            {/* Additional Product Details */}
            <div className="bg-oatmeal-50/50 p-6 border border-oatmeal-300 border-dashed">
              <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean"
                    placeholder="Enter brand name"
                  />
                </div>
                
                <div>
                  <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                    Price Range
                  </label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean"
                  >
                    <option value="">Select price range</option>
                    {priceRangeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                    Season
                  </label>
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean"
                  >
                    <option value="">Select season</option>
                    {seasonOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Materials */}
            <div className="bg-oatmeal-50/50 p-6 border border-oatmeal-300 border-dashed">
              <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">Materials</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {materialOptions.map((material) => (
                  <label key={material} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMaterials(prev => [...prev, material]);
                        } else {
                          setSelectedMaterials(prev => prev.filter(m => m !== material));
                        }
                      }}
                      className="text-oatmeal-600 focus:ring-oatmeal-500 border-oatmeal-400"
                    />
                    <span className="font-sans-clean text-charcoal-700 capitalize">{material}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Colors */}
            <div className="bg-oatmeal-50/50 p-6 border border-oatmeal-300 border-dashed">
              <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">Available Colors *</h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {colorOptions.map((color) => (
                  <label key={color} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedColors(prev => [...prev, color]);
                        } else {
                          setSelectedColors(prev => prev.filter(c => c !== color));
                        }
                      }}
                      className="text-oatmeal-600 focus:ring-oatmeal-500 border-oatmeal-400"
                    />
                    <span className="font-sans-clean text-charcoal-700 capitalize">{color.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
              {errors.colors && (
                <p className="text-red-600 text-sm mt-2 font-sans-clean">{errors.colors}</p>
              )}
            </div>
            
            {/* Sizes */}
            <div className="bg-oatmeal-50/50 p-6 border border-oatmeal-300 border-dashed">
              <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">Available Sizes *</h3>
              {selectedProductType ? (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {currentSizes.map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSizes(prev => [...prev, size]);
                          } else {
                            setSelectedSizes(prev => prev.filter(s => s !== size));
                          }
                        }}
                        className="text-oatmeal-600 focus:ring-oatmeal-500 border-oatmeal-400"
                      />
                      <span className="font-sans-clean text-charcoal-700">{size}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="font-sans-clean text-charcoal-500 italic">Please select a product type first</p>
              )}
              {errors.sizes && (
                <p className="text-red-600 text-sm mt-2 font-sans-clean">{errors.sizes}</p>
              )}
            </div>

            {/* Enhanced Product Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-serif text-xl text-charcoal-800 text-distressed mb-4">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean"
                  placeholder="Enter product name..."
                />
                {errors.productName && (
                  <p className="text-red-600 text-sm mt-2 font-sans-clean">{errors.productName}</p>
                )}
              </div>
              
              <div>
                <label className="block font-serif text-xl text-charcoal-800 text-distressed mb-4">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-600 font-sans-clean">
                    $
                  </span>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean"
                    placeholder="0.00"
                  />
                </div>
                {errors.productPrice && (
                  <p className="text-red-600 text-sm mt-2 font-sans-clean">{errors.productPrice}</p>
                )}
              </div>
            </div>
            
            {/* Categories */}
            <div className="bg-oatmeal-50/50 p-6 border border-oatmeal-300 border-dashed">
              <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">Product Categories *</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                    Gender *
                  </label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean"
                  >
                    <option value="">Select gender</option>
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.selectedGender && (
                    <p className="text-red-600 text-sm mt-1 font-sans-clean">{errors.selectedGender}</p>
                  )}
                </div>

                <div>
                  <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                    Product Type *
                  </label>
                  <select
                    value={selectedProductType}
                    onChange={(e) => {
                      setSelectedProductType(e.target.value);
                      setSelectedSubCategory(''); // Reset subcategory when type changes
                    }}
                    className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean"
                  >
                    <option value="">Select product type</option>
                    {productTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.selectedProductType && (
                    <p className="text-red-600 text-sm mt-1 font-sans-clean">{errors.selectedProductType}</p>
                  )}
                </div>

                <div>
                  <label className="block font-sans-clean text-charcoal-700 text-sm font-medium mb-2">
                    Sub-Category *
                  </label>
                  <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors font-sans-clean"
                    disabled={!selectedProductType}
                  >
                    <option value="">Select sub-category</option>
                    {currentSubCategories.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                  {errors.selectedSubCategory && (
                    <p className="text-red-600 text-sm mt-1 font-sans-clean">{errors.selectedSubCategory}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Product Story */}
            <div className="bg-oatmeal-50/50 p-6 border border-oatmeal-300 border-dashed">
              <h3 className="font-serif text-xl text-charcoal-800 text-distressed mb-4">Product Story</h3>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-oatmeal-400 bg-oatmeal-50 focus:border-oatmeal-600 focus:bg-oatmeal-25 focus:outline-none transition-colors resize-vertical font-sans-clean"
                placeholder="Tell the story of this original piece - its heritage, materials, and craftsmanship..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full relative overflow-hidden py-6 px-8 font-serif text-xl font-bold transition-all duration-300 border-2 bg-oatmeal-600 hover:bg-oatmeal-700 text-oatmeal-100 border-oatmeal-600 shadow-charcoal hover:shadow-charcoal-strong transform hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <div className="absolute inset-0 bg-texture-vintage opacity-20"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <Plus size={24} />
                  <span className="text-distressed">Add Original to Collection</span>
                </div>
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Admin;