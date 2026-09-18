import {
  Product,
  Project,
  ProjectComponent,
  User,
  CartItem,
  Order,
  OrderItem,
  INITIAL_PRODUCTS,
  INITIAL_PROJECTS,
  INITIAL_PROJECT_COMPONENTS,
  INITIAL_USER
} from './data.js';

class InMemoryStore {
  private products: Product[] = [];
  private projects: Project[] = [];
  private projectComponents: ProjectComponent[] = [];
  private users: User[] = [];
  private cartItems: CartItem[] = [];
  private orders: Order[] = [];
  private nextProductId = 100;
  private nextCartItemId = 1;
  private nextOrderId = 1;

  constructor() {
    this.seed();
  }

  public seed() {
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.projects = JSON.parse(JSON.stringify(INITIAL_PROJECTS));
    this.projectComponents = JSON.parse(JSON.stringify(INITIAL_PROJECT_COMPONENTS));
    this.users = [JSON.parse(JSON.stringify(INITIAL_USER))];
    this.cartItems = [];
    this.orders = [];
    this.nextProductId = 100;
    this.nextCartItemId = 1;
    this.nextOrderId = 1;
  }

  // --- Product Methods ---
  public getProducts(query?: {
    search?: string;
    category?: string;
    condition?: string;
    productType?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sort?: string;
    sellerId?: number;
  }): Product[] {
    let result = [...this.products];

    if (query?.sellerId !== undefined) {
      result = result.filter(p => p.sellerId === query.sellerId);
    }

    if (query?.search && query.search.trim() !== '') {
      const q = query.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.compatibility.toLowerCase().includes(q)
      );
    }

    if (query?.category && query.category !== 'All' && query.category !== '') {
      result = result.filter(p => p.category.toLowerCase() === query.category!.toLowerCase());
    }

    if (query?.condition && query.condition !== 'All' && query.condition !== '') {
      result = result.filter(p => p.condition.toLowerCase() === query.condition!.toLowerCase());
    }

    if (query?.productType && query.productType !== 'All' && query.productType !== '') {
      result = result.filter(p => p.productType.toLowerCase() === query.productType!.toLowerCase());
    }

    if (query?.minPrice !== undefined && !isNaN(query.minPrice)) {
      result = result.filter(p => p.price >= query.minPrice!);
    }

    if (query?.maxPrice !== undefined && !isNaN(query.maxPrice)) {
      result = result.filter(p => p.price <= query.maxPrice!);
    }

    if (query?.inStock) {
      result = result.filter(p => p.stock > 0);
    }

    if (query?.sort) {
      switch (query.sort) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'recently_added':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'name_asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    return result;
  }

