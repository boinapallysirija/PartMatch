import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, setDemoUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Try using demo student credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('student@partmatch.com');
    setPassword('password123');
    setDemoUser();
    navigate('/');
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '460px' }}>
        {/* Brand header */}
        <div className="text-center mb-4">
          <div className="fs-1 mb-2">🧩</div>
          <h3 className="fw-bold text-dark">Welcome to PartMatch</h3>
          <p className="text-secondary small mb-0">
            Sign in to access your college marketplace orders and listed parts.
          </p>
        </div>

        {/* Demo Account Quick-Fill Card (Section 32) */}
        <div className="p-3 bg-light rounded-3 border mb-4 text-start">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="small fw-bold text-dark d-flex align-items-center gap-1">
              <Sparkles size={14} className="text-warning" />
              <span>Demo Student Account:</span>
            </span>
            <span className="badge bg-success" style={{ fontSize: '10px' }}>ACTIVE</span>
          </div>
          <div className="small text-secondary mb-2" style={{ fontSize: '12px' }}>
            Email: <strong>student@partmatch.com</strong> • Pass: <strong>password123</strong>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm rounded-pill w-100 fw-semibold d-flex align-items-center justify-content-center gap-1"
            onClick={handleQuickDemo}
          >
            <UserCheck size={14} />
            <span>1-Click Sign In as Demo Student</span>
          </button>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 small py-2 mb-3" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">College / University Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="student@partmatch.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="login-email"
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="login-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
            disabled={loading}
            id="login-submit-btn"
          >
            <LogIn size={18} />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center text-secondary small pt-3 border-top">
          Don't have an account yet?{' '}
          <Link to="/register" className="fw-semibold text-primary text-decoration-none">
            Create Student Account
          </Link>
        </div>
      </div>
    </div>
  );
};
