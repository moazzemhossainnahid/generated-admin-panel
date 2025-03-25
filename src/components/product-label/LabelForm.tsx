'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Save, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import { LabelFormData } from '@/types/products';

interface LabelFormProps {
  initialData?: LabelFormData;
  onSubmit: (data: LabelFormData, exit?: boolean) => Promise<void>;
}

const colorOptions = [
  { name: 'Red', value: '#F85464' },
  { name: 'Green', value: '#30BF89' },
  { name: 'Blue', value: '#007BF9' },
  { name: 'Yellow', value: '#FFB02C' },
  { name: 'Purple', value: '#5C59E8' },
  { name: 'Orange', value: '#E46A11' },
  { name: 'Cyan', value: '#13B2E4' },
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#828282' },
  { name: 'Pink', value: '#FED1EF' },
  { name: 'Lime', value: '#BCE6D1' },
  { name: 'Teal', value: '#B8E2F2' },
];

const LabelForm: React.FC<LabelFormProps> = ({
  initialData,
  onSubmit
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<LabelFormData>(
    initialData || {
      name: '',
      color: '#F85464',
      status: 'active',
      isFeatured: false
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const isEditMode = !!initialData;

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setFormData({
      ...formData,
      color
    });
    setShowColorPicker(false);
  };

  // Handle custom color input
  const handleColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      color: e.target.value
    });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent, exit: boolean = false) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Label name is required');
      return;
    }
    
    if (!formData.color) {
      toast.error('Label color is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData, exit);
    } catch (error) {
      console.error('Error saving label:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} label`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle exit without saving
  const handleExit = () => {
    router.push('/admin/products/label');
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="label-form">
      <div className="label-form__fields space-y-6">
        <div className="label-form__field">
          <label htmlFor="name" className="block text-sm font-medium text-[#49617E] mb-1">
            Label Name <span className="text-[#F85464]">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter label name"
            className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
            required
          />
        </div>
        
        <div className="label-form__field">
          <label htmlFor="color" className="block text-sm font-medium text-[#49617E] mb-1">
            Color Picker <span className="text-[#F85464]">*</span>
          </label>
          <div className="relative">
            <div 
              className="flex items-center justify-between px-4 py-2 border border-[#E4E7EB] rounded-md cursor-pointer"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <div className="flex items-center">
                <div 
                  className="w-6 h-6 rounded mr-2 border border-[#E4E7EB]"
                  style={{ backgroundColor: formData.color }}
                ></div>
                <span>{formData.color}</span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${showColorPicker ? 'rotate-180' : ''}`} />
            </div>
            
            {showColorPicker && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-[#E4E7EB] rounded-md shadow-lg p-3">
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {colorOptions.map((color) => (
                    <div
                      key={color.value}
                      className={`w-full aspect-square rounded cursor-pointer border ${formData.color === color.value ? 'border-[#007BF9] border-2' : 'border-[#E4E7EB]'}`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      onClick={() => handleColorSelect(color.value)}
                    ></div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#E4E7EB]">
                  <label className="block text-xs text-[#49617E] mb-1">
                    Custom Color
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={handleColorInput}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="label-form__field">
          <label className="block text-sm font-medium text-[#49617E] mb-1">
            Status
          </label>
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="status"
                checked={formData.status === 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-[#E0E0E0] peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#007BF9] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#30BF89]"></div>
              <span className="ml-2 text-sm text-[#49617E]">
                {formData.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </label>
          </div>
        </div>
        
        <div className="label-form__field">
          <label className="block text-sm font-medium text-[#49617E] mb-1">
            Is Featured
          </label>
          <div className="flex items-center">
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
        
        {/* Form Action Buttons */}
        <div className="label-form__actions flex justify-end space-x-3">
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

export default LabelForm;