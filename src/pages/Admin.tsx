import { useState } from 'react';
import Layout from '../components/Layout';
import { Upload, Plus } from 'lucide-react';

function Admin() {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const genderOptions = ['Men', 'Women', 'Unisex'];
  const ageOptions = ['Adults', 'Kids', 'Baby'];
  const typeOptions = ['Apparel', 'Footwear', 'Accessories'];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border-2 border-stone-200 p-8">
          <h1 className="text-3xl font-serif text-stone-800 mb-8">
            Add New Original
          </h1>

          <form className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-lg font-medium text-stone-800 mb-3">
                Product Images
              </label>
              <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center hover:border-amber-600 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-stone-400 mb-4" />
                <p className="text-stone-600 mb-2">
                  Drag & drop images here, or click to select
                </p>
                <p className="text-sm text-stone-500">
                  Support for multiple images (JPG, PNG, WebP)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-lg font-medium text-stone-800 mb-3">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-stone-300 focus:border-amber-600 focus:outline-none transition-colors"
                placeholder="Enter product name..."
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-lg font-medium text-stone-800 mb-3">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-600">
                  $
                </span>
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border-2 border-stone-300 focus:border-amber-600 focus:outline-none transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-medium text-stone-800 mb-3">
                  Gender
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-stone-300 focus:border-amber-600 focus:outline-none transition-colors"
                >
                  <option value="">Select gender</option>
                  {genderOptions.map((option) => (
                    <option key={option} value={option.toLowerCase()}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-stone-800 mb-3">
                  Age Group
                </label>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-stone-300 focus:border-amber-600 focus:outline-none transition-colors"
                >
                  <option value="">Select age group</option>
                  {ageOptions.map((option) => (
                    <option key={option} value={option.toLowerCase()}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-stone-800 mb-3">
                  Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-stone-300 focus:border-amber-600 focus:outline-none transition-colors"
                >
                  <option value="">Select type</option>
                  {typeOptions.map((option) => (
                    <option key={option} value={option.toLowerCase()}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-medium text-stone-800 mb-3">
                Product Story
              </label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border-2 border-stone-300 focus:border-amber-600 focus:outline-none transition-colors resize-none"
                placeholder="Tell the story of this original piece - its heritage, materials, and craftsmanship..."
              />
            </div>

            {/* Inventory Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-stone-800 mb-3">
                  SKU
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-stone-300 focus:border-amber-600 focus:outline-none transition-colors"
                  placeholder="Product SKU"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-stone-800 mb-3">
                  Inventory Count
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border-2 border-stone-300 focus:border-amber-600 focus:outline-none transition-colors"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-amber-600 text-stone-800 font-semibold py-4 px-8 hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Original to Store
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Admin;