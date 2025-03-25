'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { 
  Save, 
  Trash2, 
  X, 
  Info,
  FileImage,
  Link as LinkIcon,
  ChevronDown,
  Type
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { CategoryFormData, ProductCategory } from '@/types/products';

interface CategoryFormProps {
  initialData?: CategoryFormData;
  categories?: ProductCategory[];
  onSubmit: (data: CategoryFormData) => void;
  onDelete?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  categories = [],
  onSubmit,
  onDelete
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<CategoryFormData>(
    initialData || {
      name: '',
      slug: '',
      parentId: '',
      description: '',
      status: 'active',
      iconType: 'image',
      seo: {
        title: '',
        description: '',
        canonicalUrl: '',
        keywords: []
      }
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSeoFields, setShowSeoFields] = useState(false);
  const [seoKeyword, setSeoKeyword] = useState('');

  const isEditMode = !!initialData;

  // Filter out current category from parent options (to prevent circular reference)
  const parentOptions = categories.filter(category => category.id !== formData.id);

  // Generate slug from category name
  useEffect(() => {
    if (!isEditMode && formData.name && !formData.slug) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, isEditMode, formData.slug]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs separately
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked ? 'active' : 'inactive'
      });
      return;
    }
    
    // Handle regular inputs
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle rich text editor changes
  const handleRichTextChange = (value: string) => {
    setFormData({
      ...formData,
      description: value
    });
  };

  // Handle icon type change
  const handleIconTypeChange = (type: 'typography' | 'image') => {
    setFormData({
      ...formData,
      iconType: type,
      icon: '' // Reset icon when changing type
    });
  };

  // Handle typography icon change
  const handleTypographyIconChange = (icon: string) => {
    setFormData({
      ...formData,
      icon
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to your server or cloud storage
      // For now, simulate with URL.createObjectURL
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        image: imageUrl
      });
    }
  };

  // Handle icon image upload
  const handleIconImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to your server or cloud storage
      // For now, simulate with URL.createObjectURL
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        icon: imageUrl
      });
    }
  };

  // Handle SEO fields
  const handleSeoChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      seo: {
        ...formData.seo!,
        [field]: value
      }
    });
  };

  // Handle adding SEO keyword
  const handleAddKeyword = () => {
    if (seoKeyword.trim() && formData.seo?.keywords?.indexOf(seoKeyword.trim()) === -1) {
      setFormData({
        ...formData,
        seo: {
          ...formData.seo!,
          keywords: [...(formData.seo?.keywords || []), seoKeyword.trim()]
        }
      });
      setSeoKeyword('');
    }
  };

  // Handle removing SEO keyword
  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      seo: {
        ...formData.seo!,
        keywords: formData.seo?.keywords?.filter(k => k !== keyword) || []
      }
    });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent, exit: boolean = false) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    if (!formData.slug.trim()) {
      toast.error('Slug is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would make an API call here
      // await fetch('/api/categories', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onSubmit(formData);
      toast.success(`Category ${isEditMode ? 'updated' : 'created'} successfully`);
      
      if (exit) {
        router.push('/admin/products/categories');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} category`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this category?');
    if (!confirmed) return;
    
    try {
      // In a real app, you would make an API call here
      // await fetch(`/api/categories/${formData.id}`, {
      //   method: 'DELETE'
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onDelete();
      toast.success('Category deleted successfully');
      router.push('/admin/products/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  return (
    <form className="category-form" onSubmit={(e) => handleSubmit(e, false)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Category Information */}
          <div className="category-form__basic-info bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Basic Information</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="category-form__field">
                <label htmlFor="name" className="block text-sm font-medium text-[#49617E] mb-1">
                  Category Name <span className="text-[#F85464]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name here..."
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  required
                />
              </div>
              
              <div className="category-form__field">
                <label htmlFor="slug" className="block text-sm font-medium text-[#49617E] mb-1">
                  Slug <span className="text-[#F85464]">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 text-sm text-[#6F8591] bg-[#F5F5F5] border border-r-0 border-[#E4E7EB] rounded-l-md">
                    http://druckland.com/products/category/
                  </span>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="enter-slug-here"
                    className="flex-1 px-4 py-2 border border-[#E4E7EB] rounded-r-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                    required
                  />
                </div>
                {formData.slug && (
                  <div className="mt-1 text-xs text-[#007BF9]">
                    Preview: <a href="#" className="hover:underline">http://druckland.com/products/category/{formData.slug}</a>
                  </div>
                )}
              </div>
              
              <div className="category-form__field">
                <label htmlFor="parentId" className="block text-sm font-medium text-[#49617E] mb-1">
                  Parent Category
                </label>
                <select
                  id="parentId"
                  name="parentId"
                  value={formData.parentId || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                >
                  <option value="">None (Top Level Category)</option>
                  {parentOptions.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#6F8591] mt-1 flex items-center">
                  <Info size={12} className="mr-1" />
                  Optional. Select a parent if this is a subcategory.
                </p>
              </div>
              
              <div className="category-form__field">
                <label htmlFor="description" className="block text-sm font-medium text-[#49617E] mb-1">
                  Description
                </label>
                <div className="border border-[#E4E7EB] rounded-md overflow-hidden">
                  <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-3 py-2 flex justify-between items-center">
                    <div className="text-xs text-[#49617E] font-medium">
                      Rich Text Editor
                    </div>
                    <button 
                      type="button"
                      className="text-xs text-[#49617E] hover:text-[#007BF9]"
                    >
                      Add Media
                    </button>
                  </div>
                  <div className="bg-white p-2 border-b border-[#E4E7EB]">
                    <div className="flex items-center text-[#49617E] space-x-1 text-sm">
                      <button type="button" className="p-1 hover:bg-[#F5F5F5] rounded">B</button>
                      <button type="button" className="p-1 hover:bg-[#F5F5F5] rounded italic">I</button>
                      <button type="button" className="p-1 hover:bg-[#F5F5F5] rounded underline">U</button>
                      <span className="border-r border-[#E4E7EB] h-5 mx-1"></span>
                      <button type="button" className="p-1 hover:bg-[#F5F5F5] rounded">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                      </button>
                      <button type="button" className="p-1 hover:bg-[#F5F5F5] rounded">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    placeholder="Enter category description here..."
                    className="w-full px-4 py-3 border-0 focus:outline-none focus:ring-0"
                    rows={6}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Category Media & Icons */}
          <div className="category-form__media bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Category Media & Icons</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Category Image */}
              <div className="category-form__field">
                <label className="block text-sm font-medium text-[#49617E] mb-2">
                  Category Image
                </label>
                <div className="border border-dashed border-[#E4E7EB] rounded-md overflow-hidden">
                  {formData.image ? (
                    <div className="relative">
                      <Image
                        src={formData.image}
                        alt="Category Image"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, image: undefined})}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-[#F85464] hover:text-white transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 cursor-pointer bg-[#F5F7FA] hover:bg-[#F0F2F5] transition-colors">
                      <div className="text-center p-4">
                        <FileImage size={32} className="mx-auto mb-2 text-[#6F8591]" />
                        <p className="text-sm text-[#49617E]">Click to upload category image</p>
                        <p className="text-xs text-[#6F8591] mt-1">PNG, JPG or JPEG (max. 2MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-[#6F8591] mt-1 flex items-center">
                  <Info size={12} className="mr-1" />
                  This image will be used as the category banner on category pages
                </p>
              </div>

              {/* Icon Type Selection */}
              <div className="category-form__field">
                <label className="block text-sm font-medium text-[#49617E] mb-2">
                  Icon Type
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleIconTypeChange('typography')}
                    className={`px-4 py-2 rounded-md text-sm flex items-center ${
                      formData.iconType === 'typography'
                        ? 'bg-[#007BF9] text-white'
                        : 'bg-[#F5F7FA] text-[#49617E] hover:bg-[#DCE8F8]'
                    }`}
                  >
                    <Type size={16} className="mr-2" />
                    Typography Icons
                  </button>
                  <button
                    type="button"
                    onClick={() => handleIconTypeChange('image')}
                    className={`px-4 py-2 rounded-md text-sm flex items-center ${
                      formData.iconType === 'image'
                        ? 'bg-[#007BF9] text-white'
                        : 'bg-[#F5F7FA] text-[#49617E] hover:bg-[#DCE8F8]'
                    }`}
                  >
                    <FileImage size={16} className="mr-2" />
                    Image Icons
                  </button>
                </div>
              </div>
              
              {/* Typography Icon */}
              {formData.iconType === 'typography' && (
                <div className="category-form__field">
                  <label htmlFor="typographyIcon" className="block text-sm font-medium text-[#49617E] mb-2">
                    Typography Icon
                  </label>
                  <select
                    id="typographyIcon"
                    onChange={(e) => handleTypographyIconChange(e.target.value)}
                    value={formData.icon || ''}
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  >
                    <option value="">Select an icon</option>
                    <option value="lucide-shirt">Shirt (Clothing)</option>
                    <option value="lucide-smartphone">Smartphone (Electronics)</option>
                    <option value="lucide-utensils">Utensils (Kitchen)</option>
                    <option value="lucide-home">Home (Furniture)</option>
                    <option value="lucide-book">Book (Books)</option>
                    <option value="lucide-baby">Baby (Kids)</option>
                    <option value="lucide-dumbbell">Dumbbell (Sports)</option>
                    <option value="lucide-car">Car (Automotive)</option>
                    <option value="lucide-palette">Palette (Art)</option>
                    <option value="lucide-gem">Gem (Jewelry)</option>
                  </select>
                  {formData.icon && (
                    <div className="mt-4 bg-[#F5F7FA] p-4 rounded-md flex justify-center">
                      <div className="w-12 h-12 bg-[#007BF9] text-white rounded-full flex items-center justify-center">
                        <span className="text-xl">{formData.icon.split('-')[1]?.charAt(0)?.toUpperCase()}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Image Icon */}
              {formData.iconType === 'image' && (
                <div className="category-form__field">
                  <label className="block text-sm font-medium text-[#49617E] mb-2">
                    Icon Image
                  </label>
                  <div className="border border-dashed border-[#E4E7EB] rounded-md overflow-hidden">
                    {formData.icon ? (
                      <div className="relative">
                        <div className="w-full h-24 flex items-center justify-center p-4">
                          <div className="w-16 h-16 relative">
                            <Image
                              src={formData.icon}
                              alt="Icon Image"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, icon: undefined})}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-[#F85464] hover:text-white transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-24 cursor-pointer bg-[#F5F7FA] hover:bg-[#F0F2F5] transition-colors">
                        <div className="text-center p-4">
                          <FileImage size={24} className="mx-auto mb-1 text-[#6F8591]" />
                          <p className="text-sm text-[#49617E]">Click to upload icon</p>
                          <p className="text-xs text-[#6F8591]">PNG, SVG (max. 512KB)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleIconImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-[#6F8591] mt-1 flex items-center">
                    <Info size={12} className="mr-1" />
                    Small icon for category navigation (recommended size: 64x64px)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="category-form__seo bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4 flex justify-between items-center">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Search Engine Optimization</h2>
              <Button 
                type="button"
                size="sm" 
                variant="outline"
                onClick={() => setShowSeoFields(!showSeoFields)}
              >
                {showSeoFields ? 'Hide SEO fields' : 'Edit SEO meta'}
              </Button>
            </div>
            
            {showSeoFields && (
              <div className="p-6 space-y-4">
                <div className="category-form__field">
                  <label htmlFor="seoTitle" className="block text-sm font-medium text-[#49617E] mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    id="seoTitle"
                    value={formData.seo?.title || ''}
                    onChange={(e) => handleSeoChange('title', e.target.value)}
                    placeholder="Enter SEO title here..."
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  />
                  <p className="text-xs text-[#6F8591] mt-1 flex items-center">
                    <Info size={12} className="mr-1" />
                    If left empty, category name will be used as SEO title
                  </p>
                </div>
                
                <div className="category-form__field">
                  <label htmlFor="seoDescription" className="block text-sm font-medium text-[#49617E] mb-1">
                    Meta Description
                  </label>
                  <textarea
                    id="seoDescription"
                    value={formData.seo?.description || ''}
                    onChange={(e) => handleSeoChange('description', e.target.value)}
                    placeholder="Enter meta description here..."
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                    rows={3}
                  ></textarea>
                </div>
                
                <div className="category-form__field">
                  <label htmlFor="canonicalUrl" className="block text-sm font-medium text-[#49617E] mb-1">
                    Canonical URL
                  </label>
                  <div className="relative">
                    <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" />
                    <input
                      type="text"
                      id="canonicalUrl"
                      value={formData.seo?.canonicalUrl || ''}
                      onChange={(e) => handleSeoChange('canonicalUrl', e.target.value)}
                      placeholder="https://example.com/canonical-url"
                      className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                    />
                  </div>
                  <p className="text-xs text-[#6F8591] mt-1 flex items-center">
                    <Info size={12} className="mr-1" />
                    Only needed if this content exists on another URL to prevent duplicate content issues
                  </p>
                </div>
                
                <div className="category-form__field">
                  <label htmlFor="seoKeywords" className="block text-sm font-medium text-[#49617E] mb-1">
                    SEO Keywords
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="seoKeywords"
                      value={seoKeyword}
                      onChange={(e) => setSeoKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                      placeholder="Enter keywords and press Enter"
                      className="flex-1 px-4 py-2 border border-[#E4E7EB] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      className="px-4 py-2 bg-[#007BF9] text-white rounded-r-md hover:bg-[#0063cc] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.seo?.keywords?.map((keyword, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-[#DCE8F8] text-[#007BF9] px-2 py-1 rounded-md text-sm"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(keyword)}
                          className="ml-1 text-[#49617E] hover:text-[#F85464]"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {(!formData.seo?.keywords || formData.seo.keywords.length === 0) && (
                      <p className="text-sm text-[#6F8591]">No keywords added yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          {/* Action Buttons Panel */}
          <div className="category-form__actions bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
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
                  onClick={() => router.push('/admin/products/categories')}
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
          <div className="category-form__status bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Status</h2>
            </div>
            
            <div className="p-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status === 'active'}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-[#E0E0E0] peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#007BF9] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#30BF89]"></div>
                <span className="ml-2 text-sm text-[#49617E]">
                  {formData.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </label>
              <p className="text-xs text-[#6F8591] mt-2">
                Inactive categories won't be visible on the frontend
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;