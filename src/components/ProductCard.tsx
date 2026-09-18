import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ImageFallback } from './ImageFallback';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Check, Layers } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdded?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdded }) => {
  const { addToCart, loading } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      if (onAdded) onAdded();
    } catch {
      // toast handled in context
    } finally {
      setIsAdding(false);
    }
  };

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const conditionColors: Record<string, string> = {
    'New': 'bg-success',
    'Like New': 'bg-primary',
    'Good': 'bg-info text-dark',
    'Fair': 'bg-warning text-dark'
  };

  return (
    <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden bg-white hover-shadow transition-all d-flex flex-column" id={`product-card-${product.id}`}>
      {/* Image container */}
      <div className="position-relative overflow-hidden bg-light" style={{ height: '190px' }}>
        <Link to={`/products/${product.id}`} className="d-block w-100 h-100">
          <ImageFallback
            src={product.imageUrl}
            alt={product.name}
            className="w-100 h-100 object-fit-cover transition-transform"
            fallbackCategory={product.category}
          />
        </Link>
        {/* Badges on image */}
        <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">
          <span className={`badge ${conditionColors[product.condition] || 'bg-secondary'} rounded-pill shadow-sm`} style={{ fontSize: '11px' }}>
            {product.condition}
          </span>
          {discountPercent > 0 && (
            <span className="badge bg-danger rounded-pill shadow-sm" style={{ fontSize: '10px' }}>
              {discountPercent}% OFF
            </span>
          )}
        </div>
        <div className="position-absolute bottom-0 end-0 m-2">
          <span className="badge bg-dark bg-opacity-75 text-white rounded-pill px-2 py-1" style={{ fontSize: '10px' }}>
            {product.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="card-body p-3 d-flex flex-column flex-grow-1">
        <div className="text-secondary small fw-medium mb-1 d-flex justify-content-between align-items-center">
          <span>{product.brand || 'Component'}</span>
          {product.stock > 0 ? (
            <span className="text-success small fw-semibold">● {product.stock} in stock</span>
          ) : (
            <span className="text-danger small fw-semibold">✕ Out of stock</span>
          )}
        </div>

        <h6 className="card-title fw-bold mb-1 line-clamp-2">
          <Link to={`/products/${product.id}`} className="text-dark text-decoration-none hover-text-primary">
            {product.name}
          </Link>
        </h6>

        {/* Compatibility hint */}
        {product.compatibility && (
          <div className="small text-muted text-truncate mb-2" style={{ fontSize: '12px' }} title={product.compatibility}>
            🔧 {product.compatibility}
          </div>
        )}

        {/* Price row */}
        <div className="mt-auto pt-2 border-top border-light d-flex align-items-baseline justify-content-between">
          <div>
            <span className="fs-5 fw-bold text-dark">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-muted text-decoration-line-through small ms-2">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="d-grid gap-2 mt-3 pt-1">
          <div className="d-flex gap-2">
            <Link
              to={`/products/${product.id}`}
              className="btn btn-outline-secondary btn-sm flex-grow-1 rounded-2 fw-medium"
              id={`view-btn-${product.id}`}
            >
              Details
            </Link>
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-2 d-flex align-items-center justify-content-center px-3"
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || isAdding || loading}
              id={`add-cart-btn-${product.id}`}
              title={product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
            >
              <ShoppingBag size={15} className="me-1" />
              <span>{product.stock <= 0 ? 'Out' : isAdding ? 'Adding...' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
