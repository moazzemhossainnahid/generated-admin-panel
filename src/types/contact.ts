// Types for the Contact module

export interface ContactSubmission {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    orderNumber?: string;
    subject: string;
    message: string;
    status: 'In Progress' | 'Resolved' | 'Closed' | 'Spam';
    attachment?: {
      fileName: string;
      fileSize: string;
      fileUrl: string;
    };
    formType: string;
    submittedAt: string;
    ipAddress: string;
  }
  
  export interface ContactFilter {
    search?: string;
    status?: 'In Progress' | 'Resolved' | 'Closed' | 'Spam' | 'All';
    page: number;
    limit: number;
  }
  
  export interface ContactsResponse {
    data: ContactSubmission[];
    total: number;
  }
  
  export interface ContactResponse {
    data: ContactSubmission;
  }