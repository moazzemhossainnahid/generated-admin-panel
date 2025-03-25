'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { 
  Save, 
  Trash2, 
  X, 
  Calendar, 
  Clock, 
  Search, 
  Tag as TagIcon
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { FlashSaleFormData, FlashSaleProduct, Product, Tag } from '@/types/products';

interface FlashSaleFormProps {
  initialData?: FlashSaleFormData;
  onSubmit: (data: FlashSaleFormData) => void;
  onDelete?: () => void;
}

// Mock products data for demonstration
const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Christmas Gift Cards',
    slug: 'christmas-gift-cards',
    regularPrice: 100.00,
    featuredImage: '/images/christmas-card-1.jpg',
    categories: [{ id: 'cat-1', name: 'Invitation Card' }],
    tags: [{ id: 'tag-1', name: 'Christmas' }],
    collections: [],
    labels: [],
    status: 'published',
    isFeatured: false,
    createdAt: '2025-02-18T10:30:00Z',
    updatedAt: '2025-02-18T10:30:00Z'
  },
  {
    id: 'prod-2',
    name: 'New Year Greeting Cards',
    slug: 'new-year-greeting-cards',
    regularPrice: 120.00,
    featuredImage: '/images/new-year-card-1.jpg',
    categories: [{ id: 'cat-1', name: 'Invitation Card' }],
    tags: [{ id: 'tag-2', name: 'New Year' }],
    collections: [],
    labels: [],
    status: 'published',
    isFeatured: false,
    createdAt: '2025-02-18T11:30:00Z',
    updatedAt: '2025-02-18T11:30:00Z'
  }
];

// Mock tags for demonstration
const mockTags: Tag[] = [
  { id: 'tag-1', name: 'Cards' },
  { id: 'tag-2', name: 'Christmas' },
  { id: 'tag-3', name: 'Sale' },
  { id: 'tag-4', name: 'Holiday' },
];

