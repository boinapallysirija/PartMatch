import React, { useState, useEffect } from 'react';
import { projectService } from '../services/api';
import { Project } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { Layers, Search, Filter, Sparkles, RotateCcw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [category, setCategory] = useState('All');

  const categories = [
    'All',
    'IoT & Agriculture',
    'Weather & Climate',
    'Home Automation',
    'Security & Safety',
    'Automation & Energy',
    'Robotics',
    'Automation & Health'
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getProjects({
        search: search.trim() || undefined,
        difficulty: difficulty !== 'All' ? difficulty : undefined,
        category: category !== 'All' ? category : undefined
      });
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [difficulty, category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleReset = () => {
    setSearch('');
    setDifficulty('All');
    setCategory('All');
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <Layers className="text-primary" />
            <span>Engineering Project Blueprints</span>
          </h2>
          <p className="text-secondary small mb-0">
            Select a project to inspect required components, mark parts you already own, and order the missing ones.
          </p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <Link to="/match" className="btn btn-warning text-dark fw-bold rounded-pill px-3 py-2 d-flex align-items-center gap-2 shadow-sm">
            <Sparkles size={16} />
            <span>What do you have? Match Parts</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={16} className="text-secondary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search projects (e.g. Irrigation, Weather...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="project-search-input"
              />
            </div>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              id="project-category-filter"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              id="project-difficulty-filter"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'All' ? 'All Difficulties' : diff}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2 d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-grow-1 rounded-2 fw-semibold">
              Filter
            </button>
            <button type="button" className="btn btn-outline-secondary rounded-2" onClick={handleReset} title="Reset">
              <RotateCcw size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Projects List */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading projects...</span>
          </div>
          <p className="text-secondary small mt-2">Loading project blueprints and component dependencies...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-3">
          <Layers size={48} className="text-secondary mx-auto mb-3" />
          <h5 className="fw-bold text-dark">No Projects Found</h5>
          <p className="text-secondary small mb-3">Try adjusting your difficulty or category filters.</p>
          <div>
            <button className="btn btn-outline-primary rounded-pill px-4" onClick={handleReset}>
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {projects.map((project) => (
            <div key={project.id} className="col-lg-4 col-md-6">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
