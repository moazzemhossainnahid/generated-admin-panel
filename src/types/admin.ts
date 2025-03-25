// Types for the Admin module

export interface Admin {
    id: string;
    fullName: string;
    username: string;
    email: string;
    phoneNumber?: string;
    role: 'Super Admin' | 'Manager' | 'Support' | 'Employee' | 'Editor';
    status: 'Active' | 'Inactive' | 'Suspended';
    isVerified?: boolean;
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AdminFormData {
    id?: string;
    fullName: string;
    username: string;
    email: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
    role: 'Super Admin' | 'Manager' | 'Support' | 'Employee' | 'Editor';
    status: 'Active' | 'Inactive' | 'Suspended';
    isVerified?: boolean;
    profilePicture?: string;
  }
  
  export interface AdminFilter {
    search?: string;
    role?: string;
    status?: string;
    page: number;
    limit: number;
  }
  
  export interface AdminsResponse {
    data: Admin[];
    total: number;
  }
  
  export interface AdminResponse {
    data: Admin;
  }