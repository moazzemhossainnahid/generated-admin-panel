// Types for the Users module

export interface User {
    id: string;
    username: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    role: 'Customer' | 'Admin' | 'Guest';
    status: 'Active' | 'Inactive' | 'Banned';
    profilePicture?: string;
    billingAddress?: Address;
    shippingAddress?: Address;
    createdAt: string;
    updatedAt: string;
    orderCount?: number;
    reviewCount?: number;
  }
  
  export interface Address {
    firstName: string;
    lastName: string;
    companyName?: string;
    email: string;
    phoneNumber?: string;
    country: string;
    address: string;
    apartment?: string;
    city: string;
    zipCode: string;
  }
  
  export interface UserFormData {
    id?: string;
    username: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    password?: string;
    role: 'Customer' | 'Admin' | 'Guest';
    status: 'Active' | 'Inactive' | 'Banned';
    profilePicture?: string;
    billingAddress?: Address;
    shippingAddress?: Address;
  }
  
  export interface UserFilter {
    search?: string;
    status?: 'Active' | 'Inactive' | 'Banned' | 'All';
    role?: 'Customer' | 'Admin' | 'Guest' | 'All';
    page: number;
    limit: number;
  }
  
  export interface UsersResponse {
    data: User[];
    total: number;
  }
  
  export interface UserResponse {
    data: User;
  }