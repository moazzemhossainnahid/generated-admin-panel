'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { 
  Save, 
  Eye,
  EyeOff,
  Upload,
  Phone
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { AdminFormData, Admin } from '@/types/admin';

interface AdminFormProps {
  initialData?: Admin;
  onSubmit: (data: AdminFormData, exit?: boolean) => Promise<void>;
}

const AdminForm: React.FC<AdminFormProps> = ({
  initialData,
  onSubmit
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<AdminFormData>({
    id: initialData?.id,
    fullName: initialData?.fullName || '',
    username: initialData?.username || '',
    email: initialData?.email || '',
    phoneNumber: initialData?.phoneNumber || '',
    password: '',
    confirmPassword: '',
    role: initialData?.role || 'Manager',
    status: initialData?.status || 'Active',
    isVerified: initialData?.isVerified || false,
    profilePicture: initialData?.profilePicture
  });
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!initialData;

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to your server or cloud storage
      // For now, simulate with URL.createObjectURL
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        profilePicture: imageUrl
      });
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    // Check required fields
    if (!formData.fullName.trim()) {
      toast.error('Full Name is required');
      return false;
    }
    
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    // Password validation for new users
    if (!isEditMode) {
      if (!formData.password) {
        toast.error('Password is required for new admin users');
        return false;
      }
      
      if (formData.password.length < 8) {
        toast.error('Password must be at least 8 characters long');
        return false;
      }
      
      // Check for uppercase and number
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
      if (!passwordRegex.test(formData.password)) {
        toast.error('Password must contain at least one uppercase letter and one number');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
    } else if (formData.password) {
      // If editing and password is provided, validate it
      if (formData.password.length < 8) {
        toast.error('Password must be at least 8 characters long');
        return false;
      }
      
      // Check for uppercase and number
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
      if (!passwordRegex.test(formData.password)) {
        toast.error('Password must contain at least one uppercase letter and one number');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
    }
    
    return true;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent, exit: boolean = false) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData, exit);
    } catch (error) {
      console.error('Error saving admin:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} admin`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle exit without saving
  const handleCancel = () => {
    router.push('/admin/administration');
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="admin-form bg-white rounded-md border border-[#E4E7EB] p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Information */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <h2 className="text-[#2B4F60] text-lg font-semibold">Basic Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="fullName" className="block text-sm font-medium text-[#49617E] mb-1">
                Full Name <span className="text-[#F85464]">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="username" className="block text-sm font-medium text-[#49617E] mb-1">
                Username <span className="text-[#F85464]">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-[#49617E] mb-1">
              Email <span className="text-[#F85464]">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#49617E] mb-1">
              Phone Number
            </label>
            <div className="flex">
              <div className="inline-flex items-center px-3 py-2 text-sm text-[#6F8591] bg-[#F5F5F5] border border-r-0 border-[#E4E7EB] rounded-l-md">
                <Phone size={16} className="mr-1" />
                +1
              </div>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="(000) 000-0000"
                className="flex-1 px-4 py-2 border border-[#E4E7EB] rounded-r-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
              />
            </div>
          </div>
          
          <h2 className="text-[#2B4F60] text-lg font-semibold pt-4">Security Details</h2>
          
          <div className="form-group">
            <label htmlFor="password" className="block text-sm font-medium text-[#49617E] mb-1">
              Password {!isEditMode && <span className="text-[#F85464]">*</span>}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isEditMode ? "Leave blank to keep current password" : "Enter password"}
                className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] pr-10"
                required={!isEditMode}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F8591] hover:text-[#49617E]"
              >
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-[#6F8591] mt-1">
              Password must be at least 8 characters with uppercase letter and number
            </p>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#49617E] mb-1">
              Confirm Password {!isEditMode && <span className="text-[#F85464]">*</span>}
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={confirmPasswordVisible ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] pr-10"
                required={!isEditMode}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F8591] hover:text-[#49617E]"
              >
                {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Column - Role & Status */}
        <div className="col-span-1 space-y-6">
          <div className="form-group">
            <label htmlFor="role" className="block text-sm font-medium text-[#49617E] mb-1">
              Role <span className="text-[#F85464]">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
              required
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Manager">Manager</option>
              <option value="Support">Support</option>
              <option value="Employee">Employee</option>
              <option value="Editor">Editor</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-[#49617E] mb-1">
              Status <span className="text-[#F85464]">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === 'Active'}
                  onChange={handleInputChange}
                  className="rounded-full border-[#E4E7EB] text-[#30BF89] focus:ring-[#30BF89]"
                />
                <span className="ml-2 text-sm text-[#49617E]">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={formData.status === 'Inactive'}
                  onChange={handleInputChange}
                  className="rounded-full border-[#E4E7EB] text-[#E46A11] focus:ring-[#E46A11]"
                />
                <span className="ml-2 text-sm text-[#49617E]">Inactive</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Suspended"
                  checked={formData.status === 'Suspended'}
                  onChange={handleInputChange}
                  className="rounded-full border-[#E4E7EB] text-[#F85464] focus:ring-[#F85464]"
                />
                <span className="ml-2 text-sm text-[#49617E]">Suspended</span>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-[#49617E] mb-1">
              Verification
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleInputChange}
                className="rounded border-[#E4E7EB] text-[#007BF9] focus:ring-[#007BF9]"
              />
              <span className="ml-2 text-sm text-[#49617E]">Verified</span>
            </label>
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-[#49617E] mb-2">
              Profile Picture
            </label>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border border-[#E4E7EB] flex items-center justify-center overflow-hidden mb-4 bg-[#F5F7FA]">
                {formData.profilePicture ? (
                  <Image 
                    src={formData.profilePicture} 
                    alt="Profile" 
                    width={128} 
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-[#6F8591] text-4xl font-medium">
                    {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
              </div>
              
              <label className="cursor-pointer">
                <div className="px-4 py-2 bg-[#F5F7FA] text-[#49617E] border border-[#E4E7EB] rounded-md hover:bg-[#DCE8F8] transition-colors text-sm flex items-center justify-center">
                  <Upload size={16} className="mr-2" />
                  Upload Image
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
              </label>
              
              <p className="text-xs text-[#6F8591] mt-2 text-center">
                JPG, PNG or GIF (max. 800x800px)
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-[#E4E7EB]">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
        >
          Cancel
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
    </form>
  );
};

export default AdminForm;