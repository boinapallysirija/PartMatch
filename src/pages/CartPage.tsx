import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ImageFallback } from '../components/ImageFallback';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Sparkles,
  Package
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const total = cart?.total || 0;

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm rounded-4 p-5 bg-white mx-auto" style={{ maxWidth: '540px' }}>
          <div className="rounded-circle bg-light p-4 mx-auto mb-3" style={{ width: 'fit-content' }}>
            <ShoppingBag size={48} className="text-secondary" />
          </div>
          <h3 className="fw-bold text-dark mb-2">Your Cart is Empty</h3>
          <p className="text-secondary small mb-4">
            You don't have any engineering components in your cart yet. Discover what's needed for your project or browse the marketplace catalogue.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/match" className="btn btn-warning text-dark fw-bold rounded-pill px-4 d-flex align-items-center gap-2">
              <Sparkles size={18} />
              <span>Smart Match Tool</span>
            </Link>
            <Link to="/products" className="btn btn-outline-primary rounded-pill px-4">
              Browse Components
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <ShoppingBag className="text-primary" />
            <span>Shopping Cart</span>
          </h2>
          <p className="text-secondary small mb-0">
            {cart?.totalItems} items ready for zero-fee campus pickup
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm rounded-pill d-flex align-items-center gap-1"
          onClick={clearCart}
        >
          <Trash2 size={14} />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="row g-4">
        {/* Cart items list */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-3">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light small text-secondary">
                  <tr>
                    <th scope="col" style={{ width: '45%' }}>Component</th>
                    <th scope="col">Price</th>
                    <th scope="col" style={{ width: '120px' }}>Quantity</th>
                    <th scope="col" className="text-end">Subtotal</th>
                    <th scope="col" className="text-end" style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} id={`cart-item-${item.id}`}>
                      {/* Product details */}
                      <td>
                        <div className="d-flex align-items-center gap-3 py-2">
                          <div className="rounded-3 overflow-hidden bg-light flex-shrink-0" style={{ width: '56px', height: '56px' }}>
                            <ImageFallback
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-100 h-100 object-fit-cover"
                              fallbackCategory={item.product.category}
                            />
                          </div>
                          <div>
                            <h6 className="fw-bold text-dark mb-1">
                              <Link to={`/products/${item.productId}`} className="text-dark text-decoration-none hover-text-primary">
                                {item.product.name}
                              </Link>
                            </h6>
                            <div className="d-flex align-items-center gap-2 small text-muted">
                              <span className="badge bg-secondary bg-opacity-25 text-dark" style={{ fontSize: '10px' }}>
                                {item.product.condition}
                              </span>
                              <span>{item.product.category}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Unit Price */}
                      <td>
                        <span className="fw-semibold text-dark">₹{item.product.price}</span>
                      </td>

                      {/* Quantity Controller */}
                      <td>
                        <div className="input-group input-group-sm" style={{ width: '100px' }}>
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="form-control text-center bg-white"
                            value={item.quantity}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            title={item.quantity >= item.product.stock ? 'Maximum stock reached' : ''}
                          >
                            +
                          </button>
                        </div>
                        {item.quantity >= item.product.stock && (
                          <div className="text-danger small mt-1" style={{ fontSize: '10px' }}>
                            Max stock
                          </div>
                        )}
                      </td>

                      {/* Subtotal */}
                      <td className="text-end">
                        <span className="fw-bold text-primary">₹{item.subtotal}</span>
                      </td>

                      {/* Remove Button */}
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-link text-danger p-1"
                          onClick={() => removeItem(item.id)}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <Link to="/products" className="btn btn-link text-decoration-none text-secondary p-0 d-inline-flex align-items-center gap-1 small">
              <ArrowLeft size={16} />
              <span>Continue Shopping</span>
            </Link>
            <Link to="/match" className="btn btn-link text-decoration-none text-warning p-0 d-inline-flex align-items-center gap-1 small fw-semibold">
              <Sparkles size={16} />
              <span>Check other project matches</span>
            </Link>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '80px' }}>
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">Order Summary</h5>

            <div className="d-flex justify-content-between text-secondary small mb-2">
              <span>Items Total ({cart?.totalItems} items):</span>
              <span className="fw-semibold text-dark">₹{subtotal}</span>
            </div>

            <div className="d-flex justify-content-between text-secondary small mb-3">
              <span>Campus Pickup Service:</span>
              <span className="text-success fw-semibold">FREE (₹0)</span>
            </div>

            <div className="pt-3 border-top d-flex justify-content-between align-items-baseline mb-4">
              <span className="fw-bold text-dark fs-5">Total Amount:</span>
              <span className="display-6 fw-bold text-primary">₹{total}</span>
            </div>

            <div className="p-3 bg-light rounded-3 mb-4 border">
              <div className="d-flex align-items-center gap-2 small text-dark fw-semibold mb-1">
                <MapPin size={16} className="text-warning" />
                <span>Pickup Locations Available:</span>
              </div>
              <p className="text-secondary small mb-0" style={{ fontSize: '12px' }}>
                Select from CSE Dept, Library, Main Gate, Hostel, or SAC at checkout.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg w-100 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 shadow"
              onClick={() => navigate('/checkout')}
              id="btn-proceed-checkout"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
