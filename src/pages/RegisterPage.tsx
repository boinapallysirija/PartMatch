import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '460px' }}>
        <div className="text-center mb-4">
          <div className="fs-1 mb-2">🧩</div>
          <h3 className="fw-bold text-dark">Join PartMatch</h3>
          <p className="text-secondary small mb-0">
            Create an account to list components, discover project matches, and order parts.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 small py-2 mb-3" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Alex Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              id="register-name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">College Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="alex@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="register-email"
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Create Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="register-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
            disabled={loading}
            id="register-submit-btn"
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
          </button>
        </form>

        <div className="text-center text-secondary small pt-3 border-top">
          Already have an account?{' '}
          <Link to="/login" className="fw-semibold text-primary text-decoration-none">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
