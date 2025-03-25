'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  Save, 
  X, 
  LinkIcon, 
  Info 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { TagFormData } from '@/types/products';

interface TagFormProps {
  initialData?: TagFormData;
  onSubmit: (data: TagFormData, exit?: boolean) => Promise<void>;
}

const TagForm: React.FC<TagFormProps> = ({
  initialData,
  onSubmit
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<TagFormData>(
    initialData || {
      name: '',
      slug: '',
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

  // Generate slug from tag name
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle rich text editor changes
  const handleRichTextChange = (value: string) => {
    // This would handle changes from a rich text editor if implemented
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

  // Handle adding SEO keyword
  const handleAddKeyword = () => {
    if (seoKeyword.trim() && !formData.seo.keywords.includes(seoKeyword.trim())) {
      setFormData({
        ...formData,
        seo: {
          ...formData.seo,
          keywords: [...formData.seo.keywords, seoKeyword.trim()]
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
        ...formData.seo,
        keywords: formData.seo.keywords.filter(k => k !== keyword)
      }
    });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent, exit: boolean = false) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Tag name is required');
      return;
    }
    
    if (!formData.slug.trim()) {
      toast.error('Slug is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData, exit);
    } catch (error) {
      console.error('Error saving tag:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} tag`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle exit without saving
  const handleExit = () => {
    router.push('/admin/products/tags');
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="tag-form">
      <div className="tag-form__fields space-y-6">
        <div className="tag-form__field">
          <label htmlFor="name" className="block text-sm font-medium text-[#49617E] mb-1">
            Tag Name <span className="text-[#F85464]">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter tag name"
            className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
            required
          />
        </div>
        
        <div className="tag-form__field">
          <label htmlFor="slug" className="block text-sm font-medium text-[#49617E] mb-1">
            Slug <span className="text-[#F85464]">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 py-2 text-sm text-[#6F8591] bg-[#F5F5F5] border border-r-0 border-[#E4E7EB] rounded-l-md">
              http://druckland.com/products/tag/
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
              Preview: <a href="#" className="hover:underline">http://druckland.com/products/tag/{formData.slug}</a>
            </div>
          )}
        </div>
        
        <div className="tag-form__field">
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
              name="description"
              placeholder="Enter tag description here..."
              className="w-full px-4 py-3 border-0 focus:outline-none focus:ring-0"
              rows={4}
            ></textarea>
          </div>
        </div>
        
        {/* SEO Settings */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[#2B4F60] font-medium">SEO Settings</h3>
            <button
              type="button"
              onClick={() => setShowSeoFields(!showSeoFields)}
              className="text-sm text-[#007BF9] hover:underline"
            >
              {showSeoFields ? 'Hide SEO Settings' : 'Show SEO Settings'}
            </button>
          </div>
          
          {showSeoFields && (
            <div className="space-y-4 border border-[#E4E7EB] rounded-md p-4">
              <div className="tag-form__field">
                <label htmlFor="seoTitle" className="block text-sm font-medium text-[#49617E] mb-1">
                  SEO Title
                </label>
                <input
                  type="text"
                  id="seoTitle"
                  value={formData.seo.title || ''}
                  onChange={(e) => handleSeoChange('title', e.target.value)}
                  placeholder="Enter SEO title here..."
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                />
                <p className="text-xs text-[#6F8591] mt-1 flex items-center">
                  <Info size={12} className="mr-1" />
                  If left empty, tag name will be used as SEO title
                </p>
              </div>
              
              <div className="tag-form__field">
                <label htmlFor="seoDescription" className="block text-sm font-medium text-[#49617E] mb-1">
                  Meta Description
                </label>
                <textarea
                  id="seoDescription"
                  value={formData.seo.description || ''}
                  onChange={(e) => handleSeoChange('description', e.target.value)}
                  placeholder="Enter meta description here..."
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="tag-form__field">
                <label htmlFor="canonicalUrl" className="block text-sm font-medium text-[#49617E] mb-1">
                  Canonical URL
                </label>
                <div className="relative">
                  <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F8591]" />
                  <input
                    type="text"
                    id="canonicalUrl"
                    value={formData.seo.canonicalUrl || ''}
                    onChange={(e) => handleSeoChange('canonicalUrl', e.target.value)}
                    placeholder="https://example.com/canonical-url"
                    className="w-full pl-10 pr-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  />
                </div>
                <p className="text-xs text-[#6F8591] mt-1 flex items-center">
                  <Info size={12} className="mr-1" />
                  Only needed if this content exists on another URL
                </p>
              </div>
              
              <div className="tag-form__field">
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
                  {formData.seo.keywords.map((keyword, index) => (
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
                  {formData.seo.keywords.length === 0 && (
                    <p className="text-sm text-[#6F8591]">No keywords added yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Form Action Buttons */}
        <div className="tag-form__actions flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleExit}
          >
            Exit
          </Button>
          
          <Button
            type="button"
            variant="primary"
            leftIcon={<Save size={16} />}
            onClick={(e) => handleSubmit(e, true)}
            isLoading={isSubmitting}
          >
            Save & Exit
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            leftIcon={<Save size={16} />}
            isLoading={isSubmitting}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TagForm;