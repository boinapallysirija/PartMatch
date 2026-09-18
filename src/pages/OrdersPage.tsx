import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';
import { OrderModel } from '../types';
import { ImageFallback } from '../components/ImageFallback';
import {
  PackageCheck,
  Clock,
  MapPin,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCw,
  ShoppingBag
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: number, nextStatus: string) => {
    try {
      await orderService.updateOrderStatus(orderId, nextStatus);
      await fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PLACED':
        return <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-semibold">PLACED</span>;
      case 'READY_FOR_PICKUP':
        return <span className="badge bg-info text-dark px-3 py-1 rounded-pill fw-semibold">READY FOR PICKUP</span>;
      case 'COMPLETED':
        return <span className="badge bg-success px-3 py-1 rounded-pill fw-semibold">COMPLETED</span>;
      default:
        return <span className="badge bg-secondary px-3 py-1 rounded-pill">{status}</span>;
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <PackageCheck className="text-primary" />
            <span>My Campus Orders</span>
          </h2>
          <p className="text-secondary small mb-0">
            Track components reserved for lab projects and pickup verification.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1"
          onClick={fetchOrders}
        >
          <RotateCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading orders...</span>
          </div>
          <p className="text-secondary small mt-2">Fetching your orders from database...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-4 mx-auto" style={{ maxWidth: '520px' }}>
          <ShoppingBag size={48} className="text-secondary mx-auto mb-3" />
          <h4 className="fw-bold text-dark">No Orders Found</h4>
          <p className="text-secondary small mb-4">
            You haven't placed any orders yet. Use the Smart Match tool or explore the catalogue to reserve project parts!
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/match" className="btn btn-warning text-dark fw-bold rounded-pill px-4">
              Try Smart Match
            </Link>
            <Link to="/products" className="btn btn-outline-primary rounded-pill px-4">
              Browse Components
            </Link>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div key={order.id} className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white" id={`order-card-${order.id}`}>
              {/* Order Header */}
              <div className="card-header bg-light border-bottom p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <span className="text-secondary small">Order ID: </span>
                    <strong className="font-monospace text-dark fs-6">{order.orderNumber}</strong>
                  </div>
                  <span className="text-muted small">•</span>
                  <div className="text-secondary small d-flex align-items-center gap-1">
                    <Clock size={14} />
                    <span>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Order Body */}
              <div className="card-body p-4">
                <div className="row g-4">
                  {/* Left: Products List */}
                  <div className="col-lg-7 border-end-lg">
                    <h6 className="fw-bold text-dark mb-3">Components in this Order ({order.items?.length || 0}):</h6>
                    <div className="d-flex flex-column gap-3">
                      {order.items?.map((item) => (
                        <div key={item.id} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light">
                          <div className="d-flex align-items-center gap-3 text-truncate">
                            <div className="rounded overflow-hidden bg-white flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                              <ImageFallback
                                src={item.imageUrl}
                                alt={item.productName}
                                className="w-100 h-100 object-fit-cover"
                              />
                            </div>
                            <div className="text-truncate">
                              <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '240px' }}>
                                {item.productName}
                              </div>
                              <div className="text-muted small">
                                Qty: {item.quantity} × ₹{item.price}
                              </div>
                            </div>
                          </div>
                          <div className="fw-bold text-dark ps-2">
                            ₹{item.subtotal}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Pickup details, payment, & status simulator */}
                  <div className="col-lg-5 d-flex flex-column justify-content-between">
                    <div>
                      <h6 className="fw-bold text-dark mb-3">Handover & Billing Details</h6>

                      <div className="p-3 bg-light rounded-3 mb-3 border">
                        <div className="d-flex align-items-center gap-2 small text-dark mb-2">
                          <MapPin size={16} className="text-warning" />
                          <span>Pickup Point: <strong>{order.pickupLocation}</strong></span>
                        </div>

                        <div className="d-flex align-items-center gap-2 small text-dark mb-2">
                          <Banknote size={16} className="text-success" />
                          <span>Payment Method: <strong>{order.paymentMethod}</strong></span>
                        </div>

                        <div className="d-flex justify-content-between align-items-baseline pt-2 border-top">
                          <span className="text-secondary small">Total Amount:</span>
                          <span className="fs-5 fw-bold text-primary">₹{order.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Judge/Demo Status Lifecycle Simulator */}
                    <div className="p-3 rounded-3 bg-light border border-info border-opacity-25">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small fw-semibold text-dark">Simulate Order Lifecycle:</span>
                      </div>
                      <div className="btn-group w-100 btn-group-sm" role="group">
                        <button
                          type="button"
                          className={`btn ${order.status === 'PLACED' ? 'btn-warning text-dark active fw-bold' : 'btn-outline-secondary'}`}
                          onClick={() => handleUpdateStatus(order.id, 'PLACED')}
                        >
                          PLACED
                        </button>
                        <button
                          type="button"
                          className={`btn ${order.status === 'READY_FOR_PICKUP' ? 'btn-info text-dark active fw-bold' : 'btn-outline-secondary'}`}
                          onClick={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                        >
                          READY
                        </button>
                        <button
                          type="button"
                          className={`btn ${order.status === 'COMPLETED' ? 'btn-success active fw-bold' : 'btn-outline-secondary'}`}
                          onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                        >
                          COMPLETED
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