const FlashSaleForm: React.FC<FlashSaleFormProps> = ({
  initialData,
  onSubmit,
  onDelete
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FlashSaleFormData>(
    initialData || {
      name: '',
      startDate: '',
      endDate: '',
      status: 'draft',
      visibility: 'public',
      products: [],
      isFeatured: false,
      tags: []
    }
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialData;

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs separately
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
      return;
    }
    
    // Handle regular inputs
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle product search
  const handleProductSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Filter mock products based on query
    const results = mockProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) && 
      !formData.products.some(p => p.id === product.id)
    );
    
    setSearchResults(results);
  };

  // Handle adding product to flash sale
  const handleAddProduct = (product: Product) => {
    const flashSaleProduct: FlashSaleProduct = {
      id: product.id,
      name: product.name,
      image: product.featuredImage,
      regularPrice: product.regularPrice,
      salePrice: product.regularPrice * 0.9, // Default 10% off
      offeredPrice: product.regularPrice * 0.9 // Default same as sale price
    };
    
    setFormData({
      ...formData,
      products: [...formData.products, flashSaleProduct]
    });
    
    // Clear search
    setSearchQuery('');
    setSearchResults([]);
  };

  // Handle removing product from flash sale
  const handleRemoveProduct = (productId: string) => {
    setFormData({
      ...formData,
      products: formData.products.filter(product => product.id !== productId)
    });
  };

  // Handle updating product sale price
  const handleUpdateProductPrice = (productId: string, field: 'salePrice' | 'offeredPrice', value: number) => {
    setFormData({
      ...formData,
      products: formData.products.map(product => 
        product.id === productId ? { ...product, [field]: value } : product
      )
    });
  };

  // Handle tag input
  const handleTagAdd = () => {
    if (tagInput.trim()) {
      // Check if tag already exists in mockTags
      let tag = mockTags.find(t => t.name.toLowerCase() === tagInput.trim().toLowerCase());
      
      // If not, create a new tag object
      if (!tag) {
        tag = { id: `tag-${Date.now()}`, name: tagInput.trim() };
      }
      
      // Add tag to formData if it's not already added
      if (!formData.tags?.some(t => t.id === tag?.id)) {
        setFormData({
          ...formData,
          tags: [...(formData.tags || []), tag]
        });
      }
      
      // Clear the input
      setTagInput('');
    }
  };

  // Handle tag removal
  const handleTagRemove = (tagId: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag.id !== tagId)
    });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent, exit: boolean = false) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Sale name is required');
      return;
    }
    
    if (!formData.startDate) {
      toast.error('Start date is required');
      return;
    }
    
    if (!formData.endDate) {
      toast.error('End date is required');
      return;
    }
    
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error('End date must be after start date');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would make an API call here
      // await fetch('/api/flash-sales', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onSubmit(formData);
      toast.success(`Flash sale ${isEditMode ? 'updated' : 'created'} successfully`);
      
      if (exit) {
        router.push('/admin/products/flash-sale');
      }
    } catch (error) {
      console.error('Error saving flash sale:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} flash sale`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this flash sale?');
    if (!confirmed) return;
    
    try {
      // In a real app, you would make an API call here
      // await fetch(`/api/flash-sales/${formData.id}`, {
      //   method: 'DELETE'
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onDelete();
      toast.success('Flash sale deleted successfully');
      router.push('/admin/products/flash-sale');
    } catch (error) {
      console.error('Error deleting flash sale:', error);
      toast.error('Failed to delete flash sale');
    }
  };

  return (
    <form className="flash-sale-form" onSubmit={(e) => handleSubmit(e, false)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Flash Sale Information */}
          <div className="flash-sale-form__basic-info bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Basic Information</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flash-sale-form__field">
                <label htmlFor="name" className="block text-sm font-medium text-[#49617E] mb-1">
                  Sale Title <span className="text-[#F85464]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter sale title here..."
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flash-sale-form__field">
                  <label htmlFor="startDate" className="block text-sm font-medium text-[#49617E] mb-1">
                    Start Time <span className="text-[#F85464]">*</span>
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" />
                    <input
                      type="datetime-local"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                      required
                    />
                  </div>
                </div>
                
                <div className="flash-sale-form__field">
                  <label htmlFor="endDate" className="block text-sm font-medium text-[#49617E] mb-1">
                    End Time <span className="text-[#F85464]">*</span>
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" />
                    <input
                      type="datetime-local"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div className="flash-sale-form__products bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Product Selection</h2>
            </div>
            
            <div className="p-6">
              <div className="flash-sale-form__field mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  />
                </div>
                
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#E4E7EB] rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleAddProduct(product)}
                        className="px-4 py-2 hover:bg-[#F5F5F5] cursor-pointer flex items-center"
                      >
                        <div className="w-8 h-8 bg-[#F5F5F5] rounded mr-2"></div>
                        <div>
                          <div className="text-sm">{product.name}</div>
                          <div className="text-xs text-[#6F8591]">${product.regularPrice.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flash-sale-form__selected-products">
                <h3 className="text-sm font-medium text-[#49617E] mb-2">Selected Products</h3>
                
                {formData.products && formData.products.length > 0 ? (
                  <div className="border border-[#E4E7EB] rounded-md overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#F8F9FA] border-b border-[#E4E7EB]">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-[#49617E]">Title</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-[#49617E]">Price($)</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-[#49617E]">Offered($)</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-[#49617E]">Sale Price($)</th>
                          <th className="px-4 py-2 text-center text-xs font-semibold text-[#49617E]">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.products.map((product) => (
                          <tr 
                            key={product.id} 
                            className="border-b border-[#E4E7EB] hover:bg-[#F8F9FA]"
                          >
                            <td className="px-4 py-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-[#F5F5F5] rounded mr-2"></div>
                                <div className="text-sm">{product.name}</div>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-right text-sm">
                              {product.regularPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={product.offeredPrice}
                                onChange={(e) => handleUpdateProductPrice(product.id, 'offeredPrice', parseFloat(e.target.value))}
                                className="w-20 px-2 py-1 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-right"
                                min="0"
                                step="0.01"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={product.salePrice}
                                onChange={(e) => handleUpdateProductPrice(product.id, 'salePrice', parseFloat(e.target.value))}
                                className="w-20 px-2 py-1 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-right"
                                min="0"
                                step="0.01"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveProduct(product.id)}
                                className="text-[#6F8591] hover:text-[#F85464] transition p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-[#F5F7FA] border border-dashed border-[#E4E7EB] rounded-md p-4 text-center">
                    <p className="text-sm text-[#6F8591]">No products selected</p>
                    <p className="text-xs text-[#6F8591] mt-1">Search and add products above</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          {/* Action Buttons Panel */}
          <div className="flash-sale-form__actions bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Actions</h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  leftIcon={<Save size={16} />}
                  isLoading={isSubmitting}
                  fullWidth
                >
                  Save
                </Button>
                
                <Button
                  type="button"
                  variant="primary"
                  leftIcon={<Save size={16} />}
                  onClick={(e) => handleSubmit(e, true)}
                  isLoading={isSubmitting}
                  fullWidth
                >
                  Save & Exit
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/products/flash-sale')}
                  fullWidth
                >
                  Exit
                </Button>
                
                {isEditMode && onDelete && (
                  <Button
                    type="button"
                    variant="danger"
                    leftIcon={<Trash2 size={16} />}
                    onClick={handleDelete}
                    fullWidth
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Status Panel */}
          <div className="flash-sale-form__status bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Status</h2>
            </div>
            
            <div className="p-6">
              <div className="flash-sale-form__field mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-[#49617E] mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Visibility Panel */}
          <div className="flash-sale-form__visibility bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Visibility</h2>
            </div>
            
            <div className="p-6">
              <div className="flash-sale-form__field mb-4">
                <label htmlFor="visibility" className="block text-sm font-medium text-[#49617E] mb-1">
                  Visibility
                </label>
                <select
                  id="visibility"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                >
                  <option value="public">Public</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tags Panel */}
          <div className="flash-sale-form__tags bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Tags</h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="relative flex-grow">
                  <TagIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                    placeholder="Enter tag here..."
                    className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="px-4 py-2 bg-[#007BF9] text-white rounded-r-md hover:bg-[#0063cc] transition-colors"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <div 
                    key={tag.id} 
                    className="inline-flex items-center bg-[#DCE8F8] text-[#007BF9] px-2 py-1 rounded-md text-sm"
                  >
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag.id)}
                      className="ml-1 text-[#49617E] hover:text-[#F85464]"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                {!formData.tags?.length && (
                  <p className="text-sm text-[#6F8591]">No tags added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flash-sale-form__featured bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Is Featured</h2>
            </div>
            
            <div className="p-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-[#E0E0E0] peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#007BF9] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#30BF89]"></div>
                <span className="ml-2 text-sm text-[#49617E]">
                  {formData.isFeatured ? 'Featured' : 'Not Featured'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default FlashSaleForm;