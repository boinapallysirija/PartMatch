import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { store } from './server/store.js';

const appDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Helper to extract or fallback user
  const getRequestUserId = (req: express.Request): number => {
    const headerUserId = req.headers['x-user-id'];
    if (headerUserId) {
      const parsed = parseInt(String(headerUserId), 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 1; // Default demo student
  };

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'PartMatch Backend API', timestamp: new Date().toISOString() });
  });

  // Reset database seed (for clean demo resets)
  app.post('/api/reset', (req, res) => {
    store.seed();
    res.json({ success: true, message: 'Database reset to initial sample state' });
  });

  // 1. Auth Endpoints
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }
      const user = store.register(name, email, password);
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        token: `demo-token-${user.id}`
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      const user = store.login(email, password);
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: `demo-token-${user.id}`
      });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  });

  app.get('/api/auth/profile', (req, res) => {
    const userId = getRequestUserId(req);
    const user = store.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // 2. Product Endpoints
  app.get('/api/products', (req, res) => {
    try {
      const { search, category, condition, productType, minPrice, maxPrice, inStock, sort, sellerId } = req.query;
      const products = store.getProducts({
        search: search as string,
        category: category as string,
        condition: condition as string,
        productType: productType as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        inStock: inStock === 'true',
        sort: sort as string,
        sellerId: sellerId ? Number(sellerId) : undefined
      });
      res.json(products);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const product = store.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: `Product with ID ${id} not found` });
    }

    // Include projects that use this component
    const usedInProjects = store.getProjectsByComponent(id);

    res.json({
      ...product,
      usedInProjects: usedInProjects.map(u => ({
        ...u.project,
        quantityRequired: u.quantityRequired,
        totalComponentsCount: u.totalComponentsCount
      }))
    });
  });

  app.post('/api/products', (req, res) => {
    try {
      const userId = getRequestUserId(req);
      const user = store.getUserById(userId) || { name: 'Demo Student' };

      const {
        name,
        description,
        price,
        originalPrice,
        category,
        condition,
        productType,
        imageUrl,
        stock,
        brand,
        compatibility
      } = req.body;

      if (!name || price === undefined || !category) {
        return res.status(400).json({ error: 'Product name, price, and category are required' });
      }

      const newProduct = store.createProduct({
        name,
        description: description || 'No description provided.',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.25),
        category,
        condition: condition || 'Good',
        productType: productType || 'Hardware',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        sellerName: user.name,
        sellerId: userId,
        stock: stock !== undefined ? Number(stock) : 1,
        brand: brand || 'Generic / DIY',
        compatibility: compatibility || 'Universal / Arduino / Raspberry Pi'
      });

      res.status(201).json(newProduct);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const updated = store.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  });

  app.delete('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const deleted = store.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  });

  // 3. Project Endpoints
  app.get('/api/projects', (req, res) => {
    const { category, difficulty, search } = req.query;
    const projects = store.getProjects({
      category: category as string,
      difficulty: difficulty as string,
      search: search as string
    });

    // Hydrate project component count
    const enriched = projects.map(p => {
      const components = store.getProjectComponents(p.id);
      return {
        ...p,
        componentCount: components.length,
        components: components.map(c => ({
          id: c.id,
          productId: c.productId,
          productName: c.product.name,
          price: c.product.price,
          quantityRequired: c.quantityRequired
        }))
      };
    });

    res.json(enriched);
  });

  app.get('/api/projects/by-component', (req, res) => {
    const productId = Number(req.query.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Valid productId query parameter required' });
    }

    const matches = store.getProjectsByComponent(productId);
    res.json(matches.map(m => ({
      ...m.project,
      quantityRequired: m.quantityRequired,
      totalComponentsCount: m.totalComponentsCount
    })));
  });

  app.get('/api/projects/:id', (req, res) => {
    const id = Number(req.params.id);
    const project = store.getProjectById(id);
    if (!project) {
      return res.status(404).json({ error: `Project with ID ${id} not found` });
    }

    const components = store.getProjectComponents(id);
    const totalBundleCost = components.reduce((sum, item) => sum + (item.product.price * item.quantityRequired), 0);
    const allAvailable = components.every(item => item.product.stock >= item.quantityRequired);

    res.json({
      ...project,
      totalComponents: components.length,
      totalBundleCost,
      allAvailable,
      components: components.map(c => ({
        id: c.id,
        productId: c.productId,
        quantityRequired: c.quantityRequired,
        product: c.product
      }))
    });
  });

  app.get('/api/projects/:id/components', (req, res) => {
    const id = Number(req.params.id);
    const components = store.getProjectComponents(id);
    res.json(components);
  });

  // 4. Smart Matching Engine
  app.post('/api/match', (req, res) => {
    const { productIds } = req.body;
    if (!Array.isArray(productIds)) {
      return res.status(400).json({ error: 'productIds array is required' });
    }

    const numericIds = productIds.map(Number).filter(n => !isNaN(n));
    const results = store.matchProjects(numericIds);
    res.json(results);
  });

  // 5. Cart Endpoints
  app.get('/api/cart', (req, res) => {
    const userId = getRequestUserId(req);
    const cart = store.getCart(userId);
    res.json(cart);
  });

  app.post('/api/cart/items', (req, res) => {
    try {
      const userId = getRequestUserId(req);
      const { productId, quantity = 1 } = req.body;
      if (!productId) {
        return res.status(400).json({ error: 'productId is required' });
      }

      const item = store.addToCart(userId, Number(productId), Number(quantity));
      const updatedCart = store.getCart(userId);
      res.status(201).json({ message: 'Item added to cart', item, cart: updatedCart });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Bulk add for missing components / complete project kits
  app.post('/api/cart/bulk', (req, res) => {
    try {
      const userId = getRequestUserId(req);
      const { items } = req.body; // array of { productId, quantity }
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'items array is required' });
      }

      const result = store.bulkAddToCart(userId, items);
      const updatedCart = store.getCart(userId);
      res.status(201).json({
        message: `Added ${result.added.length} items to cart.`,
        addedCount: result.added.length,
        skipped: result.skipped,
        cart: updatedCart
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/cart/items/:id', (req, res) => {
    try {
      const userId = getRequestUserId(req);
      const cartItemId = Number(req.params.id);
      const { quantity } = req.body;

      if (quantity === undefined) {
        return res.status(400).json({ error: 'quantity is required' });
      }

      store.updateCartItem(userId, cartItemId, Number(quantity));
      const updatedCart = store.getCart(userId);
      res.json(updatedCart);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/cart/items/:id', (req, res) => {
    const userId = getRequestUserId(req);
    const cartItemId = Number(req.params.id);
    const removed = store.removeCartItem(userId, cartItemId);
    const updatedCart = store.getCart(userId);
    res.json({ success: removed, cart: updatedCart });
  });

  app.delete('/api/cart/clear', (req, res) => {
    const userId = getRequestUserId(req);
    store.clearCart(userId);
    res.json({ success: true, message: 'Cart cleared' });
  });

  // 6. Order Processing
  app.post('/api/orders', (req, res) => {
    try {
      const userId = getRequestUserId(req);
      const { pickupLocation, paymentMethod } = req.body;

      // Backend recalculates total and validates stock securely
      const order = store.placeOrder(
        userId,
        pickupLocation || 'Library',
        paymentMethod || 'Cash on Pickup'
      );

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/orders', (req, res) => {
    const userId = getRequestUserId(req);
    const orders = store.getOrders(userId);
    res.json(orders);
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = store.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  app.put('/api/orders/:id/status', (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;
    const updated = store.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  });

  // 7. Seller's Listed Products
  app.get('/api/user/products', (req, res) => {
    const userId = getRequestUserId(req);
    const products = store.getProducts({ sellerId: userId });
    res.json(products);
  });

  // --- Vite Dev & Production Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PartMatch] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
