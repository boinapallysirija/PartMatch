import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService, matchService } from '../services/api';
import { Product, MatchProjectResult } from '../types';
import { ImageFallback } from '../components/ImageFallback';
import { useCart } from '../context/CartContext';
import {
  Sparkles,
  Search,
  Check,
  Plus,
  Trash2,
  Layers,
  ArrowRight,
  PackagePlus,
  CheckCircle2,
  HelpCircle,
  Cpu
} from 'lucide-react';

export const MatchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { bulkAddToCart } = useCart();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [matchResults, setMatchResults] = useState<MatchProjectResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Load initial catalogue
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const prods = await productService.getProducts();
        setAllProducts(prods);

        // Pre-select if param passed (e.g. ?ownedId=1)
        const ownedId = searchParams.get('ownedId');
        if (ownedId) {
          const idNum = Number(ownedId);
          if (!isNaN(idNum)) {
            setSelectedProductIds([idNum]);
            triggerMatch([idNum]);
          }
        }
      } catch (err) {
        console.error('Failed to load components for matcher:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [searchParams]);

  const triggerMatch = async (ids: number[]) => {
    if (ids.length === 0) {
      setMatchResults([]);
      setHasSearched(true);
      return;
    }
    setMatching(true);
    try {
      const results = await matchService.matchByComponents(ids);
      setMatchResults(results);
      setHasSearched(true);
    } catch (err) {
      console.error('Matching failed:', err);
    } finally {
      setMatching(false);
    }
  };

  const handleToggleProduct = (id: number) => {
    let next: number[];
    if (selectedProductIds.includes(id)) {
      next = selectedProductIds.filter(x => x !== id);
    } else {
      next = [...selectedProductIds, id];
    }
    setSelectedProductIds(next);
    triggerMatch(next);
  };

  const handleRemoveProduct = (id: number) => {
    const next = selectedProductIds.filter(x => x !== id);
    setSelectedProductIds(next);
    triggerMatch(next);
  };

  const handleClearAll = () => {
    setSelectedProductIds([]);
    setMatchResults([]);
    setHasSearched(false);
  };

  // Filter components for drawer selection
  const filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      {/* Header Banner */}
      <div
        className="card border-0 rounded-4 text-white p-4 p-md-5 mb-4 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #090d16 0%, #0f172a 60%, #1e1b4b 100%)',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}
      >
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-warning bg-opacity-20 text-warning small fw-bold mb-3" style={{ width: 'fit-content' }}>
          <Sparkles size={14} />
          <span>SMART PROJECT MATCH ENGINE</span>
        </div>
        <h1 className="display-6 fw-bold mb-2">What Do You Already Have?</h1>
        <p className="lead text-light text-opacity-75 mb-0" style={{ maxWidth: '680px', fontSize: '1.05rem' }}>
          Select the components sitting on your lab bench or in your electronics kit. PartMatch cross-references real project schematics and pinouts to reveal everything you can build.
        </p>
      </div>

      <div className="row g-4">
        {/* Left Column: Workshop Inventory Selector */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '80px', zIndex: 10 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <Cpu size={20} className="text-primary" />
                <span>My Workshop Inventory</span>
              </h5>
              {selectedProductIds.length > 0 && (
                <button
                  type="button"
                  className="btn btn-link btn-sm text-danger p-0 text-decoration-none"
                  onClick={handleClearAll}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Currently Selected Chips */}
            <div className="p-3 bg-light rounded-3 mb-3 border min-h-60">
              {selectedProductIds.length === 0 ? (
                <div className="text-secondary small text-center py-2">
                  No components selected yet. Pick from the list below!
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {selectedProductIds.map(id => {
                    const prod = allProducts.find(p => p.id === id);
                    if (!prod) return null;
                    return (
                      <span
                        key={id}
                        className="badge bg-dark text-white rounded-pill px-3 py-2 d-flex align-items-center gap-2 shadow-sm"
                        style={{ fontSize: '12px' }}
                      >
                        <CheckCircle2 size={14} className="text-success" />
                        <span>{prod.name}</span>
                        <button
                          type="button"
                          className="btn-close btn-close-white p-0"
                          style={{ width: '8px', height: '8px' }}
                          onClick={() => handleRemoveProduct(id)}
                        ></button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Search within available components */}
            <div className="mb-3">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-light border-end-0">
                  <Search size={14} className="text-secondary" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search components to add..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  id="match-filter-input"
                />
              </div>
            </div>

            {/* Component Quick Toggle List */}
            <div className="overflow-auto pe-1" style={{ maxHeight: '360px' }}>
              <div className="d-flex flex-column gap-2">
                {filteredProducts.map(product => {
                  const isSelected = selectedProductIds.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleToggleProduct(product.id)}
                      className={`d-flex align-items-center justify-content-between p-2 rounded-3 cursor-pointer border transition-all ${
                        isSelected
                          ? 'bg-primary bg-opacity-10 border-primary text-primary fw-semibold'
                          : 'bg-white border-light hover-bg-light text-dark'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center gap-2 text-truncate">
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center ${
                            isSelected ? 'bg-primary text-white' : 'bg-light text-secondary'
                          }`}
                          style={{ width: '22px', height: '22px', fontSize: '11px', flexShrink: 0 }}
                        >
                          {isSelected ? <Check size={12} /> : <Plus size={12} />}
                        </div>
                        <span className="small text-truncate">{product.name}</span>
                      </div>
                      <span className="badge bg-secondary bg-opacity-25 text-dark small" style={{ fontSize: '10px' }}>
                        {product.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Match trigger button */}
            <button
              type="button"
              className="btn btn-warning btn-lg text-dark fw-bold rounded-3 w-100 mt-4 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              onClick={() => triggerMatch(selectedProductIds)}
              disabled={matching || selectedProductIds.length === 0}
              id="match-trigger-btn"
            >
              <Sparkles size={18} />
              <span>{matching ? 'Analyzing Schematics...' : `Find Projects (${selectedProductIds.length} Parts)`}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Matched Projects Result Feed */}
        <div className="col-lg-7">
          {matching ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <div className="spinner-border text-primary mx-auto mb-3" role="status"></div>
              <h5 className="fw-bold text-dark">Finding Compatible Projects...</h5>
              <p className="text-secondary small mb-0">
                Matching selected components against verified engineering schematics...
              </p>
            </div>
          ) : selectedProductIds.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <div className="rounded-circle bg-light p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                <Sparkles size={40} className="text-warning" />
              </div>
              <h5 className="fw-bold text-dark">Select Your Owned Components</h5>
              <p className="text-secondary small mx-auto mb-4" style={{ maxWidth: '440px' }}>
                Click on the components in the left panel that you already possess (e.g. Arduino UNO, Breadboard, or sensors) to reveal matching projects and missing components.
              </p>
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm rounded-pill px-3"
                  onClick={() => handleToggleProduct(1)}
                >
                  + Arduino UNO
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm rounded-pill px-3"
                  onClick={() => handleToggleProduct(2)}
                >
                  + ESP32
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm rounded-pill px-3"
                  onClick={() => handleToggleProduct(8)}
                >
                  + Breadboard
                </button>
              </div>
            </div>
          ) : matchResults.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <HelpCircle size={40} className="text-secondary mx-auto mb-3" />
              <h5 className="fw-bold text-dark">No Matching Projects Found</h5>
              <p className="text-secondary small mb-0">
                Try selecting a popular development board like Arduino UNO or ESP32.
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-dark mb-0">
                  {matchResults.filter(r => r.matchingCount > 0).length} Compatible Projects
                </h5>
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill small">
                  Sorted by Completion %
                </span>
              </div>

              {matchResults.map((result) => {
                const { project, matchingCount, totalComponents, matchPercentage, missingComponents, missingCost } = result;

                return (
                  <div
                    key={project.id}
                    className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white hover-shadow transition-all"
                    id={`matched-project-${project.id}`}
                  >
                    <div className="row g-0">
                      {/* Thumbnail */}
                      <div className="col-md-4 position-relative bg-light" style={{ minHeight: '180px' }}>
                        <ImageFallback
                          src={project.imageUrl}
                          alt={project.name}
                          className="w-100 h-100 object-fit-cover"
                          fallbackCategory={project.category}
                        />
                        <div className="position-absolute top-0 start-0 m-2">
                          <span className="badge bg-dark bg-opacity-75 text-white rounded-pill" style={{ fontSize: '10px' }}>
                            {project.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="col-md-8 p-4 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="fw-bold text-dark mb-0">
                              <Link
                                to={`/projects/${project.id}?owned=${selectedProductIds.join(',')}`}
                                className="text-dark text-decoration-none hover-text-primary"
                              >
                                {project.name}
                              </Link>
                            </h5>
                            <span className="badge bg-primary rounded-pill px-2 py-1">
                              {matchPercentage}% Match
                            </span>
                          </div>

                          <p className="text-secondary small line-clamp-2 mb-3">
                            {project.description}
                          </p>

                          {/* Match Progress Bar */}
                          <div className="p-2 bg-light rounded-2 border mb-3">
                            <div className="d-flex justify-content-between align-items-center small mb-1">
                              <span className="text-dark fw-semibold">
                                You have {matchingCount} / {totalComponents} components
                              </span>
                              <span className="text-muted small">
                                {totalComponents - matchingCount} Missing
                              </span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                              <div
                                className={`progress-bar ${
                                  matchPercentage >= 75
                                    ? 'bg-success'
                                    : matchPercentage >= 35
                                    ? 'bg-primary'
                                    : 'bg-warning'
                                }`}
                                style={{ width: `${matchPercentage}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Missing Components Quick Preview */}
                          {missingComponents.length > 0 && (
                            <div className="small text-secondary mb-3">
                              <span className="fw-semibold text-dark">Missing parts: </span>
                              {missingComponents.map(m => m.product.name).join(', ')}
                            </div>
                          )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 pt-2 border-top">
                          <div>
                            <span className="text-muted small">Missing Cost: </span>
                            <span className="fw-bold text-dark fs-6">₹{missingCost}</span>
                          </div>

                          <div className="d-flex gap-2">
                            <Link
                              to={`/projects/${project.id}?owned=${selectedProductIds.join(',')}`}
                              className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-1"
                            >
                              <span>View Project</span>
                              <ArrowRight size={14} />
                            </Link>
                            {missingComponents.length > 0 && (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-1"
                                onClick={async () => {
                                  await bulkAddToCart(
                                    missingComponents.map(m => ({ productId: m.productId, quantity: m.quantityRequired }))
                                  );
                                }}
                              >
                                <PackagePlus size={14} />
                                <span>Add Missing</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