  public getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public createProduct(data: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...data,
      id: this.nextProductId++,
      createdAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  public updateProduct(id: number, data: Partial<Product>): Product | undefined {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    this.products[index] = { ...this.products[index], ...data };
    return this.products[index];
  }

  public deleteProduct(id: number): boolean {
    const prevLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.products.length < prevLen;
  }

  // --- Project Methods ---
  public getProjects(query?: { category?: string; difficulty?: string; search?: string }): Project[] {
    let result = [...this.projects];

    if (query?.search && query.search.trim() !== '') {
      const q = query.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (query?.category && query.category !== 'All' && query.category !== '') {
      result = result.filter(p => p.category.toLowerCase() === query.category!.toLowerCase());
    }

    if (query?.difficulty && query.difficulty !== 'All' && query.difficulty !== '') {
      result = result.filter(p => p.difficulty.toLowerCase() === query.difficulty!.toLowerCase());
    }

    return result;
  }

  public getProjectById(id: number): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  public getProjectComponents(projectId: number): (ProjectComponent & { product: Product })[] {
    const comps = this.projectComponents.filter(pc => pc.projectId === projectId);
    return comps
      .map(pc => {
        const product = this.getProductById(pc.productId);
        if (!product) return null;
        return {
          ...pc,
          product
        };
      })
      .filter((item): item is (ProjectComponent & { product: Product }) => item !== null);
  }

  public getProjectsByComponent(productId: number): {
    project: Project;
    quantityRequired: number;
    totalComponentsCount: number;
  }[] {
    const matches = this.projectComponents.filter(pc => pc.productId === productId);
    return matches.map(m => {
      const project = this.getProjectById(m.projectId)!;
      const allComponents = this.projectComponents.filter(pc => pc.projectId === m.projectId);
      return {
        project,
        quantityRequired: m.quantityRequired,
        totalComponentsCount: allComponents.length
      };
    }).filter(item => item.project !== undefined);
  }

  // --- Smart Matching Engine ---
  public matchProjects(productIds: number[]) {
    const validIds = new Set(productIds);
    const results = this.projects.map(project => {
      const components = this.getProjectComponents(project.id);
      const totalCount = components.length;

      const matching = components.filter(c => validIds.has(c.productId));
      const missing = components.filter(c => !validIds.has(c.productId));

      const matchPercentage = totalCount > 0 ? Math.round((matching.length / totalCount) * 100) : 0;
      const missingCost = missing.reduce((sum, item) => sum + (item.product.price * item.quantityRequired), 0);
      const totalKitCost = components.reduce((sum, item) => sum + (item.product.price * item.quantityRequired), 0);

      return {
        project,
        totalComponents: totalCount,
        matchingCount: matching.length,
        missingCount: missing.length,
        matchPercentage,
        matchingComponents: matching,
        missingComponents: missing,
        missingCost,
        totalKitCost
      };
    });

    // Prioritize projects that have at least 1 match, sorted by highest percentage
    return results.sort((a, b) => {
      if (b.matchingCount !== a.matchingCount) {
        return b.matchingCount - a.matchingCount;
      }
      return b.matchPercentage - a.matchPercentage;
    });
  }

  // --- Cart Methods ---
  public getCart(userId: number) {
    const userItems = this.cartItems.filter(item => item.userId === userId);
    let subtotal = 0;

    const items = userItems.map(item => {
      const product = this.getProductById(item.productId);
      if (!product) return null;
      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;
      return {
        id: item.id,
        productId: item.productId,
        product,
        quantity: item.quantity,
        subtotal: itemSubtotal
      };
    }).filter(Boolean);

    return {
      userId,
      items,
      totalItems: items.reduce((acc, it) => acc + (it ? it.quantity : 0), 0),
      subtotal,
      total: subtotal
    };
  }

  public addToCart(userId: number, productId: number, quantity: number = 1) {
    const product = this.getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock <= 0) {
      throw new Error(`Product "${product.name}" is currently out of stock`);
    }

    const existing = this.cartItems.find(it => it.userId === userId && it.productId === productId);
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        throw new Error(`Cannot add more than available stock (${product.stock}) for "${product.name}"`);
      }
      existing.quantity = newQty;
      return existing;
    } else {
      if (quantity > product.stock) {
        throw new Error(`Cannot add more than available stock (${product.stock}) for "${product.name}"`);
      }
      const newItem: CartItem = {
        id: this.nextCartItemId++,
        userId,
        productId,
        quantity,
        addedAt: new Date().toISOString()
      };
      this.cartItems.push(newItem);
      return newItem;
    }
  }

  public bulkAddToCart(userId: number, items: { productId: number; quantity?: number }[]) {
    const added: CartItem[] = [];
    const skipped: { productId: number; reason: string }[] = [];

    for (const item of items) {
      const qty = item.quantity || 1;
      const product = this.getProductById(item.productId);
      if (!product || product.stock <= 0) {
        skipped.push({ productId: item.productId, reason: 'Out of stock or unavailable' });
        continue;
      }
      try {
        const res = this.addToCart(userId, item.productId, qty);
        added.push(res);
      } catch (err: any) {
        skipped.push({ productId: item.productId, reason: err.message });
      }
    }

    return { added, skipped };
  }

  public updateCartItem(userId: number, cartItemId: number, quantity: number) {
    const item = this.cartItems.find(it => it.id === cartItemId && it.userId === userId);
    if (!item) {
      throw new Error('Cart item not found');
    }

    if (quantity <= 0) {
      this.cartItems = this.cartItems.filter(it => it.id !== cartItemId);
      return null;
    }

    const product = this.getProductById(item.productId);
    if (!product) {
      throw new Error('Associated product not found');
    }

    if (quantity > product.stock) {
      throw new Error(`Cannot set quantity higher than available stock (${product.stock})`);
    }

    item.quantity = quantity;
    return item;
  }

  public removeCartItem(userId: number, cartItemId: number): boolean {
    const prev = this.cartItems.length;
    this.cartItems = this.cartItems.filter(it => !(it.id === cartItemId && it.userId === userId));
    return this.cartItems.length < prev;
  }

  public clearCart(userId: number) {
    this.cartItems = this.cartItems.filter(it => it.userId !== userId);
  }

  // --- Order Processing Methods ---
  public placeOrder(
    userId: number,
    pickupLocation: string,
    paymentMethod: string
  ): Order {
    const userCart = this.getCart(userId);
    if (!userCart.items || userCart.items.length === 0) {
      throw new Error('Cart is empty. Cannot place an empty order.');
    }

    // Validate stock and recompute real backend total
    let computedTotal = 0;
    const orderItems: OrderItem[] = [];

    for (const cartEntry of userCart.items) {
      if (!cartEntry) continue;
      const product = this.getProductById(cartEntry.productId);
      if (!product) {
        throw new Error(`Product ID ${cartEntry.productId} is no longer available.`);
      }

      if (product.stock < cartEntry.quantity) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${cartEntry.quantity}`);
      }

      const itemTotal = product.price * cartEntry.quantity;
      computedTotal += itemTotal;

      orderItems.push({
        id: Math.floor(Math.random() * 100000),
        orderId: 0,
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: cartEntry.quantity,
        subtotal: itemTotal,
        imageUrl: product.imageUrl
      });
    }

    // Deduct stock for all items
    for (const item of orderItems) {
      const product = this.getProductById(item.productId)!;
      product.stock -= item.quantity;
    }

    // Generate Order ID format: PM-2026-XXXX
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `PM-2026-${randomDigits}`;

    const newOrder: Order = {
      id: this.nextOrderId++,
      orderNumber,
      userId,
      total: computedTotal,
      pickupLocation: pickupLocation || 'Library',
      paymentMethod: paymentMethod || 'Cash on Pickup',
      status: 'PLACED',
      createdAt: new Date().toISOString(),
      items: orderItems
    };

    // Link order items with orderId
    newOrder.items.forEach(it => it.orderId = newOrder.id);

    this.orders.unshift(newOrder);

    // Clear cart after successful transaction
    this.clearCart(userId);

    return newOrder;
  }

  public getOrders(userId?: number): Order[] {
    if (userId !== undefined) {
      return this.orders.filter(o => o.userId === userId);
    }
    return this.orders;
  }

  public getOrderById(id: number | string): Order | undefined {
    return this.orders.find(o => o.id === Number(id) || o.orderNumber === id);
  }

  public updateOrderStatus(orderId: number, status: 'PLACED' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED'): Order | undefined {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return undefined;
    order.status = status;
    return order;
  }

  // --- Auth / User Methods ---
  public register(name: string, email: string, password: string): User {
    const existing = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: this.users.length + 1,
      name,
      email: email.toLowerCase(),
      passwordHash: password, // In production Spring Boot this uses BCryptPasswordEncoder
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  public login(email: string, password: string): User {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.passwordHash !== password) {
      throw new Error('Invalid email or password');
    }
    return user;
  }

  public getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }
}

export const store = new InMemoryStore();
