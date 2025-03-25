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
  Link as LinkIcon
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { CollectionFormData } from '@/types/products';

interface CollectionFormProps {
  initialData?: CollectionFormData;
  onSubmit: (data: CollectionFormData) => void;
  onDelete?: () => void;
}

const CollectionForm: React.FC<CollectionFormProps> = ({
  initialData,
  onSubmit,
  onDelete
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<CollectionFormData>(
    initialData || {
      name: '',
      slug: '',
      description: '',
      status: 'active',
      isFeatured: false,
      products: [],
      seo: {
        title: '',
        description: '',
        keywords: [],
        internalLink: '',
        externalLink: ''
      }
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSeoFields, setShowSeoFields] = useState(false);

  const isEditMode = !!initialData;

  // Generate slug from collection name
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

  // Handle rich text editor changes
  const handleRichTextChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Handle feature image upload
  const handleFeatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to your server or cloud storage
      // and get back a URL to store in the formData
      
      // For now, simulate with URL.createObjectURL
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        featuredImage: imageUrl
      });
    }
  };

  // Handle SEO fields
  const handleSeoChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      seo: {
        ...formData.seo,
        [field]: value
      }
    });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent, exit: boolean = false) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Collection title is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would make an API call here
      // await fetch('/api/collections', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onSubmit(formData);
      toast.success(`Collection ${isEditMode ? 'updated' : 'created'} successfully`);
      
      if (exit) {
        router.push('/admin/products/collection');
      }
    } catch (error) {
      console.error('Error saving collection:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} collection`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this collection?');
    if (!confirmed) return;
    
    try {
      // In a real app, you would make an API call here
      // await fetch(`/api/collections/${formData.id}`, {
      //   method: 'DELETE'
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onDelete();
      toast.success('Collection deleted successfully');
      router.push('/admin/products/collection');
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  return (
    <form className="collection-form" onSubmit={(e) => handleSubmit(e, false)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Collection Information */}
          <div className="collection-form__basic-info bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Basic Information</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="collection-form__field">
                <label htmlFor="name" className="block text-sm font-medium text-[#49617E] mb-1">
                  Collection Name <span className="text-[#F85464]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter collection name here..."
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  required
                />
              </div>
              
              <div className="collection-form__field">
                <label htmlFor="slug" className="block text-sm font-medium text-[#49617E] mb-1">
                  Slug <span className="text-[#F85464]">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 text-sm text-[#6F8591] bg-[#F5F5F5] border border-r-0 border-[#E4E7EB] rounded-l-md">
                    http://druckland.com/products/collection/
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
                    Preview: <a href="#" className="hover:underline">http://druckland.com/products/collection/{formData.slug}</a>
                  </div>
                )}
              </div>
              
              <div className="collection-form__field">
                <label htmlFor="description" className="block text-sm font-medium text-[#49617E] mb-1">
                  Description
                </label>
                <div className="border border-[#E4E7EB] rounded-md overflow-hidden">
                  <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-3 py-2 flex justify-between items-center">
                    <div className="text-xs text-[#49617E] font-medium">
                      Simple/Rich Editor
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
                      <button type="button" className="p-1 hover:bg-[#F5F5F5] rounded">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button type="button" className="p-1 hover:bg-[#F5F5F5] rounded">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                      <span className="border-r border-[#E4E7EB] h-5 mx-1"></span>
                      <select className="text-xs bg-transparent px-1 py-0.5 border border-transparent hover:border-[#E4E7EB] rounded">
                        <option>Normal text</option>
                      </select>
                      <span className="border-r border-[#E4E7EB] h-5 mx-1"></span>
                      <button type="button" className="p-1 hover:bg-[#F5F5F5] rounded">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
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
                      <button type="button" className="p-1 hover:bg-[#F5F5F5] rounded font-bold">B</button>
                      <button type="button" className="p-1 hover:bg-[#F5F5F5] rounded italic">I</button>
                      <button type="button" className="p-1 hover:bg-[#F5F5F5] rounded underline">U</button>
                      <button type="button" className="p-1 hover:bg-[#F5F5F5] rounded line-through">S</button>
                      <span className="border-r border-[#E4E7EB] h-5 mx-1"></span>
                      <button type="button" className="p-1 hover:bg-[#F5F5F5] rounded">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    placeholder="Enter collection description here..."
                    className="w-full px-4 py-3 border-0 focus:outline-none focus:ring-0"
                    rows={6}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="collection-form__seo bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
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
                <div className="collection-form__field">
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
                </div>
                
                <div className="collection-form__field">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="collection-form__field">
                    <label htmlFor="internalLink" className="block text-sm font-medium text-[#49617E] mb-1">
                      Internal Link
                    </label>
                    <div className="relative">
                      <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" />
                      <input
                        type="text"
                        id="internalLink"
                        value={formData.seo?.internalLink || ''}
                        onChange={(e) => handleSeoChange('internalLink', e.target.value)}
                        placeholder="Internal link..."
                        className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                      />
                    </div>
                  </div>
                  
                  <div className="collection-form__field">
                    <label htmlFor="externalLink" className="block text-sm font-medium text-[#49617E] mb-1">
                      External Link
                    </label>
                    <div className="relative">
                      <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" />
                      <input
                        type="text"
                        id="externalLink"
                        value={formData.seo?.externalLink || ''}
                        onChange={(e) => handleSeoChange('externalLink', e.target.value)}
                        placeholder="https://example.com"
                        className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          {/* Action Buttons Panel */}
          <div className="collection-form__actions bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
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
                  onClick={() => router.push('/admin/products/collection')}
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
          <div className="collection-form__status bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Status</h2>
            </div>
            
            <div className="p-6">
              <div className="collection-form__field mb-4">
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="collection-form__featured bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
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

          {/* Feature Image Panel */}
          <div className="collection-form__image bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Feature Image</h2>
            </div>
            
            <div className="p-6">
              <div className="collection-form__field">
                <div className="border border-dashed border-[#E4E7EB] rounded-md overflow-hidden">
                  {formData.featuredImage ? (
                    <div className="relative">
                      <Image
                        src={formData.featuredImage}
                        alt="Feature Image"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, featuredImage: undefined})}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-[#F85464] hover:text-white transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 cursor-pointer bg-[#F5F7FA] hover:bg-[#F0F2F5] transition-colors">
                      <div className="text-center p-4">
                        <FileImage size={32} className="mx-auto mb-2 text-[#6F8591]" />
                        <p className="text-sm text-[#49617E]">Click to upload</p>
                        <p className="text-xs text-[#6F8591] mt-1">PNG, JPG or JPEG (max. 2MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFeatureImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CollectionForm;