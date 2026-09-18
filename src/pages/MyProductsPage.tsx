import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import { Product } from '../types';
import { ImageFallback } from '../components/ImageFallback';
import {
  Package,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Tag
} from 'lucide-react';

export const MyProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getUserProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load user listed products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this component listing?')) return;
    try {
      await productService.deleteProduct(id);
      await fetchMyProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete listing');
    }
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod);
    setEditPrice(prod.price);
    setEditStock(prod.stock);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    try {
      await productService.updateProduct(editingProduct.id, {
        price: editPrice,
        stock: editStock
      });
      setEditingProduct(null);
      await fetchMyProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to update product');
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <Package className="text-primary" />
            <span>My Listed Components</span>
          </h2>
          <p className="text-secondary small mb-0">
            Manage electronic parts and lab modules you have published on the PartMatch marketplace.
          </p>
        </div>
        <Link to="/sell" className="btn btn-warning text-dark fw-bold rounded-pill px-4 mt-3 mt-md-0 d-flex align-items-center gap-2 shadow-sm">
          <PlusCircle size={18} />
          <span>List New Component</span>
        </Link>
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
            <span className="visually-hidden">Loading your listings...</span>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-4 mx-auto" style={{ maxWidth: '520px' }}>
          <Package size={48} className="text-secondary mx-auto mb-3" />
          <h4 className="fw-bold text-dark">No Listings Yet</h4>
          <p className="text-secondary small mb-4">
            Have surplus sensors, motors, or breadboards from earlier semester labs? List them now to help other students!
          </p>
          <Link to="/sell" className="btn btn-warning text-dark fw-bold rounded-pill px-4 mx-auto">
            List Your First Component
          </Link>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light small text-secondary">
                <tr>
                  <th scope="col" style={{ width: '40%' }}>Component</th>
                  <th scope="col">Price</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Condition</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id} id={`my-product-${prod.id}`}>
                    <td>
                      <div className="d-flex align-items-center gap-3 py-2">
                        <div className="rounded-3 overflow-hidden bg-light flex-shrink-0" style={{ width: '52px', height: '52px' }}>
                          <ImageFallback
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-100 h-100 object-fit-cover"
                            fallbackCategory={prod.category}
                          />
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark mb-0">
                            <Link to={`/products/${prod.id}`} className="text-dark text-decoration-none hover-text-primary">
                              {prod.name}
                            </Link>
                          </h6>
                          <span className="badge bg-light text-secondary border" style={{ fontSize: '10px' }}>
                            {prod.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="fw-bold text-dark">₹{prod.price}</span>
                    </td>

                    <td>
                      <span className={`badge ${prod.stock > 0 ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-25' : 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25'}`}>
                        {prod.stock} units
                      </span>
                    </td>

                    <td>
                      <span className="badge bg-secondary bg-opacity-25 text-dark">
                        {prod.condition}
                      </span>
                    </td>

                    <td>
                      <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25">
                        Active Listing
                      </span>
                    </td>

                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm rounded-2 d-flex align-items-center gap-1"
                          onClick={() => handleStartEdit(prod)}
                          title="Edit price/stock"
                        >
                          <Edit2 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm rounded-2 d-flex align-items-center gap-1"
                          onClick={() => handleDelete(prod.id)}
                          title="Delete listing"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">
                  Edit Listing: {editingProduct.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingProduct(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Price (₹)</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Stock Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editStock}
                    onChange={(e) => setEditStock(Number(e.target.value))}
                    min="0"
                  />
                </div>
              </div>

              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill fw-semibold px-4"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
