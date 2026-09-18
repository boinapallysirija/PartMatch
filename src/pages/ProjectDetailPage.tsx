import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';
import { Project, ProjectComponentRelation } from '../types';
import { ImageFallback } from '../components/ImageFallback';
import { useCart } from '../context/CartContext';
import {
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  PackageCheck,
  PackagePlus,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { bulkAddToCart, loading: cartLoading } = useCart();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set of owned product IDs
  const [ownedProductIds, setOwnedProductIds] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await projectService.getProjectById(Number(id));
        setProject(data);

        // Pre-populate owned from query param if available (e.g. ?owned=1)
        const ownedParam = searchParams.get('owned');
        if (ownedParam) {
          const ownedIds = ownedParam.split(',').map(Number).filter(n => !isNaN(n));
          setOwnedProductIds(new Set(ownedIds));
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load project requirements');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id, searchParams]);

  // Toggle owned status for a component
  const toggleOwned = (productId: number) => {
    setOwnedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const components = project?.components || [];
  const totalRequired = components.length;

  const ownedComponents = components.filter((c) => ownedProductIds.has(c.productId));
  const missingComponents = components.filter((c) => !ownedProductIds.has(c.productId));

  const alreadyHaveCount = ownedComponents.length;
  const missingCount = missingComponents.length;

  const missingComponentsCost = missingComponents.reduce(
    (sum, c) => sum + c.product.price * c.quantityRequired,
    0
  );

  const completeBundleCost = components.reduce(
    (sum, c) => sum + c.product.price * c.quantityRequired,
    0
  );

  // Add only missing components to cart
  const handleAddMissingToCart = async () => {
    if (missingComponents.length === 0) return;
    setIsProcessing(true);
    try {
      const itemsToAdd = missingComponents
        .filter(c => c.product.stock > 0)
        .map(c => ({
          productId: c.productId,
          quantity: c.quantityRequired || 1
        }));

      if (itemsToAdd.length === 0) {
        alert('All missing components are currently out of stock.');
        return;
      }

      await bulkAddToCart(itemsToAdd);
      navigate('/cart');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Buy Complete Project Kit
  const handleBuyCompleteKit = async () => {
    if (components.length === 0) return;
    setIsProcessing(true);
    try {
      const itemsToAdd = components
        .filter(c => c.product.stock > 0)
        .map(c => ({
          productId: c.productId,
          quantity: c.quantityRequired || 1
        }));

      await bulkAddToCart(itemsToAdd);
      navigate('/cart');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading project blueprint...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm p-4 text-center mx-auto" style={{ maxWidth: '500px' }}>
          <AlertCircle className="text-danger mx-auto mb-3" size={48} />
          <h4 className="fw-bold">Project Blueprint Not Found</h4>
          <p className="text-secondary small mb-4">{error || 'This project does not exist.'}</p>
          <Link to="/projects" className="btn btn-primary rounded-pill">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const completionPercent = totalRequired > 0 ? Math.round((alreadyHaveCount / totalRequired) * 100) : 0;

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <div className="mb-3">
        <Link to="/projects" className="btn btn-link text-decoration-none text-secondary p-0 d-inline-flex align-items-center gap-1 small">
          <ArrowLeft size={16} />
          <span>Back to Projects Catalogue</span>
        </Link>
      </div>

      {/* Project Header Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
        <div className="row g-0">
          <div className="col-lg-5 position-relative" style={{ minHeight: '260px' }}>
            <ImageFallback
              src={project.imageUrl}
              alt={project.name}
              className="w-100 h-100 object-fit-cover"
              fallbackCategory={project.category}
            />
            <div className="position-absolute top-0 start-0 m-3">
              <span className="badge bg-dark bg-opacity-80 text-white rounded-pill px-3 py-1">
                {project.category}
              </span>
            </div>
          </div>

          <div className="col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 fw-semibold">
                  {project.difficulty} Level
                </span>
                <span className="badge bg-light text-secondary border px-2 py-1 d-inline-flex align-items-center gap-1">
                  <Clock size={12} />
                  <span>{project.estimatedTime} build time</span>
                </span>
              </div>

              <h2 className="fw-bold text-dark mb-2">{project.name}</h2>
              <p className="text-secondary small mb-4" style={{ lineHeight: '1.6' }}>
                {project.description}
              </p>
            </div>

            {/* Smart Matching Overview Box */}
            <div className="p-3 bg-light rounded-3 border">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold text-dark small d-flex align-items-center gap-1">
                  <Sparkles size={16} className="text-warning" />
                  <span>Your Component Progress:</span>
                </span>
                <span className="badge bg-primary rounded-pill">
                  {alreadyHaveCount} / {totalRequired} Components ({completionPercent}%)
                </span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div
                  className={`progress-bar ${
                    completionPercent === 100
                      ? 'bg-success'
                      : completionPercent >= 50
                      ? 'bg-primary'
                      : 'bg-warning'
                  }`}
                  style={{ width: `${completionPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating/Sticky Requirements & Actions Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4 border-start border-4 border-primary">
        <div className="row align-items-center g-3">
          <div className="col-lg-7">
            <div className="row g-2 text-center text-sm-start">
              <div className="col-6 col-sm-3">
                <div className="text-secondary small">Required:</div>
                <div className="fs-5 fw-bold text-dark">{totalRequired} Parts</div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="text-secondary small">Already Have:</div>
                <div className="fs-5 fw-bold text-success">{alreadyHaveCount} Parts</div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="text-secondary small">Missing:</div>
                <div className="fs-5 fw-bold text-danger">{missingCount} Parts</div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="text-secondary small">Missing Cost:</div>
                <div className="fs-5 fw-bold text-primary">₹{missingComponentsCost}</div>
              </div>
            </div>
          </div>

          <div className="col-lg-5 d-flex flex-column flex-sm-row gap-2 justify-content-lg-end">
            <button
              type="button"
              className="btn btn-primary fw-bold px-3 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              onClick={handleAddMissingToCart}
              disabled={missingCount === 0 || isProcessing || cartLoading}
              id="btn-add-missing-cart"
            >
              <PackagePlus size={18} />
              <span>
                {missingCount === 0
                  ? 'All Parts Owned!'
                  : `Add Missing to Cart (₹${missingComponentsCost})`}
              </span>
            </button>

            <button
              type="button"
              className="btn btn-outline-dark fw-semibold px-3 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
              onClick={handleBuyCompleteKit}
              disabled={isProcessing || cartLoading}
              id="btn-buy-complete-kit"
              title="Adds all project components to cart"
            >
              <ShoppingBag size={16} />
              <span>Buy Complete Kit (₹{completeBundleCost})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Component Requirements Checklist */}
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
          <div>
            <h3 className="fw-bold text-dark mb-1">Required Components Checklist</h3>
            <p className="text-secondary small mb-0">
              Check off components you already have. Uncheck any you still need to purchase.
            </p>
          </div>
          <div className="mt-2 mt-md-0 d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill"
              onClick={() => setOwnedProductIds(new Set(components.map(c => c.productId)))}
            >
              Mark All Owned
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill"
              onClick={() => setOwnedProductIds(new Set())}
            >
              Clear Owned
            </button>
          </div>
        </div>

        {/* Components Checklist Table / Cards */}
        <div className="d-flex flex-column gap-3">
          {components.map((item: ProjectComponentRelation) => {
            const isOwned = ownedProductIds.has(item.productId);
            const isOutOfStock = item.product.stock <= 0;

            return (
              <div
                key={item.id}
                className={`card border rounded-3 p-3 transition-all ${
                  isOwned
                    ? 'bg-success bg-opacity-10 border-success border-opacity-50'
                    : isOutOfStock
                    ? 'bg-light border-warning border-opacity-50'
                    : 'bg-white border-light shadow-sm'
                }`}
                id={`project-component-${item.productId}`}
              >
                <div className="row align-items-center g-3">
                  {/* Owned status indicator / Checkbox toggle */}
                  <div className="col-auto">
                    <button
                      type="button"
                      className={`btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center ${
                        isOwned
                          ? 'btn-success text-white'
                          : 'btn-outline-secondary'
                      }`}
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => toggleOwned(item.productId)}
                      title={isOwned ? 'You own this! Click to unmark' : 'Click if you already have this'}
                    >
                      {isOwned ? <CheckCircle2 size={20} /> : <span style={{ fontSize: '18px' }}>□</span>}
                    </button>
                  </div>

                  {/* Component Thumbnail */}
                  <div className="col-auto">
                    <div className="rounded-2 overflow-hidden bg-light" style={{ width: '60px', height: '60px' }}>
                      <ImageFallback
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-100 h-100 object-fit-cover"
                        fallbackCategory={item.product.category}
                      />
                    </div>
                  </div>

                  {/* Component Details */}
                  <div className="col">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <h6 className="fw-bold text-dark mb-0">
                        <Link to={`/products/${item.productId}`} className="text-dark text-decoration-none hover-text-primary">
                          {item.product.name}
                        </Link>
                      </h6>
                      <span className="badge bg-secondary bg-opacity-25 text-dark" style={{ fontSize: '11px' }}>
                        Qty: {item.quantityRequired}
                      </span>
                      <span className="badge bg-light text-secondary border" style={{ fontSize: '11px' }}>
                        {item.product.category}
                      </span>
                    </div>

                    <div className="small text-secondary mt-1">
                      {isOwned ? (
                        <span className="text-success fw-semibold d-inline-flex align-items-center gap-1">
                          <CheckCircle2 size={14} />
                          <span>You already have this component in your inventory.</span>
                        </span>
                      ) : isOutOfStock ? (
                        <span className="text-danger fw-semibold d-inline-flex align-items-center gap-1">
                          <ShieldAlert size={14} />
                          <span>Currently unavailable (out of stock)</span>
                        </span>
                      ) : (
                        <span className="text-secondary">
                          Missing component • {item.product.stock} available on campus
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="col-md-auto text-md-end d-flex align-items-center justify-content-between justify-content-md-end gap-3">
                    <div>
                      <div className="fs-5 fw-bold text-dark">
                        ₹{item.product.price * item.quantityRequired}
                      </div>
                      {item.quantityRequired > 1 && (
                        <div className="small text-muted" style={{ fontSize: '11px' }}>
                          ₹{item.product.price} each
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                        isOwned
                          ? 'btn-outline-success active'
                          : 'btn-outline-primary'
                      }`}
                      onClick={() => toggleOwned(item.productId)}
                    >
                      {isOwned ? '✓ I Have This' : 'Mark as Owned'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-4 p-4 rounded-3 bg-light d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div>
            <h6 className="fw-bold text-dark mb-1">
              Ready to start assembling {project.name}?
            </h6>
            <p className="text-secondary small mb-0">
              Pick up missing components from the CSE Department or Library in 15 minutes.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-lg rounded-pill px-4 fw-bold d-flex align-items-center gap-2 shadow"
            onClick={handleAddMissingToCart}
            disabled={missingCount === 0 || isProcessing || cartLoading}
          >
            <PackagePlus size={20} />
            <span>Add Missing {missingCount} Parts (₹{missingComponentsCost})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
