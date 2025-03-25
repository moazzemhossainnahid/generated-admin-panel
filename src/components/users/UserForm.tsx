'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { 
  Save, 
  Upload,
  Eye,
  EyeOff,
  Phone
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { UserFormData, User } from '@/types/users';
import Link from 'next/link';

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: UserFormData, exit?: boolean) => Promise<void>;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<UserFormData>({
    id: initialData?.id,
    username: initialData?.username || '',
    email: initialData?.email || '',
    phoneNumber: initialData?.phoneNumber || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    password: '',
    role: initialData?.role || 'Customer',
    status: initialData?.status || 'Active',
    profilePicture: initialData?.profilePicture,
    billingAddress: initialData?.billingAddress || {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      country: 'United States of America',
      address: '',
      apartment: '',
      city: '',
      zipCode: ''
    },
    shippingAddress: initialData?.shippingAddress || {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      country: 'United States of America',
      address: '',
      apartment: '',
      city: '',
      zipCode: ''
    }
  });
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyShippingFromBilling, setCopyShippingFromBilling] = useState(false);
  
  const isEditMode = !!initialData;
  
  // Handle copying shipping address from billing
  useEffect(() => {
    if (copyShippingFromBilling) {
      setFormData(prev => ({
        ...prev,
        shippingAddress: { ...prev.billingAddress! }
      }));
    }
  }, [copyShippingFromBilling, formData.billingAddress]);

  // Handle input changes for basic info
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle status change
  const handleStatusChange = (status: 'Active' | 'Inactive' | 'Banned') => {
    setFormData({
      ...formData,
      status
    });
  };

  // Handle billing address changes
  const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      billingAddress: {
        ...formData.billingAddress!,
        [name]: value
      }
    });
  };

  // Handle shipping address changes
  const handleShippingAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      shippingAddress: {
        ...formData.shippingAddress!,
        [name]: value
      }
    });
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

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent, exit: boolean = false) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData, exit);
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} user`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle exit without saving
  const handleExit = () => {
    router.push('/admin/users');
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="user-form">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Information */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Basic Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="form-group">
                <label htmlFor="username" className="block text-sm font-medium text-[#49617E] mb-1">
                  User Name <span className="text-[#F85464]">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter user name"
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="block text-sm font-medium text-[#49617E] mb-1">
                  Email Address <span className="text-[#F85464]">*</span>
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
              
              <div className="form-group">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-[#49617E] mb-1">
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                />
              </div>
              
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
              </div>
              
              <div className="form-group">
                <label htmlFor="role" className="block text-sm font-medium text-[#49617E] mb-1">
                  User Role <span className="text-[#F85464]">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  required
                >
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                  <option value="Guest">Guest</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Billing Address */}
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Billing Address</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="billingFirstName" className="block text-sm font-medium text-[#49617E] mb-1">
                    First Name
                  </label>
                  <input
                    id="billingFirstName"
                    name="firstName"
                    type="text"
                    value={formData.billingAddress?.firstName || ''}
                    onChange={handleBillingAddressChange}
                    placeholder="Enter first name"
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="billingLastName" className="block text-sm font-medium text-[#49617E] mb-1">
                    Last Name
                  </label>
                  <input
                    id="billingLastName"
                    name="lastName"
                    type="text"
                    value={formData.billingAddress?.lastName || ''}
                    onChange={handleBillingAddressChange}
                    placeholder="Enter last name"
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="billingCompanyName" className="block text-sm font-medium text-[#49617E] mb-1">
                  Company Name
                </label>
                <input
                  id="billingCompanyName"
                  name="companyName"
                  type="text"
                  value={formData.billingAddress?.companyName || ''}
                  onChange={handleBillingAddressChange}
                  placeholder="Enter company name (optional)"
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="billingEmail" className="block text-sm font-medium text-[#49617E] mb-1">
                  Email Address
                </label>
                <input
                  id="billingEmail"
                  name="email"
                  type="email"
                  value={formData.billingAddress?.email || ''}
                  onChange={handleBillingAddressChange}
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="billingPhone" className="block text-sm font-medium text-[#49617E] mb-1">
                  Phone Number
                </label>
                <div className="flex">
                  <div className="inline-flex items-center px-3 py-2 text-sm text-[#6F8591] bg-[#F5F5F5] border border-r-0 border-[#E4E7EB] rounded-l-md">
                    +1
                  </div>
                  <input
                    id="billingPhone"
                    name="phoneNumber"
                    type="tel"
                    value={formData.billingAddress?.phoneNumber || ''}
                    onChange={handleBillingAddressChange}
                    placeholder="(000) 000-0000"
                    className="flex-1 px-4 py-2 border border-[#E4E7EB] rounded-r-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="billingCountry" className="block text-sm font-medium text-[#49617E] mb-1">
                  Country/Region
                </label>
                <select
                  id="billingCountry"
                  name="country"
                  value={formData.billingAddress?.country || ''}
                  onChange={handleBillingAddressChange}
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                >
                  <option value="United States of America">United States of America</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="billingAddress" className="block text-sm font-medium text-[#49617E] mb-1">
                  Address
                </label>
                <input
                  id="billingAddress"
                  name="address"
                  type="text"
                  value={formData.billingAddress?.address || ''}
                  onChange={handleBillingAddressChange}
                  placeholder="Enter address"
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="billingApartment" className="block text-sm font-medium text-[#49617E] mb-1">
                  Apartment, suite, unit, etc.
                </label>
                <input
                  id="billingApartment"
                  name="apartment"
                  type="text"
                  value={formData.billingAddress?.apartment || ''}
                  onChange={handleBillingAddressChange}
                  placeholder="Apartment, suite, unit, etc."
                  className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="billingCity" className="block text-sm font-medium text-[#49617E] mb-1">
                    City/Town
                  </label>
                  <input
                    id="billingCity"
                    name="city"
                    type="text"
                    value={formData.billingAddress?.city || ''}
                    onChange={handleBillingAddressChange}
                    placeholder="Enter city or town"
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="billingZipCode" className="block text-sm font-medium text-[#49617E] mb-1">
                    ZIP Code
                  </label>
                  <input
                    id="billingZipCode"
                    name="zipCode"
                    type="text"
                    value={formData.billingAddress?.zipCode || ''}
                    onChange={handleBillingAddressChange}
                    placeholder="Enter ZIP code"
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={copyShippingFromBilling}
                    onChange={(e) => setCopyShippingFromBilling(e.target.checked)}
                    className="rounded border-[#E4E7EB] text-[#007BF9] focus:ring-[#007BF9]"
                  />
                  <span className="ml-2 text-sm text-[#49617E]">
                    Use this address for shipping too
                  </span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Shipping Address */}
          {!copyShippingFromBilling && (
            <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
              <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
                <h2 className="text-[#2B4F60] text-lg font-semibold">Shipping Address</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="shippingFirstName" className="block text-sm font-medium text-[#49617E] mb-1">
                      First Name
                    </label>
                    <input
                      id="shippingFirstName"
                      name="firstName"
                      type="text"
                      value={formData.shippingAddress?.firstName || ''}
                      onChange={handleShippingAddressChange}
                      placeholder="Enter first name"
                      className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="shippingLastName" className="block text-sm font-medium text-[#49617E] mb-1">
                      Last Name
                    </label>
                    <input
                      id="shippingLastName"
                      name="lastName"
                      type="text"
                      value={formData.shippingAddress?.lastName || ''}
                      onChange={handleShippingAddressChange}
                      placeholder="Enter last name"
                      className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="shippingCompanyName" className="block text-sm font-medium text-[#49617E] mb-1">
                    Company Name
                  </label>
                  <input
                    id="shippingCompanyName"
                    name="companyName"
                    type="text"
                    value={formData.shippingAddress?.companyName || ''}
                    onChange={handleShippingAddressChange}
                    placeholder="Enter company name (optional)"
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="shippingEmail" className="block text-sm font-medium text-[#49617E] mb-1">
                    Email Address
                  </label>
                  <input
                    id="shippingEmail"
                    name="email"
                    type="email"
                    value={formData.shippingAddress?.email || ''}
                    onChange={handleShippingAddressChange}
                    placeholder="Enter email address"
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="shippingPhone" className="block text-sm font-medium text-[#49617E] mb-1">
                    Phone Number
                  </label>
                  <div className="flex">
                    <div className="inline-flex items-center px-3 py-2 text-sm text-[#6F8591] bg-[#F5F5F5] border border-r-0 border-[#E4E7EB] rounded-l-md">
                      +1
                    </div>
                    <input
                      id="shippingPhone"
                      name="phoneNumber"
                      type="tel"
                      value={formData.shippingAddress?.phoneNumber || ''}
                      onChange={handleShippingAddressChange}
                      placeholder="(000) 000-0000"
                      className="flex-1 px-4 py-2 border border-[#E4E7EB] rounded-r-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="shippingCountry" className="block text-sm font-medium text-[#49617E] mb-1">
                    Country/Region
                  </label>
                  <select
                    id="shippingCountry"
                    name="country"
                    value={formData.shippingAddress?.country || ''}
                    onChange={handleShippingAddressChange}
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  >
                    <option value="United States of America">United States of America</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="shippingAddress" className="block text-sm font-medium text-[#49617E] mb-1">
                    Address
                  </label>
                  <input
                    id="shippingAddress"
                    name="address"
                    type="text"
                    value={formData.shippingAddress?.address || ''}
                    onChange={handleShippingAddressChange}
                    placeholder="Enter address"
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="shippingApartment" className="block text-sm font-medium text-[#49617E] mb-1">
                    Apartment, suite, unit, etc.
                  </label>
                  <input
                    id="shippingApartment"
                    name="apartment"
                    type="text"
                    value={formData.shippingAddress?.apartment || ''}
                    onChange={handleShippingAddressChange}
                    placeholder="Apartment, suite, unit, etc."
                    className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="shippingCity" className="block text-sm font-medium text-[#49617E] mb-1">
                      City/Town
                    </label>
                    <input
                      id="shippingCity"
                      name="city"
                      type="text"
                      value={formData.shippingAddress?.city || ''}
                      onChange={handleShippingAddressChange}
                      placeholder="Enter city or town"
                      className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="shippingZipCode" className="block text-sm font-medium text-[#49617E] mb-1">
                      ZIP Code
                    </label>
                    <input
                      id="shippingZipCode"
                      name="zipCode"
                      type="text"
                      value={formData.shippingAddress?.zipCode || ''}
                      onChange={handleShippingAddressChange}
                      placeholder="Enter ZIP code"
                      className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Order History in Edit mode */}
          {isEditMode && (
            <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
              <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
                <h2 className="text-[#2B4F60] text-lg font-semibold">Order History</h2>
              </div>
              <div className="p-6">
                {initialData?.orderCount ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#49617E] font-medium">
                        Total Orders: <span className="font-bold">{initialData.orderCount}</span>
                      </span>
                      <Link 
                        href={`/admin/orders?user=${initialData.id}`}
                        className="text-[#007BF9] hover:underline text-sm"
                      >
                        View All Orders
                      </Link>
                    </div>
                    <div className="text-center py-8">
                      <p className="text-[#6F8591]">Order history available in Orders section</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#6F8591]">No orders yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Reviews in Edit mode */}
          {isEditMode && (
            <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
              <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
                <h2 className="text-[#2B4F60] text-lg font-semibold">Reviews</h2>
              </div>
              <div className="p-6">
                {initialData?.reviewCount ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#49617E] font-medium">
                        Total Reviews: <span className="font-bold">{initialData.reviewCount}</span>
                      </span>
                      <Link 
                        href={`/admin/products/reviews?user=${initialData.id}`}
                        className="text-[#007BF9] hover:underline text-sm"
                      >
                        View All Reviews
                      </Link>
                    </div>
                    <div className="text-center py-8">
                      <p className="text-[#6F8591]">Reviews available in Product Reviews section</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#6F8591]">No reviews yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column - Profile Picture & Status */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Profile Picture</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-[#F5F7FA] border border-[#E4E7EB] flex items-center justify-center overflow-hidden mb-4">
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
                      {formData.username ? formData.username.charAt(0).toUpperCase() : 'U'}
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
                  Choose image or drag file here.<br />
                  JPG, PNG or GIF (max. 800x800px)
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-md border border-[#E4E7EB] overflow-hidden">
            <div className="bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4">
              <h2 className="text-[#2B4F60] text-lg font-semibold">Account Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className={`flex items-center p-3 rounded-md cursor-pointer ${formData.status === 'Active' ? 'bg-[#E6F6EE] border border-[#30BF89]' : 'bg-white border border-[#E4E7EB] hover:bg-[#F5F7FA]'}`}
                  onClick={() => handleStatusChange('Active')}
                >
                  <input
                    type="radio"
                    id="statusActive"
                    checked={formData.status === 'Active'}
                    onChange={() => handleStatusChange('Active')}
                    className="rounded-full border-[#E4E7EB] text-[#30BF89] focus:ring-[#30BF89]"
                  />
                  <label htmlFor="statusActive" className="ml-2 flex-1 cursor-pointer">
                    <span className="block text-sm font-medium text-[#10243E]">Active</span>
                    <span className="block text-xs text-[#49617E]">User can login and perform all actions</span>
                  </label>
                </div>
                
                <div className={`flex items-center p-3 rounded-md cursor-pointer ${formData.status === 'Inactive' ? 'bg-[#F5F5F5] border border-[#828282]' : 'bg-white border border-[#E4E7EB] hover:bg-[#F5F7FA]'}`}
                  onClick={() => handleStatusChange('Inactive')}
                >
                  <input
                    type="radio"
                    id="statusInactive"
                    checked={formData.status === 'Inactive'}
                    onChange={() => handleStatusChange('Inactive')}
                    className="rounded-full border-[#E4E7EB] text-[#828282] focus:ring-[#828282]"
                  />
                  <label htmlFor="statusInactive" className="ml-2 flex-1 cursor-pointer">
                    <span className="block text-sm font-medium text-[#10243E]">Inactive</span>
                    <span className="block text-xs text-[#49617E]">User cannot login but data is preserved</span>
                  </label>
                </div>
                
                <div className={`flex items-center p-3 rounded-md cursor-pointer ${formData.status === 'Banned' ? 'bg-[#FFEFEF] border border-[#F85464]' : 'bg-white border border-[#E4E7EB] hover:bg-[#F5F7FA]'}`}
                  onClick={() => handleStatusChange('Banned')}
                >
                  <input
                    type="radio"
                    id="statusBanned"
                    checked={formData.status === 'Banned'}
                    onChange={() => handleStatusChange('Banned')}
                    className="rounded-full border-[#E4E7EB] text-[#F85464] focus:ring-[#F85464]"
                  />
                  <label htmlFor="statusBanned" className="ml-2 flex-1 cursor-pointer">
                    <span className="block text-sm font-medium text-[#10243E]">Banned</span>
                    <span className="block text-xs text-[#49617E]">User is prohibited from using the platform</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
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
    </form>
  );
};

export default UserForm;