export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  regularPrice: number;
  salePrice?: number;
  saleStartDate?: string;
  saleEndDate?: string;
  featuredImage?: string;
  galleryImages?: string[];
  categories: Category[];
  tags: Tag[];
  collections: Collection[];
  labels: Label[];
  status: "published" | "draft" | "trash";
  isFeatured: boolean;
  tax?: string;
  faqs?: FAQ[];
  relatedProducts?: RelatedProduct[];
  seo?: SEOData;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Collection {
  id: string;
  name: string;
}

export interface Label {
  id: string;
  name: string;
  type: "new" | "sale" | "hot" | "custom";
  color?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface RelatedProduct {
  id: string;
  name: string;
  image?: string;
  price: number;
  regularPrice?: number;
}

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  internalLink?: string;
  externalLink?: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductResponse {
  data: Product;
}

export interface ProductFormData
  extends Omit<Product, "id" | "createdAt" | "updatedAt"> {
  id?: string;
}

export interface ProductFilter {
  status?: "all" | "published" | "draft" | "trash";
  search?: string;
  category?: string;
  sort?: string;
  sortDirection?: "asc" | "desc";
  page: number;
  limit: number;
}

// Add these interfaces to your types/products.ts file or create a new file if preferred

export interface FlashSale {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "expired" | "draft";
  visibility: "public" | "hidden";
  products: FlashSaleProduct[];
  isFeatured: boolean;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface FlashSaleProduct {
  id: string;
  name: string;
  image?: string;
  regularPrice: number;
  salePrice: number;
  offeredPrice: number;
}

export interface FlashSaleFormData
  extends Omit<FlashSale, "id" | "createdAt" | "updatedAt"> {
  id?: string;
}

export interface FlashSaleFilter {
  search?: string;
  status?: string;
  page: number;
  limit: number;
}

export interface FlashSalesResponse {
  data: FlashSale[];
  total: number;
  page: number;
  limit: number;
}
// Collection related types to add to types/products.ts

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: "active" | "inactive";
  featuredImage?: string;
  isFeatured?: boolean;
  products?: Product[];
  seo?: SEOData;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionFormData
  extends Omit<Collection, "id" | "createdAt" | "updatedAt"> {
  id?: string;
}

export interface CollectionFilter {
  search?: string;
  status?: "all" | "active" | "inactive";
  sort?: string;
  sortDirection?: "asc" | "desc";
  page: number;
  limit: number;
}

export interface CollectionsResponse {
  data: Collection[];
  total: number;
  page: number;
  limit: number;
}

// Add these interfaces to your types/products.ts file

export interface ProductTag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  seo?: {
    title: string;
    description: string;
    canonicalUrl: string;
    keywords: string[];
  };
}

export interface TagFormData {
  id?: string;
  name: string;
  slug: string;
  seo: {
    title: string;
    description: string;
    canonicalUrl: string;
    keywords: string[];
  };
}

export interface TagFilter {
  search?: string;
  page: number;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface TagsResponse {
  data: ProductTag[];
  total: number;
}

export interface TagResponse {
  data: ProductTag;
}

// Add these interfaces to your types/products.ts file

export interface ProductLabel {
  id: string;
  name: string;
  color: string;
  status: "active" | "inactive";
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LabelFormData {
  id?: string;
  name: string;
  color: string;
  status: "active" | "inactive";
  isFeatured?: boolean;
}

export interface LabelFilter {
  search?: string;
  page: number;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface LabelsResponse {
  data: ProductLabel[];
  total: number;
}

export interface LabelResponse {
  data: ProductLabel;
}



// Add these interfaces to your types/products.ts file

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  userId: string;
  userName: string;
  userEmail: string;
  userType: 'registered' | 'guest';
  rating: number;
  reviewText: string;
  images?: string[];
  status: 'pending' | 'approved' | 'disapproved' | 'spam';
  createdAt: string;
  updatedAt: string;
  replies?: ReviewReply[];
  activityLog?: ReviewActivityLog[];
}

export interface ReviewReply {
  id: string;
  reviewId: string;
  userId: string;
  userName: string;
  userRole: string;
  replyText: string;
  createdAt: string;
}

export interface ReviewActivityLog {
  id: string;
  reviewId: string;
  action: 'status_update' | 'reply_added' | 'created';
  details: string;
  performedBy: string;
  performedAt: string;
}

export interface ReviewFormData {
  status: 'pending' | 'approved' | 'disapproved' | 'spam';
  replyText?: string;
}

export interface ReviewFilter {
  search?: string;
  status?: 'all' | 'pending' | 'approved' | 'disapproved' | 'spam';
  page: number;
  limit: number;
}

export interface ReviewsResponse {
  data: ProductReview[];
  total: number;
}

export interface ReviewResponse {
  data: ProductReview;
}

// Add these interfaces to your types/products.ts file

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  image?: string;
  iconType?: 'typography' | 'image';
  icon?: string;
  productCount?: number;
  children?: ProductCategory[];
  seo?: {
    title: string;
    description: string;
    canonicalUrl: string;
    keywords: string[];
  };
}

export interface CategoryFormData {
  id?: string;
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
  status: 'active' | 'inactive';
  image?: string;
  iconType?: 'typography' | 'image';
  icon?: string;
  seo?: {
    title: string;
    description: string;
    canonicalUrl: string;
    keywords: string[];
  };
}

export interface CategoryFilter {
  search?: string;
  page: number;
  limit: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface CategoriesResponse {
  data: ProductCategory[];
  total: number;
}
