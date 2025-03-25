export interface PrintOptionGroup {
    id: string;
    name: string;
    status: 'published' | 'unpublished';
    assignedProducts: Product[];
    createdAt: string;
    variations: VariationPanel[];
  }
  
  export interface Product {
    id: string;
    name: string;
    image?: string;
  }
  
  export interface VariationPanel {
    id: string;
    name: string;
    type: 'quantity' | 'paper-size' | 'paper-type' | 'finishing';
    enabled: boolean;
    discountType?: 'fixed' | 'percentage';
    dependOnQuantity?: boolean;
    priceType?: 'fixed' | 'percentage';
    attributes: Attribute[];
    conditionalLogic?: ConditionalLogic;
  }
  
  export interface Attribute {
    id: string;
    name: string;
    description?: string;
    isDefault: boolean;
    swatchType?: 'image' | 'product-image';
    swatchImage?: string;
    price?: number;
    prices?: { [quantityId: string]: number };
    conditionalLogic?: ConditionalLogic;
    designSettings?: {
      productWidth?: number;
      productHeight?: number;
      designWidth?: number;
      designHeight?: number;
      designTop?: number;
      designLeft?: number;
    };
  }
  
  export interface ConditionalLogic {
    enabled: boolean;
    operator: 'all' | 'any';
    rules: ConditionalRule[];
  }
  
  export interface ConditionalRule {
    variationId: string;
    operator: 'is' | 'is_not';
    attributeId: string;
  }
  
  // API Response types
  export interface PrintOptionGroupsResponse {
    data: PrintOptionGroup[];
    total: number;
    page: number;
    limit: number;
  }
  
  export interface PrintOptionGroupResponse {
    data: PrintOptionGroup;
  }