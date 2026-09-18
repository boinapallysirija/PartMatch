import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999, maxWidth: '380px', pointerEvents: 'none' }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast show align-items-center text-white border-0 mb-2 shadow-lg ${
            toast.type === 'success'
              ? 'bg-success'
              : toast.type === 'danger'
              ? 'bg-danger'
              : 'bg-primary'
          }`}
          role="alert"
          style={{ pointerEvents: 'auto', borderRadius: '10px' }}
        >
          <div className="d-flex p-2 align-items-center">
            <div className="ps-2 pe-2">
              {toast.type === 'success' && <CheckCircle2 size={20} />}
              {toast.type === 'danger' && <AlertCircle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
            </div>
            <div className="toast-body flex-grow-1 py-1 px-1 fw-medium" style={{ fontSize: '14px' }}>
              {toast.message}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => removeToast(toast.id)}
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
};
