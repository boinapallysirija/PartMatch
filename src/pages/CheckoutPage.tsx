import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { ImageFallback } from '../components/ImageFallback';
import {
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();

  const [pickupLocation, setPickupLocation] = useState('Library');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Pickup');
  const [studentId, setStudentId] = useState('STU-2026-8942');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const total = cart?.total || 0;

  const pickupLocations = [
    {
      id: 'Library',
      name: 'Central Library Desk',
      detail: 'Ground floor lending counter, Open 9:00 AM - 9:00 PM',
      badge: 'Fastest'
    },
    {
      id: 'CSE Department',
      name: 'CSE Department Lab 304',
      detail: 'Hardware IoT Room, Available during college hours',
      badge: 'Near Labs'
    },
    {
      id: 'Main Gate',
      name: 'Campus Main Gate Reception',
      detail: 'Security outpost entrance, 24/7 security handover',
      badge: '24/7 Access'
    },
    {
      id: 'Hostel',
      name: 'Hostel Block B Common Room',
      detail: 'Evening pickup desk (6:00 PM - 10:00 PM)',
      badge: 'Hostelers'
    },
    {
      id: 'Student Activity Centre',
      name: 'Student Activity Centre (SAC)',
      detail: 'Robotics Club Desk, 1st Floor',
      badge: 'Club Hub'
    },
  ];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await orderService.createOrder(pickupLocation, paymentMethod);
      await refreshCart();
      // Navigate to order confirmation
      navigate(`/orders/${response.order.orderNumber || response.order.id}`, {
        state: { newOrder: response.order }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please check component availability.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm p-4 mx-auto" style={{ maxWidth: '480px' }}>
          <ShoppingBag size={40} className="text-secondary mx-auto mb-3" />
          <h4 className="fw-bold">No items to checkout</h4>
          <p className="text-secondary small mb-3">Add components to your cart before proceeding.</p>
          <Link to="/products" className="btn btn-primary rounded-pill">
            Explore Components
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <div className="mb-3">
        <Link to="/cart" className="btn btn-link text-decoration-none text-secondary p-0 d-inline-flex align-items-center gap-1 small">
          <ArrowLeft size={16} />
          <span>Back to Shopping Cart</span>
        </Link>
      </div>

      <h2 className="fw-bold text-dark mb-1">Campus Checkout</h2>
      <p className="text-secondary small mb-4">
        Review your order and select your preferred on-campus handover location.
      </p>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="row g-4">
          {/* Left Column: Pickup and Payment Options */}
          <div className="col-lg-7">
            {/* 1. Pickup Location Selector */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2 pb-2 border-bottom">
                <MapPin size={20} className="text-primary" />
                <span>1. Select Campus Pickup Hub</span>
              </h5>

              <div className="d-flex flex-column gap-2">
                {pickupLocations.map((loc) => {
                  const isSelected = pickupLocation === loc.id;
                  return (
                    <div
                      key={loc.id}
                      onClick={() => setPickupLocation(loc.id)}
                      className={`p-3 rounded-3 border transition-all cursor-pointer d-flex justify-content-between align-items-center ${
                        isSelected
                          ? 'border-primary bg-primary bg-opacity-10 shadow-sm'
                          : 'border-light bg-light hover-bg-white'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <input
                          type="radio"
                          className="form-check-input mt-1"
                          name="pickupRadio"
                          checked={isSelected}
                          onChange={() => setPickupLocation(loc.id)}
                        />
                        <div>
                          <div className="fw-bold text-dark small">{loc.name}</div>
                          <div className="text-secondary small" style={{ fontSize: '12px' }}>
                            {loc.detail}
                          </div>
                        </div>
                      </div>
                      <span className="badge bg-secondary bg-opacity-25 text-dark small" style={{ fontSize: '11px' }}>
                        {loc.badge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2 pb-2 border-bottom">
                <Banknote size={20} className="text-success" />
                <span>2. Payment Option</span>
              </h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <div
                    onClick={() => setPaymentMethod('Cash on Pickup')}
                    className={`p-3 rounded-3 border h-100 cursor-pointer ${
                      paymentMethod === 'Cash on Pickup'
                        ? 'border-success bg-success bg-opacity-10 shadow-sm'
                        : 'border-light bg-light'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <input
                        type="radio"
                        className="form-check-input m-0"
                        name="paymentRadio"
                        checked={paymentMethod === 'Cash on Pickup'}
                        onChange={() => setPaymentMethod('Cash on Pickup')}
                      />
                      <Banknote size={18} className="text-success" />
                      <span className="fw-bold text-dark small">Cash on Pickup</span>
                    </div>
                    <p className="text-secondary small mb-0" style={{ fontSize: '12px' }}>
                      Inspect components at the pickup counter and pay via UPI or cash upon testing.
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    onClick={() => setPaymentMethod('Demo Payment')}
                    className={`p-3 rounded-3 border h-100 cursor-pointer ${
                      paymentMethod === 'Demo Payment'
                        ? 'border-primary bg-primary bg-opacity-10 shadow-sm'
                        : 'border-light bg-light'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <input
                        type="radio"
                        className="form-check-input m-0"
                        name="paymentRadio"
                        checked={paymentMethod === 'Demo Payment'}
                        onChange={() => setPaymentMethod('Demo Payment')}
                      />
                      <CreditCard size={18} className="text-primary" />
                      <span className="fw-bold text-dark small">Demo Payment (Instant)</span>
                    </div>
                    <p className="text-secondary small mb-0" style={{ fontSize: '12px' }}>
                      Pre-authorized student sandbox wallet. Instant clearance for demo evaluation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Student Identification */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">3. Pickup Verification</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Student Roll / ID No.</label>
                  <input
                    type="text"
                    className="form-control"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Registered Email</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={user?.email || 'student@partmatch.com'}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Confirmation Summary */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '80px' }}>
              <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">Items in Order</h5>

              {/* Items List */}
              <div className="overflow-auto pe-1 mb-3" style={{ maxHeight: '260px' }}>
                <div className="d-flex flex-column gap-2">
                  {items.map((it) => (
                    <div key={it.id} className="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light">
                      <div className="d-flex align-items-center gap-2 text-truncate me-2">
                        <div className="rounded overflow-hidden flex-shrink-0" style={{ width: '36px', height: '36px' }}>
                          <ImageFallback
                            src={it.product.imageUrl}
                            alt={it.product.name}
                            className="w-100 h-100 object-fit-cover"
                            fallbackCategory={it.product.category}
                          />
                        </div>
                        <div className="text-truncate">
                          <div className="small fw-semibold text-dark text-truncate" style={{ maxWidth: '180px' }}>
                            {it.product.name}
                          </div>
                          <div className="text-muted" style={{ fontSize: '11px' }}>
                            Qty: {it.quantity} × ₹{it.product.price}
                          </div>
                        </div>
                      </div>
                      <span className="fw-bold text-dark small">₹{it.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="d-flex justify-content-between text-secondary small mb-2">
                <span>Items Subtotal:</span>
                <span className="fw-semibold text-dark">₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between text-secondary small mb-3">
                <span>Campus Logistics / Handover:</span>
                <span className="text-success fw-semibold">FREE (₹0)</span>
              </div>

              <div className="pt-3 border-top d-flex justify-content-between align-items-baseline mb-4">
                <span className="fw-bold text-dark fs-5">Total to Pay:</span>
                <span className="display-6 fw-bold text-primary">₹{total}</span>
              </div>

              <div className="badge bg-light text-secondary border p-2 text-start mb-4 d-flex align-items-center gap-2">
                <ShieldCheck size={18} className="text-success" />
                <span style={{ fontSize: '11px' }}>
                  Backend live calculates prices from database. Stock is decremented on confirmation.
                </span>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 shadow"
                disabled={isSubmitting}
                id="btn-place-order"
              >
                <CheckCircle2 size={20} />
                <span>{isSubmitting ? 'Verifying Stock & Placing...' : 'Place Order Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
