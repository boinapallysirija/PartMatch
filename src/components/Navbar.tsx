import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Sparkles,
  Package,
  Layers,
  PlusCircle,
  Clock,
  User as UserIcon,
  LogOut,
  LogIn
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-2" style={{ backgroundColor: '#0f172a' }}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4" to="/">
          <span className="fs-3">🧩</span>
          <span>
            <span className="text-info">Part</span>Match
          </span>
          <span
            className="badge rounded-pill bg-info text-dark d-none d-sm-inline-block ms-1"
            style={{ fontSize: '10px', letterSpacing: '0.5px' }}
          >
            STUDENT MARKETPLACE
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'active text-info fw-semibold' : 'text-light'}`} to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 d-flex align-items-center gap-1 ${isActive ? 'active text-info fw-semibold' : 'text-light'}`} to="/projects">
                <Layers size={16} />
                <span>Projects</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 d-flex align-items-center gap-1 ${isActive ? 'active text-info fw-semibold' : 'text-light'}`} to="/products">
                <Package size={16} />
                <span>Components</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-3 d-flex align-items-center gap-1 ${
                    isActive ? 'active text-warning fw-semibold' : 'text-warning'
                  }`
                }
                to="/match"
              >
                <Sparkles size={16} className="text-warning" />
                <span>Match Parts</span>
                <span className="badge bg-warning text-dark ms-1" style={{ fontSize: '9px' }}>SMART</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 d-flex align-items-center gap-1 ${isActive ? 'active text-info fw-semibold' : 'text-light'}`} to="/sell">
                <PlusCircle size={16} />
                <span>Sell</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 d-flex align-items-center gap-1 ${isActive ? 'active text-info fw-semibold' : 'text-light'}`} to="/orders">
                <Clock size={16} />
                <span>My Orders</span>
              </NavLink>
            </li>
          </ul>

          {/* Right Action Icons & User */}
          <div className="d-flex align-items-center gap-3">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="btn btn-outline-info position-relative d-flex align-items-center gap-2 rounded-pill px-3 py-1"
              id="navbar-cart-btn"
            >
              <ShoppingBag size={18} />
              <span className="d-none d-sm-inline">Cart</span>
              {cartCount > 0 && (
                <span
                  className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '11px' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth section */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-dark border-secondary rounded-pill d-flex align-items-center gap-2 px-3 py-1 dropdown-toggle text-white"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  id="user-menu-btn"
                >
                  <div
                    className="rounded-circle bg-info text-dark fw-bold d-flex align-items-center justify-content-center"
                    style={{ width: '26px', height: '26px', fontSize: '12px' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="small d-none d-md-inline text-truncate" style={{ maxWidth: '120px' }}>
                    {user.name}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark shadow border-secondary mt-2">
                  <li className="px-3 py-2 border-bottom border-secondary">
                    <div className="fw-semibold text-white small">{user.name}</div>
                    <div className="text-secondary small text-truncate" style={{ fontSize: '12px' }}>{user.email}</div>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2 small py-2" to="/my-products">
                      <Package size={14} />
                      <span>My Listed Products</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2 small py-2" to="/orders">
                      <Clock size={14} />
                      <span>My Orders</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2 small py-2" to="/sell">
                      <PlusCircle size={14} />
                      <span>Sell New Component</span>
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 small text-danger py-2"
                      onClick={handleLogout}
                    >
                      <LogOut size={14} />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-info text-dark fw-semibold rounded-pill px-3 py-1 d-flex align-items-center gap-1"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
