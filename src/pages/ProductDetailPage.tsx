import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { Product } from '../types';
import { ImageFallback } from '../components/ImageFallback';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Zap,
  Layers,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  Tag,
  Cpu
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductById(Number(id));
        setProduct(data);
        setQuantity(1);
      } catch (err: any) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
    } catch {
      // toast is shown
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || product.stock <= 0) return;
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      navigate('/checkout');
    } catch {
      // toast is shown
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading component...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm p-4 text-center mx-auto" style={{ maxWidth: '500px' }}>
          <AlertCircle className="text-danger mx-auto mb-3" size={48} />
          <h4 className="fw-bold">Component Not Found</h4>
          <p className="text-secondary small mb-4">{error || 'This component does not exist or has been removed.'}</p>
          <Link to="/products" className="btn btn-primary rounded-pill">
            Back to Components
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container py-4">
      {/* Breadcrumb / Back button */}
      <div className="mb-3">
        <Link to="/products" className="btn btn-link text-decoration-none text-secondary p-0 d-inline-flex align-items-center gap-1 small">
          <ArrowLeft size={16} />
          <span>Back to Component Catalogue</span>
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-5">
        <div className="row g-0">
          {/* Left: Product Image */}
          <div className="col-lg-6 bg-light p-4 d-flex align-items-center justify-content-center">
            <div className="position-relative w-100 rounded-3 overflow-hidden shadow-sm" style={{ maxHeight: '420px' }}>
              <ImageFallback
                src={product.imageUrl}
                alt={product.name}
                className="w-100 h-100 object-fit-contain"
                style={{ maxHeight: '400px' }}
                fallbackCategory={product.category}
              />
              <div className="position-absolute top-0 start-0 m-3">
                <span className="badge bg-primary px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: '12px' }}>
                  {product.condition} Condition
                </span>
              </div>
            </div>
          </div>

          {/* Right: Product Info & Actions */}
          <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-secondary bg-opacity-25 text-dark px-3 py-1 rounded-pill fw-semibold">
                  {product.category}
                </span>
                {product.stock > 0 ? (
                  <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                    ● In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">
                    ✕ Out of Stock
                  </span>
                )}
              </div>

              <h2 className="fw-bold text-dark mb-2">{product.name}</h2>

              <div className="d-flex align-items-center gap-3 text-secondary small mb-3">
                <span>Brand: <strong className="text-dark">{product.brand || 'Generic'}</strong></span>
                <span>•</span>
                <span>Type: <strong className="text-dark">{product.productType}</strong></span>
                <span>•</span>
                <span>Seller: <strong className="text-dark">{product.sellerName}</strong></span>
              </div>

              {/* Price Row */}
              <div className="d-flex align-items-baseline gap-3 mb-4 p-3 bg-light rounded-3">
                <span className="display-6 fw-bold text-primary">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-muted text-decoration-line-through fs-5">
                      ₹{product.originalPrice}
                    </span>
                    <span className="badge bg-danger rounded-pill px-2 py-1">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <h6 className="fw-bold text-dark mb-2">Description</h6>
              <p className="text-secondary small mb-4" style={{ lineHeight: '1.6' }}>
                {product.description}
              </p>

              {/* Compatibility Information */}
              <div className="p-3 bg-light rounded-3 mb-4 border border-light">
                <div className="d-flex align-items-center gap-2 fw-semibold text-dark small mb-1">
                  <Cpu size={16} className="text-info" />
                  <span>Pinout & Compatibility:</span>
                </div>
                <div className="text-secondary small font-monospace">
                  {product.compatibility}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-top">
              {product.stock > 0 ? (
                <div>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <span className="small fw-semibold text-secondary">Quantity:</span>
                    <div className="input-group input-group-sm" style={{ width: '120px' }}>
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control text-center"
                        value={quantity}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-muted small">Subtotal: ₹{product.price * quantity}</span>
                  </div>

                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      className="btn btn-primary btn-lg flex-grow-1 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                      onClick={handleAddToCart}
                      disabled={isAdding || cartLoading}
                      id="product-detail-add-cart"
                    >
                      <ShoppingBag size={20} />
                      <span>{isAdding ? 'Adding to Cart...' : 'Add to Cart'}</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning btn-lg text-dark flex-grow-1 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-bold"
                      onClick={handleBuyNow}
                      disabled={isAdding || cartLoading}
                      id="product-detail-buy-now"
                    >
                      <Zap size={20} />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning mb-0 text-center small fw-semibold">
                  This component is currently out of stock. Check back soon or browse alternative parts.
                </div>
              )}

              {/* Campus pickup badge */}
              <div className="d-flex align-items-center justify-content-between mt-4 pt-3 border-top text-secondary small">
                <div className="d-flex align-items-center gap-2">
                  <Truck size={16} className="text-success" />
                  <span>Ready for pickup at Central Library or CSE Dept</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <ShieldCheck size={16} className="text-info" />
                  <span>Verified Working Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Used In These Projects Section */}
      {product.usedInProjects && product.usedInProjects.length > 0 && (
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <span className="badge bg-info bg-opacity-10 text-info px-3 py-1 rounded-pill fw-semibold small mb-2">
                PROJECT RECOMMENDATIONS
              </span>
              <h3 className="fw-bold text-dark mb-1">Projects Built With This Component</h3>
              <p className="text-secondary small mb-0">
                You can build these engineering projects using <strong>{product.name}</strong>. Click any project to see missing components!
              </p>
            </div>
            <Link to={`/match?ownedId=${product.id}`} className="btn btn-outline-info btn-sm rounded-pill fw-semibold d-none d-md-inline-block">
              Open in Smart Match Tool
            </Link>
          </div>

          <div className="row g-3">
            {product.usedInProjects.map((proj) => (
              <div key={proj.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border rounded-3 p-3 bg-light hover-shadow transition-all">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span className="fs-3">💡</span>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">
                        <Link to={`/projects/${proj.id}?owned=${product.id}`} className="text-dark text-decoration-none hover-text-primary">
                          {proj.name}
                        </Link>
                      </h6>
                      <span className="badge bg-secondary bg-opacity-25 text-dark small" style={{ fontSize: '10px' }}>
                        {proj.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-secondary small line-clamp-2 mb-3">
                    {proj.description}
                  </p>

                  <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="text-muted small">
                      Requires {proj.quantityRequired || 1}x of this
                    </span>
                    <Link
                      to={`/projects/${proj.id}?owned=${product.id}`}
                      className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold"
                    >
                      View Requirements →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
