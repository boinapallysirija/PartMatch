export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  productType: 'Hardware' | 'Software' | 'Kit';
  imageUrl: string;
  sellerName: string;
  sellerId: number;
  stock: number;
  brand: string;
  compatibility: string;
  createdAt: string;
  usedInProjects?: Array<{
    id: number;
    name: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    estimatedTime: string;
    imageUrl: string;
    category: string;
    quantityRequired: number;
    totalComponentsCount: number;
  }>;
}

export interface ProjectComponentRelation {
  id: number;
  productId: number;
  quantityRequired: number;
  product: Product;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  imageUrl: string;
  category: string;
  totalComponents?: number;
  componentCount?: number;
  totalBundleCost?: number;
  allAvailable?: boolean;
  components?: ProjectComponentRelation[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
  token?: string;
}

export interface CartItemModel {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface CartModel {
  userId: number;
  items: CartItemModel[];
  totalItems: number;
  subtotal: number;
  total: number;
}

export interface OrderItemModel {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl: string;
}

export interface OrderModel {
  id: number;
  orderNumber: string;
  userId: number;
  total: number;
  pickupLocation: string;
  paymentMethod: string;
  status: 'PLACED' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  items: OrderItemModel[];
}

export interface MatchProjectResult {
  project: Project;
  totalComponents: number;
  matchingCount: number;
  missingCount: number;
  matchPercentage: number;
  matchingComponents: ProjectComponentRelation[];
  missingComponents: ProjectComponentRelation[];
  missingCost: number;
  totalKitCost: number;
}
