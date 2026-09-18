import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService, projectService } from '../services/api';
import { Product, Project } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProjectCard } from '../components/ProjectCard';
import {
  Search,
  Sparkles,
  ArrowRight,
  Layers,
  ShoppingBag,
  Zap,
  Cpu,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Box,
  Rocket
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [componentInput, setComponentInput] = useState('');
  const [popularProjects, setPopularProjects] = useState<Project[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick search suggestion chips
  const quickSuggestions = [
    { name: 'Arduino UNO', id: 1 },
    { name: 'ESP32', id: 2 },
    { name: 'Raspberry Pi', id: 3 },
    { name: 'Soil Moisture Sensor', id: 5 },
    { name: 'HC-SR04 Ultrasonic', id: 6 },
    { name: 'DHT11', id: 4 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projRes, prodRes] = await Promise.all([
          projectService.getProjects(),
          productService.getProducts()
        ]);
        setPopularProjects(projRes.slice(0, 6));
        setPopularProducts(prodRes.slice(0, 8));
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!componentInput.trim()) return;

    // Check if matches known product
    const match = popularProducts.find(p => p.name.toLowerCase().includes(componentInput.toLowerCase().trim()));
    if (match) {
      navigate(`/match?ownedId=${match.id}`);
    } else {
      navigate(`/match?q=${encodeURIComponent(componentInput)}`);
    }
  };

  const handleSelectQuickChip = (chip: { name: string; id: number }) => {
    navigate(`/match?ownedId=${chip.id}`);
  };

  return (
    <div className="home-page pb-5">
      {/* 1. Hero Section */}
      <section
        className="text-white py-5 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.15)'
        }}
      >
        {/* Subtle grid background effect */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        ></div>

        <div className="container position-relative py-lg-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7 text-center text-lg-start">
              {/* Tag pill */}
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-info bg-opacity-10 border border-info border-opacity-25 text-info small mb-3">
                <Sparkles size={14} className="text-warning" />
                <span className="fw-semibold">Smart Engineering Component Marketplace</span>
              </div>

              {/* Main Headline */}
              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ letterSpacing: '-0.5px' }}>
                You Have the Parts.<br />
                <span className="text-info">We'll Find What's Missing.</span>
              </h1>

              {/* Subtitle */}
              <p className="lead text-light text-opacity-75 mb-4 mx-auto mx-lg-0" style={{ maxWidth: '580px', fontSize: '1.15rem' }}>
                Discover college and DIY projects built around components you already own. One-click identify missing sensors, modules, and ICs, and have them waiting for you on campus.
              </p>

              {/* Prominent Search Card */}
              <div className="card border-0 shadow-lg p-2 rounded-4 mb-3 text-start bg-dark border border-secondary border-opacity-50" style={{ maxWidth: '620px' }}>
                <form onSubmit={handleHeroSearch} className="d-flex flex-column flex-sm-row gap-2">
                  <div className="input-group flex-grow-1">
                    <span className="input-group-text bg-transparent border-0 text-info ps-3">
                      <Search size={20} />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-transparent border-0 text-white shadow-none py-2"
                      placeholder="What component do you already have? (e.g. Arduino UNO)"
                      value={componentInput}
                      onChange={(e) => setComponentInput(e.target.value)}
                      id="hero-component-search"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-info text-dark fw-bold px-4 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
                    id="hero-find-projects-btn"
                  >
                    <span>Find Projects</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>

              {/* Quick suggestion chips */}
              <div className="d-flex flex-wrap align-items-center gap-2 text-start mb-4">
                <span className="small text-secondary fw-semibold">Try selecting:</span>
                {quickSuggestions.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    className="btn btn-outline-secondary btn-sm rounded-pill text-light border-secondary border-opacity-50 py-0 px-2"
                    style={{ fontSize: '12px' }}
                    onClick={() => handleSelectQuickChip(chip)}
                  >
                    + {chip.name}
                  </button>
                ))}
              </div>

              {/* Secondary CTA Buttons */}
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <Link to="/products" className="btn btn-outline-light rounded-pill px-4 py-2 fw-medium d-flex align-items-center gap-2">
                  <Box size={18} />
                  <span>Browse Components</span>
                </Link>
                <Link to="/match" className="btn btn-dark border-secondary rounded-pill px-4 py-2 text-warning fw-medium d-flex align-items-center gap-2">
                  <Sparkles size={18} />
                  <span>Multi-Part Match Tool</span>
                </Link>
              </div>
            </div>

            {/* Hero Visual Card / Graphic */}
            <div className="col-lg-5 d-none d-lg-block">
              <div className="position-relative">
                <div
                  className="card border-0 rounded-4 shadow-2xl p-4 bg-dark bg-opacity-75 border border-info border-opacity-25"
                  style={{ backdropFilter: 'blur(12px)' }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary border-opacity-50 pb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Cpu className="text-info" size={22} />
                      <span className="fw-bold text-white small">PartMatch Intelligence</span>
                    </div>
                    <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50">
                      LIVE ENGINE
                    </span>
                  </div>

                  {/* Visual Match Representation */}
                  <div className="p-3 rounded-3 mb-3 bg-black bg-opacity-50 border border-secondary border-opacity-25">
                    <div className="small text-secondary mb-1">Your owned component:</div>
                    <div className="d-flex align-items-center justify-content-between bg-dark p-2 rounded border border-success border-opacity-50">
                      <div className="d-flex align-items-center gap-2">
                        <CheckCircle2 size={16} className="text-success" />
                        <span className="text-white fw-bold small">Arduino UNO R3</span>
                      </div>
                      <span className="badge bg-success" style={{ fontSize: '10px' }}>OWNED</span>
                    </div>
                  </div>

                  <div className="text-center my-1 text-info small fw-semibold d-flex align-items-center justify-content-center gap-1">
                    <span>Matches 4 Available Projects</span>
                    <ArrowRight size={14} />
                  </div>

                  <div className="p-3 rounded-3 bg-black bg-opacity-50 border border-secondary border-opacity-25">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="fw-bold text-light small">🌱 Smart Irrigation System</span>
                      <span className="badge bg-info text-dark" style={{ fontSize: '10px' }}>1/6 Owned</span>
                    </div>
                    <div className="small text-secondary mb-2">Missing 5 components (Moisture sensor, Relay, Water pump...)</div>
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                      <span className="text-light fw-bold small">Missing Parts: ₹640</span>
                      <Link to="/projects/1?owned=1" className="btn btn-info btn-sm text-dark fw-bold py-1 px-2" style={{ fontSize: '12px' }}>
                        Add Missing to Cart
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How PartMatch Works Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill fw-semibold small mb-2">
              HOW IT WORKS
            </span>
            <h2 className="fw-bold text-dark">Build Projects Smarter in 5 Simple Steps</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
              Eliminate component guesswork, avoid buying duplicate hardware, and stop wasting your semester project budget.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              {
                step: '1',
                title: 'Tell Us What You Have',
                desc: 'Enter an Arduino, ESP32, or sensor sitting in your drawer.',
                icon: Search,
                color: 'text-primary'
              },
              {
                step: '2',
                title: 'Choose What to Build',
                desc: 'Browse matching IoT, robotics, and automation projects.',
                icon: Layers,
                color: 'text-info'
              },
              {
                step: '3',
                title: 'Find Missing Components',
                desc: 'PartMatch automatically identifies and prices missing hardware.',
                icon: Box,
                color: 'text-warning'
              },
              {
                step: '4',
                title: '1-Click Add to Cart',
                desc: 'Add all missing parts or full bundles directly to your checkout.',
                icon: ShoppingBag,
                color: 'text-success'
              },
              {
                step: '5',
                title: 'Start Building',
                desc: 'Pickup on campus at CSE Lab or Library within 15 minutes!',
                icon: Rocket,
                color: 'text-danger'
              }
            ].map((item, idx) => (
              <div key={idx} className="col-lg col-md-4 col-sm-6">
                <div className="card h-100 border-0 shadow-sm rounded-3 p-3 text-center bg-white">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '50px', height: '50px', background: '#f8fafc', border: '2px solid #e2e8f0' }}
                  >
                    <item.icon size={24} className={item.color} />
                  </div>
                  <div className="badge bg-dark rounded-pill mx-auto mb-2 px-2" style={{ width: 'fit-content', fontSize: '10px' }}>
                    STEP {item.step}
                  </div>
                  <h6 className="fw-bold text-dark mb-1">{item.title}</h6>
                  <p className="small text-secondary mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Popular Projects Section */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="badge bg-info bg-opacity-10 text-info px-3 py-1 rounded-pill fw-semibold small mb-2">
                COLLEGE LAB FAVORITES
              </span>
              <h2 className="fw-bold text-dark mb-1">Popular Engineering Projects</h2>
              <p className="text-secondary small mb-0">Verified hardware blueprints with direct component checklists.</p>
            </div>
            <Link to="/projects" className="btn btn-outline-primary rounded-pill mt-3 mt-md-0 fw-semibold d-inline-flex align-items-center gap-1">
              <span>View All Projects</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="row g-4">
            {popularProjects.map((project) => (
              <div key={project.id} className="col-lg-4 col-md-6">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Popular Components Section */}
      <section className="py-5 bg-light border-top border-bottom border-light">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="badge bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill fw-semibold small mb-2">
                TESTED & CAMPUS VERIFIED
              </span>
              <h2 className="fw-bold text-dark mb-1">Popular Components & Sensors</h2>
              <p className="text-secondary small mb-0">High quality microcontrollers, breadboards, relays, and motor drivers.</p>
            </div>
            <Link to="/products" className="btn btn-outline-success rounded-pill mt-3 mt-md-0 fw-semibold d-inline-flex align-items-center gap-1">
              <span>Explore Catalogue</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="row g-4">
            {popularProducts.map((product) => (
              <div key={product.id} className="col-xl-3 col-lg-4 col-md-6">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why PartMatch Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-1 rounded-pill fw-semibold small mb-2">
              WHY PARTMATCH
            </span>
            <h2 className="fw-bold text-dark">Built Specifically for Engineering Students</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '540px' }}>
              Standard e-commerce treats components as disconnected items. PartMatch treats them as project building blocks.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-3 text-center bg-white">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 mx-auto mb-3 text-primary" style={{ width: 'fit-content' }}>
                  <GraduationCap size={32} />
                </div>
                <h5 className="fw-bold text-dark mb-2">🎓 Built for Students</h5>
                <p className="small text-secondary mb-0">
                  Campus-centric marketplace connecting students across departments. Trade parts with peers after final evaluations.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-3 text-center bg-white">
                <div className="rounded-circle bg-info bg-opacity-10 p-3 mx-auto mb-3 text-info" style={{ width: 'fit-content' }}>
                  <Layers size={32} />
                </div>
                <h5 className="fw-bold text-dark mb-2">🧩 Project-Based Shopping</h5>
                <p className="small text-secondary mb-0">
                  Never wonder what accessories you need. See full wiring requirements, pinouts, and exact component counts.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-3 text-center bg-white">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 mx-auto mb-3 text-success" style={{ width: 'fit-content' }}>
                  <Zap size={32} />
                </div>
                <h5 className="fw-bold text-dark mb-2">💰 Budget Friendly</h5>
                <p className="small text-secondary mb-0">
                  Save up to 60% compared to online retailers with zero shipping charges and verified pre-owned lab components.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4 rounded-3 text-center bg-white">
                <div className="rounded-circle bg-warning bg-opacity-10 p-3 mx-auto mb-3 text-warning" style={{ width: 'fit-content' }}>
                  <ShieldCheck size={32} />
                </div>
                <h5 className="fw-bold text-dark mb-2">⚡ 15-Min Campus Pickup</h5>
                <p className="small text-secondary mb-0">
                  No 4-day delivery delays before presentation day. Collect from CSE Dept, Library, or Hostel instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Sell Callout Banner */}
      <section className="container my-4">
        <div
          className="rounded-4 p-4 p-md-5 text-white position-relative overflow-hidden shadow-lg"
          style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(56, 189, 248, 0.2)' }}
        >
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold mb-3">
                PEER TO PEER EXCHANGE
              </span>
              <h2 className="fw-bold mb-2">Have Unused Components From an Old Project?</h2>
              <p className="text-light text-opacity-75 mb-0" style={{ maxWidth: '600px' }}>
                Give your sensors, microcontrollers, and chassis a new home. Sell them to juniors and recoup your project expenses. Use our instant camera capture to list in under 60 seconds!
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/sell" className="btn btn-warning btn-lg fw-bold rounded-pill px-4 text-dark shadow">
                List Component Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
