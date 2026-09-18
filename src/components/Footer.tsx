import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Zap, RefreshCw, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-secondary pt-5 pb-4 mt-auto border-top border-secondary border-opacity-25" style={{ backgroundColor: '#0b0f19' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="fs-3">🧩</span>
              <span className="fs-4 fw-bold text-white">
                <span className="text-info">Part</span>Match
              </span>
            </div>
            <p className="text-light opacity-75 small mb-3">
              "You have the parts. We'll find what's missing."
            </p>
            <p className="small text-secondary mb-3">
              The premier peer-to-peer engineering component marketplace and smart project matching engine built for college labs, robotics innovators, and DIY makers.
            </p>
            <div className="d-flex align-items-center gap-2 text-info small">
              <ShieldCheck size={16} />
              <span>Campus Verified Student Network</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3">Discovery</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/match" className="text-secondary text-decoration-none hover-text-info">Smart Match Tool</Link></li>
              <li><Link to="/projects" className="text-secondary text-decoration-none hover-text-info">Project Directory</Link></li>
              <li><Link to="/products" className="text-secondary text-decoration-none hover-text-info">Component Catalogue</Link></li>
              <li><Link to="/products?category=Microcontrollers" className="text-secondary text-decoration-none hover-text-info">Microcontrollers</Link></li>
              <li><Link to="/products?category=Sensors" className="text-secondary text-decoration-none hover-text-info">Sensors & Probes</Link></li>
            </ul>
          </div>

          {/* E-Commerce Flow */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3">Marketplace</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/sell" className="text-secondary text-decoration-none hover-text-info">Sell Unused Components</Link></li>
              <li><Link to="/cart" className="text-secondary text-decoration-none hover-text-info">Shopping Cart</Link></li>
              <li><Link to="/orders" className="text-secondary text-decoration-none hover-text-info">Track Campus Orders</Link></li>
              <li><Link to="/my-products" className="text-secondary text-decoration-none hover-text-info">Manage Seller Listings</Link></li>
              <li><Link to="/checkout" className="text-secondary text-decoration-none hover-text-info">Express Checkout</Link></li>
            </ul>
          </div>

          {/* Campus Pickup Points */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3 d-flex align-items-center gap-1">
              <MapPin size={16} className="text-warning" />
              <span>Campus Pickup Hubs</span>
            </h6>
            <div className="small text-secondary d-flex flex-column gap-1 mb-3">
              <div>📍 CSE Department Ground Floor</div>
              <div>📍 Central Library Entrance</div>
              <div>📍 Campus Main Gate Desk</div>
              <div>📍 Hostel Mess Common Area</div>
              <div>📍 Student Activity Centre (SAC)</div>
            </div>
            <div className="badge bg-secondary bg-opacity-25 text-info py-2 px-3 border border-info border-opacity-25 rounded w-100 text-start">
              ⚡ Zero shipping fees — 15 min on-campus pickup
            </div>
          </div>
        </div>

        <hr className="border-secondary border-opacity-25 my-4" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small text-secondary gap-2">
          <div>
            © 2026 PartMatch. Engineered for Student Innovators.
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-dark border border-secondary text-secondary">React + Spring Boot Architecture</span>
            <span className="badge bg-dark border border-secondary text-secondary">Demo Mode: Full Flow Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
