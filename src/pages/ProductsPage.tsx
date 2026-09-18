import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService, ProductQueryParams } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, RotateCcw, AlertCircle, Package } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'All');
  const [productType, setProductType] = useState(searchParams.get('productType') || 'All');
  const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || 'All');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'recently_added');

  const categories = [
    'All',
    'Microcontrollers',
    'Sensors',
    'Modules',
    'Boards',
    'Displays',
    'Motors',
    'Robotics',
    'Power Supplies',
    'Wires & Connectors',
    'Breadboards',
    'ICs & Components',
    'Tools',
    'Kits',
  ];

  const conditions = ['All', 'New', 'Like New', 'Good', 'Fair'];
  const productTypes = ['All', 'Hardware', 'Software', 'Kit'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let minPrice: number | undefined;
      let maxPrice: number | undefined;

      if (priceRange === 'under_100') {
        maxPrice = 100;
      } else if (priceRange === '100_500') {
        minPrice = 100;
        maxPrice = 500;
      } else if (priceRange === '500_1000') {
        minPrice = 500;
        maxPrice = 1000;
      } else if (priceRange === 'above_1000') {
        minPrice = 1000;
      }

      const params: ProductQueryParams = {
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        condition: condition !== 'All' ? condition : undefined,
        productType: productType !== 'All' ? productType : undefined,
        minPrice,
        maxPrice,
        inStock: inStockOnly || undefined,
        sort
      };

      const data = await productService.getProducts(params);
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, condition, productType, priceRange, inStockOnly, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setCondition('All');
    setProductType('All');
    setPriceRange('All');
    setInStockOnly(false);
    setSort('recently_added');
    setSearchParams({});
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <Package className="text-primary" />
            <span>Component Catalogue</span>
          </h2>
          <p className="text-secondary small mb-0">
            Browse campus-available engineering hardware, sensors, modules, and kits.
          </p>
        </div>
        <div className="mt-3 mt-md-0 d-flex align-items-center gap-2">
          <span className="badge bg-dark rounded-pill px-3 py-2 text-white">
            {products.length} {products.length === 1 ? 'Component' : 'Components'} Found
          </span>
        </div>
      </div>

      <div className="row g-4">
        {/* Filters Sidebar */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 p-3 bg-white sticky-top" style={{ top: '80px', zIndex: 10 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2 fw-bold text-dark">
                <Filter size={18} className="text-primary" />
                <span>Filters</span>
              </div>
              <button
                type="button"
                className="btn btn-link btn-sm text-secondary p-0 text-decoration-none d-flex align-items-center gap-1"
                onClick={handleResetFilters}
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Search</label>
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Arduino, sensor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  id="product-search-input"
                />
                <button className="btn btn-primary" type="submit">
                  <Search size={14} />
                </button>
              </div>
            </form>

            {/* Category Filter */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Category</label>
              <select
                className="form-select form-select-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                id="filter-category"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Condition</label>
              <select
                className="form-select form-select-sm"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                id="filter-condition"
              >
                {conditions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Type Filter */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Product Type</label>
              <select
                className="form-select form-select-sm"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                id="filter-product-type"
              >
                {productTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Price Range</label>
              <select
                className="form-select form-select-sm"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                id="filter-price"
              >
                <option value="All">All Prices</option>
                <option value="under_100">Under ₹100</option>
                <option value="100_500">₹100 – ₹500</option>
                <option value="500_1000">₹500 – ₹1000</option>
                <option value="above_1000">₹1000+</option>
              </select>
            </div>

            {/* In Stock Checkbox */}
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="inStockCheck"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <label className="form-check-label small fw-medium text-dark" htmlFor="inStockCheck">
                In Stock Only
              </label>
            </div>

            {/* Sort Dropdown */}
            <div className="mb-2">
              <label className="form-label small fw-semibold text-secondary">Sort By</label>
              <select
                className="form-select form-select-sm"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                id="sort-select"
              >
                <option value="recently_added">Recently Added</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="col-lg-9">
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading components...</span>
              </div>
              <p className="text-secondary small mt-2">Fetching components catalogue...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-3">
              <div className="rounded-circle bg-light p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                <Package size={40} className="text-secondary" />
              </div>
              <h5 className="fw-bold text-dark">No Components Found</h5>
              <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: '400px' }}>
                We couldn't find any components matching your search or filters. Try adjusting your search query or reset filters.
              </p>
              <div>
                <button className="btn btn-outline-primary rounded-pill px-4" onClick={handleResetFilters}>
                  Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {products.map((product) => (
                <div key={product.id} className="col-xl-4 col-md-6">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
