import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { orderService } from '../services/api';
import { OrderModel } from '../types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  MapPin,
  Banknote,
  Clock,
  ArrowRight,
  PackageCheck,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<OrderModel | null>(
    (location.state as any)?.newOrder || null
  );
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if canvas not supported
    }

    if (!order && id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const data = await orderService.getOrderById(id);
          setOrder(data);
        } catch (err) {
          console.error('Failed to load order:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading order receipt...</span>
        </div>
      </div>
    );
  }

  const orderIdText = order?.orderNumber || (id ? `PM-2026-${id}` : 'PM-2026-8924');
  const pickupText = order?.pickupLocation || 'Central Library';
  const paymentText = order?.paymentMethod || 'Cash on Pickup';
  const totalText = order?.total ? `₹${order.total}` : '₹610';
  const statusText = order?.status || 'PLACED';

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white mx-auto text-center" style={{ maxWidth: '640px' }}>
        {/* Success Icon */}
        <div
          className="rounded-circle bg-success bg-opacity-10 text-success p-3 mx-auto mb-3 d-flex align-items-center justify-content-center"
          style={{ width: '80px', height: '80px' }}
        >
          <CheckCircle2 size={48} />
        </div>

        <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-25 px-3 py-1 rounded-pill fw-bold small mb-2">
          ORDER CONFIRMED
        </span>

        <h2 className="fw-extrabold text-dark mb-2">🎉 Order Placed Successfully!</h2>
        <p className="text-secondary small mb-4">
          Your component reservations have been transmitted to the campus pickup counter.
        </p>

        {/* Receipt Box */}
        <div className="p-4 bg-light rounded-4 text-start mb-4 border">
          <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
            <div>
              <div className="text-secondary small">Order ID:</div>
              <div className="fs-5 fw-bold font-monospace text-dark">{orderIdText}</div>
            </div>
            <span className="badge bg-primary px-3 py-2 rounded-pill fw-semibold">
              {statusText}
            </span>
          </div>

          <div className="row g-3">
            <div className="col-sm-6">
              <div className="text-secondary small d-flex align-items-center gap-1 mb-1">
                <MapPin size={14} className="text-warning" />
                <span>Pickup Hub:</span>
              </div>
              <div className="fw-bold text-dark">{pickupText}</div>
            </div>

            <div className="col-sm-6">
              <div className="text-secondary small d-flex align-items-center gap-1 mb-1">
                <Banknote size={14} className="text-success" />
                <span>Payment Method:</span>
              </div>
              <div className="fw-bold text-dark">{paymentText}</div>
            </div>

            <div className="col-sm-6">
              <div className="text-secondary small d-flex align-items-center gap-1 mb-1">
                <Clock size={14} className="text-info" />
                <span>Estimated Ready:</span>
              </div>
              <div className="fw-bold text-dark">Within 15 Minutes</div>
            </div>

            <div className="col-sm-6">
              <div className="text-secondary small mb-1">Total Amount:</div>
              <div className="fs-5 fw-bold text-primary">{totalText}</div>
            </div>
          </div>

          {/* Reserved items preview */}
          {order?.items && order.items.length > 0 && (
            <div className="mt-3 pt-3 border-top">
              <div className="small fw-semibold text-secondary mb-2">Reserved Components ({order.items.length}):</div>
              <div className="d-flex flex-column gap-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="d-flex justify-content-between small text-dark">
                    <span>• {item.productName} (x{item.quantity})</span>
                    <span className="fw-semibold">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
          <Link to="/orders" className="btn btn-primary btn-lg rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2">
            <PackageCheck size={20} />
            <span>View My Orders</span>
          </Link>
          <Link to="/projects" className="btn btn-outline-secondary btn-lg rounded-pill px-4 fw-medium">
            Browse More Projects
          </Link>
        </div>
      </div>
    </div>
  );
};
