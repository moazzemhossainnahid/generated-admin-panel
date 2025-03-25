'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Save, Trash2, Plus, X, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import VariationPanels from '@/components/print-options/VariationPanels';
import { PrintOptionGroup, Product } from '@/types/print-options';

interface PrintOptionFormProps {
  initialData?: PrintOptionGroup;
  onSubmit: (data: PrintOptionGroup) => void;
  onDelete?: () => void;
}

// Mock products data for demonstration
const mockProducts: Product[] = [
  { id: '101', name: 'Business Card Standard' },
  { id: '102', name: 'Business Card Premium' },
  { id: '201', name: 'Business Christmas Invitation Card' },
  { id: '301', name: 'Tri-fold Brochure' },
  { id: '302', name: 'Bi-fold Brochure' },
  { id: '401', name: 'Standard Flyers' },
  { id: '501', name: 'Premium Poster A2' },
  { id: '502', name: 'Premium Poster A3' },
];

const PrintOptionForm: React.FC<PrintOptionFormProps> = ({
  initialData,
  onSubmit,
  onDelete
}) => {
  const [formData, setFormData] = useState<PrintOptionGroup>(
    initialData || {
      id: crypto.randomUUID(),
      name: '',
      status: 'unpublished',
      assignedProducts: [],
      createdAt: new Date().toISOString(),
      variations: []
    }
  );
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (productSearch.trim() === '') {
      setSearchResults([]);
    } else {
      const results = mockProducts.filter(product =>
        product.name.toLowerCase().includes(productSearch.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [productSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked ? 'published' : 'unpublished'
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleProductSelect = (product: Product) => {
    // Check if product is already selected
    if (formData.assignedProducts.some(p => p.id === product.id)) {
      return;
    }

    setFormData({
      ...formData,
      assignedProducts: [...formData.assignedProducts, product]
    });
    
    // Clear search input and results
    setProductSearch('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleRemoveProduct = (productId: string) => {
    setFormData({
      ...formData,
      assignedProducts: formData.assignedProducts.filter(p => p.id !== productId)
    });
  };

  const handleVariationsUpdate = (variations: any[]) => {
    setFormData({
      ...formData,
      variations
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Print Option Group Name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would make an API call here
      // await fetch('/api/print-options', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onSubmit(formData);
      toast.success(`Print option group ${isEditMode ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error('Error saving print option group:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} print option group`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this print option group?');
    if (!confirmed) return;
    
    try {
      // In a real app, you would make an API call here
      // await fetch(`/api/print-options/${formData.id}`, {
      //   method: 'DELETE'
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onDelete();
      toast.success('Print option group deleted successfully');
    } catch (error) {
      console.error('Error deleting print option group:', error);
      toast.error('Failed to delete print option group');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="print-option-form">
      <div className="print-option-form__general-settings bg-white rounded-md border border-[#E4E7EB] mb-6 overflow-hidden">
        <div className="print-option-form__header bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4 flex justify-between items-center">
          <h2 className="text-[#2B4F60] text-lg font-semibold">General Settings</h2>
        </div>
        
        <div className="print-option-form__body p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="print-option-form__field">
              <label htmlFor="name" className="block text-sm font-medium text-[#49617E] mb-1">
                Print Option Group Name <span className="text-[#F85464]">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Business Cards Print Options"
                className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                required
              />
              <p className="text-xs text-[#6F8591] mt-1">
                This name is used for internal reference only.
              </p>
            </div>
            
            <div className="print-option-form__field">
              <label className="block text-sm font-medium text-[#49617E] mb-1">
                Status
              </label>
              <div className="flex items-center mt-1">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status === 'published'}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-[#E0E0E0] peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#007BF9] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#30BF89]"></div>
                  <span className="ml-2 text-sm text-[#49617E]">
                    {formData.status === 'published' ? 'Published' : 'Unpublished'}
                  </span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="print-option-form__field mt-6">
            <label className="block text-sm font-medium text-[#49617E] mb-1">
              Assign to Products
            </label>
            
            <div className="relative">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Search products by name..."
                className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
              />
              
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#E4E7EB] rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map(product => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="px-4 py-2 hover:bg-[#F5F5F5] cursor-pointer"
                    >
                      {product.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-2">
              {formData.assignedProducts.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.assignedProducts.map(product => (
                    <div
                      key={product.id}
                      className="inline-flex items-center bg-[#DCE8F8] text-[#10243E] px-2 py-1 rounded-md text-sm"
                    >
                      {product.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="ml-1 text-[#49617E] hover:text-[#F85464]"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6F8591]">No products assigned</p>
              )}
            </div>
            
            <p className="flex items-center text-xs text-[#6F8591] mt-2">
              <Info size={14} className="mr-1" />
              Search and select products to assign this print option group to them.
            </p>
          </div>
        </div>
      </div>
      
      <VariationPanels
        variations={formData.variations}
        onUpdate={handleVariationsUpdate}
      />
      
      <div className="print-option-form__actions flex justify-between mt-6">
        <div>
          {isEditMode && onDelete && (
            <Button
              type="button"
              variant="danger"
              leftIcon={<Trash2 size={16} />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            leftIcon={<Save size={16} />}
            isLoading={isSubmitting}
          >
            {isEditMode ? 'Update' : 'Save'} Print Option Group
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PrintOptionForm;