import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Camera,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Package,
  PlusCircle,
  Sparkles,
  DollarSign
} from 'lucide-react';

export const SellPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Sensors');
  const [productType, setProductType] = useState<'Hardware' | 'Software' | 'Kit'>('Hardware');
  const [condition, setCondition] = useState<'New' | 'Like New' | 'Good' | 'Fair'>('Good');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('1');
  const [compatibility, setCompatibility] = useState('Universal / Arduino / ESP32');
  const [imageUrl, setImageUrl] = useState('');

  // Camera capture states
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categories = [
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
    'Other'
  ];

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      setCameraError(err.message || 'Unable to access device camera. Please check browser permissions or upload an image file/URL.');
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  // Capture Frame from Camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImageUrl(dataUrl);
      stopCamera();
    }
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !category) {
      setError('Please fill in all required fields (Product Name, Price, Category).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newProd = await productService.createProduct({
        name: name.trim(),
        description: description.trim() || 'Pre-owned engineering component from student lab.',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.3),
        category,
        productType,
        condition,
        brand: brand.trim() || 'Generic / DIY',
        stock: Number(stock) || 1,
        compatibility: compatibility.trim() || 'Universal / Arduino / Raspberry Pi',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/products/${newProd.id}`);
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to list product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: '820px' }}>
        {/* Header card */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div className="rounded-circle bg-warning bg-opacity-15 p-3 text-dark">
              <PlusCircle size={28} className="text-warning" />
            </div>
            <div>
              <h2 className="fw-bold text-dark mb-1">Sell Your Extra Components</h2>
              <p className="text-secondary small mb-0">
                "Have unused components from an old project? Give them a new home."
              </p>
            </div>
          </div>

          <div className="badge bg-light text-secondary border mt-3 p-2 text-start d-flex align-items-center gap-2">
            <Sparkles size={14} className="text-info" />
            <span>
              Your listed component will immediately be cross-referenced by the <strong>PartMatch Project Engine</strong> so other students can discover it for their projects!
            </span>
          </div>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
            <CheckCircle2 size={18} />
            <span>Component listed successfully! Redirecting to component page...</span>
          </div>
        )}

        {/* Listing Form */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          <form onSubmit={handleSubmit}>
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">1. Component Details</h5>

            {/* Product Name */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">
                Product Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Arduino UNO R3, Soil Moisture Sensor, L298N Driver"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                id="sell-product-name"
              />
            </div>

            {/* Category & Type */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-secondary">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  id="sell-category"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-secondary">Product Type</label>
                <select
                  className="form-select"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as any)}
                  id="sell-product-type"
                >
                  <option value="Hardware">Hardware Component</option>
                  <option value="Kit">Kit / Bundle</option>
                  <option value="Software">Software / Firmware License</option>
                </select>
              </div>
            </div>

            {/* Condition & Brand */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold text-secondary">Condition</label>
                <select
                  className="form-select"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  id="sell-condition"
                >
                  <option value="New">Brand New (Unopened)</option>
                  <option value="Like New">Like New (Tested once for viva)</option>
                  <option value="Good">Good (Working fine with minimal wear)</option>
                  <option value="Fair">Fair (Working, pins bent/soldered)</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold text-secondary">Brand / Manufacturer</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. SparkFun, Espressif, Adafruit, Songle"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  id="sell-brand"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Description</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Describe component working condition, accessories included, semester project it was used in..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="sell-description"
              ></textarea>
            </div>

            {/* Compatibility */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary">Pinout & Compatibility</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 5V logic, I2C 0x3C, Arduino IDE, Raspberry Pi"
                value={compatibility}
                onChange={(e) => setCompatibility(e.target.value)}
                id="sell-compatibility"
              />
            </div>

            {/* Pricing and Stock */}
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom">2. Pricing & Stock</h5>

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-secondary">
                  Selling Price (₹) <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 250"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    id="sell-price"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold text-secondary">Original Price (₹)</label>
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 400"
                    min="1"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    id="sell-original-price"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-semibold text-secondary">Stock Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  id="sell-stock"
                />
              </div>
            </div>

            {/* Photo / Camera Section (Section 20 requirement) */}
            <h5 className="fw-bold text-dark mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <Camera size={20} className="text-primary" />
              <span>3. Component Photo / Camera</span>
            </h5>

            <div className="p-3 bg-light rounded-3 mb-4 border">
              <p className="small text-secondary mb-3">
                Snap a quick photo using your device camera or upload an image file of your component:
              </p>

              {cameraError && (
                <div className="alert alert-warning small py-2 px-3 mb-3">
                  ⚠️ {cameraError}
                </div>
              )}

              {/* Active Camera Viewfinder */}
              {cameraActive && (
                <div className="mb-3 text-center">
                  <div className="rounded-3 overflow-hidden bg-black d-inline-block shadow position-relative" style={{ maxWidth: '480px', width: '100%' }}>
                    <video ref={videoRef} className="w-100" style={{ maxHeight: '320px', objectFit: 'cover' }} playsInline muted />
                  </div>
                  <div className="mt-2 d-flex justify-content-center gap-2">
                    <button
                      type="button"
                      className="btn btn-success fw-bold px-4 rounded-pill d-flex align-items-center gap-1"
                      onClick={capturePhoto}
                    >
                      <Camera size={18} />
                      <span>Capture Photo</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill"
                      onClick={stopCamera}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Hidden canvas for snapshot rendering */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {/* Image Preview if available */}
              {imageUrl && !cameraActive && (
                <div className="mb-3 text-center">
                  <div className="d-inline-block position-relative rounded-3 overflow-hidden border shadow-sm" style={{ maxHeight: '220px' }}>
                    <img
                      src={imageUrl}
                      alt="Component Preview"
                      style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="mt-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm rounded-pill d-inline-flex align-items-center gap-1"
                      onClick={() => setImageUrl('')}
                    >
                      <RotateCcw size={14} />
                      <span>Retake / Remove Image</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Camera & File Upload Controls */}
              {!cameraActive && (
                <div className="row g-2">
                  <div className="col-sm-6">
                    <button
                      type="button"
                      className="btn btn-outline-primary w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                      onClick={startCamera}
                    >
                      <Camera size={18} />
                      <span>Open Camera (Take Photo)</span>
                    </button>
                  </div>

                  <div className="col-sm-6">
                    <label className="btn btn-outline-secondary w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-semibold mb-0 cursor-pointer">
                      <Upload size={18} />
                      <span>Upload Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Image URL fallback input */}
              <div className="mt-3">
                <label className="form-label small fw-semibold text-muted">Or enter external image URL:</label>
                <input
                  type="url"
                  className="form-control form-control-sm"
                  placeholder="https://example.com/component.jpg"
                  value={imageUrl.startsWith('data:') ? '' : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="d-grid gap-2 pt-3 border-top">
              <button
                type="submit"
                className="btn btn-warning btn-lg text-dark fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
                id="sell-submit-btn"
              >
                <PlusCircle size={20} />
                <span>{loading ? 'Listing Component...' : 'Publish Component to Marketplace'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
