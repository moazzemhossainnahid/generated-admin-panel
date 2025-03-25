'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { 
  Save, 
  Trash2, 
  Plus, 
  X, 
  Info, 
  ExternalLink,
  Clock,
  DollarSign,
  Calendar,
  Link as LinkIcon,
  FileText,
//   Tag,
  Search,
  Edit2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { 
  ProductFormData, 
  Category, 
  Tag, 
  Collection, 
  Label, 
  FAQ 
} from '@/types/products';

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  onDelete?: () => void;
}

// Mock data for demonstration
const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Invitation cards' },
  { id: 'cat-2', name: 'Christmas Cards' },
  { id: 'cat-3', name: 'Birthday Invitations(Adults)' },
  { id: 'cat-4', name: 'Children\'s Birthday Invitations' },
  { id: 'cat-5', name: 'Birth Cards' },
  { id: 'cat-6', name: 'Wedding Invitations' },
  { id: 'cat-7', name: 'Wedding Extras' },
  { id: 'cat-8', name: 'Wedding Decoration' },
  { id: 'cat-9', name: 'Wedding Table' },
  { id: 'cat-10', name: 'Condolence Cards' },
  { id: 'cat-11', name: 'Baptism Cards' },
  { id: 'cat-12', name: 'Confirmation Cards' },
  { id: 'cat-13', name: 'School Enrollment Cards' },
  { id: 'cat-14', name: 'Communion Cards' },
  { id: 'cat-15', name: 'Mother\'s day and Father\'s Day' },
  { id: 'cat-16', name: 'Others' },
];

const mockCollections: Collection[] = [
  { id: 'col-1', name: 'New Arrival' },
  { id: 'col-2', name: 'Best Sellers' },
  { id: 'col-3', name: 'Special Offer' },
];

const mockTags: Tag[] = [
  { id: 'tag-1', name: 'Cards' },
  { id: 'tag-2', name: 'Prints' },
  { id: 'tag-3', name: 'Corporate' },
  { id: 'tag-4', name: 'Celebration' },
];

const mockLabels: Label[] = [
  { id: 'label-1', name: 'New', type: 'new' },
  { id: 'label-2', name: 'Sale', type: 'sale' },
  { id: 'label-3', name: 'Hot', type: 'hot' },
];

const mockTaxOptions = [
  { id: 'tax-1', name: 'Tax 1' },
  { id: 'tax-2', name: 'Tax 2' },
  { id: 'tax-3', name: 'Tax 3' },
];

const mockProducts = [
  { 
    id: 'prod-1', 
    name: 'Invitation Cards', 
    image: '/path-to-image-1.jpg',
    price: 99.50,
    regularPrice: 120.00
  },
  { 
    id: 'prod-2', 
    name: 'Invitation Cards', 
    image: '/path-to-image-2.jpg',
    price: 89.50,
    regularPrice: 110.00
  },
  { 
    id: 'prod-3', 
    name: 'Invitation Cards', 
    image: '/path-to-image-3.jpg',
    price: 69.50,
    regularPrice: 100.00
  },
];

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onDelete
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      regularPrice: 0,
      salePrice: undefined,
      saleStartDate: undefined,
      saleEndDate: undefined,
      featuredImage: undefined,
      galleryImages: [],
      categories: [],
      tags: [],
      collections: [],
      labels: [],
      status: 'draft',
      isFeatured: false,
      tax: undefined,
      faqs: [],
      relatedProducts: [],
      seo: {
        title: '',
        description: '',
        keywords: [],
        internalLink: '',
        externalLink: ''
      }
    }
  );
  const [tagInput, setTagInput] = useState('');
  const [showSaleSchedule, setShowSaleSchedule] = useState(!!formData.saleStartDate || !!formData.saleEndDate);
  const [searchProducts, setSearchProducts] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSeoFields, setShowSeoFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialData;

  // Generate slug from product name
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
    
    // Handle numeric inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
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

  // Handle gallery image upload
  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, you would upload the files to your server or cloud storage
      
      // For now, simulate with URL.createObjectURL for each file
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData({
        ...formData,
        galleryImages: [...(formData.galleryImages || []), ...newImages]
      });
    }
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      const category = mockCategories.find(cat => cat.id === categoryId);
      if (category) {
        setFormData({
          ...formData,
          categories: [...formData.categories, category]
        });
      }
    } else {
      setFormData({
        ...formData,
        categories: formData.categories.filter(cat => cat.id !== categoryId)
      });
    }
  };

  // Handle collection selection
  const handleCollectionChange = (collectionId: string, checked: boolean) => {
    if (checked) {
      const collection = mockCollections.find(col => col.id === collectionId);
      if (collection) {
        setFormData({
          ...formData,
          collections: [...formData.collections, collection]
        });
      }
    } else {
      setFormData({
        ...formData,
        collections: formData.collections.filter(col => col.id !== collectionId)
      });
    }
  };

  // Handle label selection
  const handleLabelChange = (labelId: string, checked: boolean) => {
    if (checked) {
      const label = mockLabels.find(lbl => lbl.id === labelId);
      if (label) {
        setFormData({
          ...formData,
          labels: [...formData.labels, label]
        });
      }
    } else {
      setFormData({
        ...formData,
        collections: formData.labels.filter(lbl => lbl.id !== labelId)
      });
    }
  };

  // Handle tax selection
  const handleTaxChange = (taxId: string) => {
    setFormData({
      ...formData,
      tax: taxId
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
      if (!formData.tags.some(t => t.id === tag?.id)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tag]
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
      tags: formData.tags.filter(tag => tag.id !== tagId)
    });
  };

  // Handle FAQ fields
  const handleAddFaq = () => {
    const newFaq: FAQ = {
      id: `faq-${Date.now()}`,
      question: '',
      answer: ''
    };
    
    setFormData({
      ...formData,
      faqs: [...(formData.faqs || []), newFaq]
    });
  };

  const handleFaqChange = (faqId: string, field: 'question' | 'answer', value: string) => {
    setFormData({
      ...formData,
      faqs: formData.faqs?.map(faq => 
        faq.id === faqId ? { ...faq, [field]: value } : faq
      )
    });
  };

  const handleRemoveFaq = (faqId: string) => {
    setFormData({
      ...formData,
      faqs: formData.faqs?.filter(faq => faq.id !== faqId)
    });
  };

  // Handle related products search
  const handleProductSearch = (query: string) => {
    setSearchProducts(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Filter mock products based on query
    const results = mockProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) && 
      !formData.relatedProducts?.some(rp => rp.id === product.id)
    );
    
    setSearchResults(results);
  };

  // Handle adding related product
  const handleAddRelatedProduct = (product: any) => {
    setFormData({
      ...formData,
      relatedProducts: [...(formData.relatedProducts || []), product]
    });
    
    // Clear search results
    setSearchProducts('');
    setSearchResults([]);
  };

  // Handle removing related product
  const handleRemoveRelatedProduct = (productId: string) => {
    setFormData({
      ...formData,
      relatedProducts: formData.relatedProducts?.filter(product => product.id !== productId)
    });
  };

  // Handle gallery image removal
  const handleRemoveGalleryImage = (index: number) => {
    const updatedImages = [...(formData.galleryImages || [])];
    updatedImages.splice(index, 1);
    
    setFormData({
      ...formData,
      galleryImages: updatedImages
    });
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
      toast.error('Product title is required');
      return;
    }
    
    if (!formData.regularPrice || formData.regularPrice <= 0) {
      toast.error('Regular price must be greater than zero');
      return;
    }
    
    if (!formData.featuredImage) {
      toast.error('Feature image is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would make an API call here
      // await fetch('/api/products', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onSubmit(formData);
      toast.success(`Product ${isEditMode ? 'updated' : 'created'} successfully`);
      
      if (exit) {
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} product`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;
    
    try {
      // In a real app, you would make an API call here
      // await fetch(`/api/products/${formData.id}`, {
      //   method: 'DELETE'
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onDelete();
      toast.success('Product deleted successfully');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  return (
    <form className="product-form" onSubmit={(e) => handleSubmit(e, false)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Product Information */}
          <div className="product-form__basic-info bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Basic Product Information</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="product-form__field">
                <label htmlFor="name" className="block text-sm font-medium text-[#49617E] mb-1">
                  Product Title <span className="text-[#F85464]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product title here..."
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  required
                />
              </div>
              
              <div className="product-form__field">
                <label htmlFor="slug" className="block text-sm font-medium text-[#49617E] mb-1">
                  Permalink <span className="text-[#F85464]">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 text-sm text-[#6F8591] bg-[#F5F5F5] border border-r-0 border-[#E4E7EB] rounded-l-md">
                    http://druckland.com/products/
                  </span>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="enter-permalink-here"
                    className="flex-1 px-4 py-2 border border-[#E4E7EB] rounded-r-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                    required
                  />
                </div>
                {formData.slug && (
                  <div className="mt-1 text-xs text-[#007BF9]">
                    Preview: <a href="#" className="hover:underline">http://druckland.com/products/{formData.slug}</a>
                  </div>
                )}
              </div>
              
              <div className="product-form__field">
                <label htmlFor="shortDescription" className="block text-sm font-medium text-[#49617E] mb-1">
                  Short Description
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
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription || ''}
                    onChange={handleInputChange}
                    placeholder="Enter product title here..."
                    className="w-full px-4 py-3 border-0 focus:outline-none focus:ring-0"
                    rows={4}
                  ></textarea>
                </div>
              </div>
              
              <div className="product-form__field">
                <label htmlFor="description" className="block text-sm font-medium text-[#49617E] mb-1">
                  Detailed Description
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
                    placeholder="Enter product description here..."
                    className="w-full px-4 py-3 border-0 focus:outline-none focus:ring-0"
                    rows={8}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Product Pricing */}
          <div className="product-form__pricing bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Product Pricing</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="product-form__field">
                  <label htmlFor="regularPrice" className="block text-sm font-medium text-[#49617E] mb-1">
                    Regular Price <span className="text-[#F85464]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]">
                      <DollarSign size={16} />
                    </span>
                    <input
                      type="number"
                      id="regularPrice"
                      name="regularPrice"
                      value={formData.regularPrice || ''}
                      onChange={handleInputChange}
                      placeholder="Enter product price here..."
                      className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div className="product-form__field">
                  <label htmlFor="salePrice" className="block text-sm font-medium text-[#49617E] mb-1">
                    Sale Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]">
                      <DollarSign size={16} />
                    </span>
                    <input
                      type="number"
                      id="salePrice"
                      name="salePrice"
                      value={formData.salePrice || ''}
                      onChange={handleInputChange}
                      placeholder="Enter sale price here..."
                      className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowSaleSchedule(!showSaleSchedule)}
                  className="text-sm text-[#007BF9] hover:underline flex items-center"
                >
                  <Clock size={16} className="mr-1" />
                  {showSaleSchedule ? 'Hide' : 'Schedule'} sale price
                </button>
                
                {showSaleSchedule && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="product-form__field">
                      <label htmlFor="saleStartDate" className="block text-sm font-medium text-[#49617E] mb-1">
                        Sale Start Date
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]">
                          <Calendar size={16} />
                        </span>
                        <input
                          type="datetime-local"
                          id="saleStartDate"
                          name="saleStartDate"
                          value={formData.saleStartDate || ''}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                        />
                      </div>
                    </div>
                    
                    <div className="product-form__field">
                      <label htmlFor="saleEndDate" className="block text-sm font-medium text-[#49617E] mb-1">
                        Sale End Date
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]">
                          <Calendar size={16} />
                        </span>
                        <input
                          type="datetime-local"
                          id="saleEndDate"
                          name="saleEndDate"
                          value={formData.saleEndDate || ''}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="product-form__images bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Product Images</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="product-form__field">
                  <label className="block text-sm font-medium text-[#49617E] mb-2">
                    Feature Image <span className="text-[#F85464]">*</span>
                  </label>
                  
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
                          <Plus size={32} className="mx-auto mb-2 text-[#6F8591]" />
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
                  <button
                    type="button"
                    onClick={() => document.getElementById('feature-image-upload')?.click()}
                    className="mt-2 px-4 py-1 bg-[#F5F7FA] border border-[#E4E7EB] rounded text-xs text-[#49617E] hover:bg-[#E4E7EB] transition-colors"
                  >
                    Reset
                  </button>
                  <input
                    id="feature-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFeatureImageUpload}
                    className="hidden"
                  />
                </div>
                
                <div className="product-form__field">
                  <label className="block text-sm font-medium text-[#49617E] mb-2">
                    Gallery Images
                  </label>
                  
                  <div className="border border-dashed border-[#E4E7EB] rounded-md p-4">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {formData.galleryImages && formData.galleryImages.length > 0 ? (
                        formData.galleryImages.map((image, index) => (
                          <div key={index} className="relative h-20">
                            <Image
                              src={image}
                              alt={`Gallery Image ${index + 1}`}
                              width={100}
                              height={80}
                              className="w-full h-full object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(index)}
                              className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-md hover:bg-[#F85464] hover:text-white transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center p-4">
                          <p className="text-xs text-[#6F8591]">No gallery images uploaded</p>
                        </div>
                      )}
                    </div>
                    
                    <label className="flex flex-col items-center justify-center p-4 cursor-pointer bg-[#F5F7FA] hover:bg-[#F0F2F5] transition-colors rounded">
                      <div className="text-center">
                        <Plus size={24} className="mx-auto mb-2 text-[#6F8591]" />
                        <p className="text-xs text-[#49617E]">Add gallery images</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="product-form__related-products bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4 flex justify-between items-center">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Related Products</h2>
            </div>
            
            <div className="p-6">
              <div className="product-form__field mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" size={18} />
                  <input
                    type="text"
                    value={searchProducts}
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
                        onClick={() => handleAddRelatedProduct(product)}
                        className="px-4 py-2 hover:bg-[#F5F5F5] cursor-pointer flex items-center"
                      >
                        <div className="w-8 h-8 bg-[#F5F5F5] rounded mr-2"></div>
                        <div>
                          <div>{product.name}</div>
                          <div className="text-xs text-[#6F8591]">
                            ${product.price.toFixed(2)}
                            {product.regularPrice && product.regularPrice !== product.price && (
                              <span className="line-through ml-1">${product.regularPrice.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="selected-products">
                <h3 className="text-sm font-medium text-[#49617E] mb-2">Selected Products</h3>
                
                {formData.relatedProducts && formData.relatedProducts.length > 0 ? (
                  <div className="border border-[#E4E7EB] rounded-md divide-y divide-[#E4E7EB]">
                    {formData.relatedProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className="flex items-center justify-between p-3"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#F5F5F5] rounded mr-3"></div>
                          <div>
                            <div className="text-sm text-[#333333]">{product.name}</div>
                            <div className="text-xs text-[#6F8591]">
                              ${product.price.toFixed(2)}
                              {product.regularPrice && product.regularPrice !== product.price && (
                                <span className="line-through ml-1">${product.regularPrice.toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRelatedProduct(product.id)}
                          className="text-[#6F8591] hover:text-[#F85464] transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#F5F7FA] border border-dashed border-[#E4E7EB] rounded-md p-4 text-center">
                    <p className="text-sm text-[#6F8591]">No related products selected</p>
                    <p className="text-xs text-[#6F8591] mt-1">Search and add related products above</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product FAQ */}
          <div className="product-form__faq bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4 flex justify-between items-center">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Product FAQ</h2>
              <Button 
                type="button"
                size="sm" 
                variant="outline"
                leftIcon={<Plus size={14} />}
                onClick={handleAddFaq}
              >
                Add FAQ
              </Button>
            </div>
            
            <div className="p-6">
              {formData.faqs && formData.faqs.length > 0 ? (
                <div className="space-y-4">
                  {formData.faqs.map((faq, index) => (
                    <div 
                      key={faq.id} 
                      className="bg-[#F8F9FA] border border-[#E4E7EB] rounded-md overflow-hidden"
                    >
                      <div className="flex justify-between items-center px-4 py-3 bg-white">
                        <h3 className="text-sm font-medium text-[#2B4F60]">
                          Question #{index + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(faq.id)}
                          className="text-[#6F8591] hover:text-[#F85464] transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <div className="product-form__field">
                          <label className="block text-xs font-medium text-[#49617E] mb-1">
                            Question
                          </label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)}
                            placeholder="Enter FAQ question..."
                            className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                          />
                        </div>
                        
                        <div className="product-form__field">
                          <label className="block text-xs font-medium text-[#49617E] mb-1">
                            Answer
                          </label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)}
                            placeholder="Enter FAQ answer..."
                            className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                            rows={3}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#F5F7FA] border border-dashed border-[#E4E7EB] rounded-md p-6 text-center">
                  <FileText size={32} className="mx-auto mb-2 text-[#6F8591]" />
                  <p className="text-sm text-[#49617E]">No FAQs added yet</p>
                  <p className="text-xs text-[#6F8591] mt-1">Click 'Add FAQ' to create your first question and answer</p>
                </div>
              )}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="product-form__seo bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4 flex justify-between items-center">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Search Engine Optimize</h2>
              <Button 
                type="button"
                size="sm" 
                variant="outline"
                leftIcon={<Edit2 size={14} />}
                onClick={() => setShowSeoFields(!showSeoFields)}
              >
                {showSeoFields ? 'Hide' : 'Edit SEO meta'}
              </Button>
            </div>
            
            {showSeoFields && (
              <div className="p-6 space-y-4">
                <div className="product-form__field">
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
                
                <div className="product-form__field">
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
                  <div className="product-form__field">
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
                  
                  <div className="product-form__field">
                    <label htmlFor="externalLink" className="block text-sm font-medium text-[#49617E] mb-1">
                      External Link
                    </label>
                    <div className="relative">
                      <ExternalLink size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" />
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
          <div className="product-form__actions bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Status</h2>
            </div>
            
            <div className="p-6">
              <div className="product-form__field mb-4">
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
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
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
                  onClick={() => router.push('/admin/products')}
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

          {/* Categories Panel */}
          <div className="product-form__categories bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Categories</h2>
            </div>
            
            <div className="p-6">
              <input
                type="text"
                placeholder="Search categories"
                className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] mb-3"
              />
              
              <div className="max-h-60 overflow-y-auto space-y-1">
                {mockCategories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={formData.categories.some(cat => cat.id === category.id)}
                      onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                      className="mr-2 rounded border-[#E4E7EB]"
                    />
                    <label htmlFor={`category-${category.id}`} className="text-sm text-[#49617E] py-1">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Collection Panel */}
          <div className="product-form__collections bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Product Collection</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-2">
                {mockCollections.map((collection) => (
                  <div key={collection.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`collection-${collection.id}`}
                      checked={formData.collections.some(col => col.id === collection.id)}
                      onChange={(e) => handleCollectionChange(collection.id, e.target.checked)}
                      className="mr-2 rounded border-[#E4E7EB]"
                    />
                    <label htmlFor={`collection-${collection.id}`} className="text-sm text-[#49617E] py-1">
                      {collection.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Is Featured Panel */}
          <div className="product-form__featured bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
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

          {/* Tags Panel */}
          <div className="product-form__tags bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Tags</h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                  placeholder="Enter tag here..."
                  className="flex-1 px-4 py-2 border border-[#E4E7EB] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="px-4 py-2 bg-[#007BF9] text-white rounded-r-md hover:bg-[#0063cc] transition-colors"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
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
                
                {formData.tags.length === 0 && (
                  <p className="text-sm text-[#6F8591]">No tags added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Labels Panel */}
          <div className="product-form__labels bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Labels</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-2">
                {mockLabels.map((label) => (
                  <div key={label.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`label-${label.id}`}
                      checked={formData.labels.some(lbl => lbl.id === label.id)}
                      onChange={(e) => handleLabelChange(label.id, e.target.checked)}
                      className="mr-2 rounded border-[#E4E7EB]"
                    />
                    <label htmlFor={`label-${label.id}`} className="text-sm text-[#49617E] py-1">
                      {label.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tax Panel */}
          <div className="product-form__tax bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Tax</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-2">
                {mockTaxOptions.map((tax) => (
                  <div key={tax.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`tax-${tax.id}`}
                      name="tax"
                      checked={formData.tax === tax.id}
                      onChange={() => handleTaxChange(tax.id)}
                      className="mr-2 rounded-full border-[#E4E7EB]"
                    />
                    <label htmlFor={`tax-${tax.id}`} className="text-sm text-[#49617E] py-1">
                      {tax.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;