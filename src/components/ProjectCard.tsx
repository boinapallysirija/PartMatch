import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { ImageFallback } from './ImageFallback';
import { Clock, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  matchingCount?: number;
  totalComponents?: number;
  matchPercentage?: number;
  highlightedComponentId?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  matchingCount,
  totalComponents,
  matchPercentage,
  highlightedComponentId,
}) => {
  const difficultyColors: Record<string, string> = {
    'Beginner': 'bg-success bg-opacity-10 text-success border-success',
    'Intermediate': 'bg-warning bg-opacity-10 text-dark border-warning',
    'Advanced': 'bg-danger bg-opacity-10 text-danger border-danger',
  };

  const compCount = totalComponents || project.totalComponents || project.componentCount || 6;
  const isMatchedView = matchPercentage !== undefined;

  return (
    <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden bg-white hover-shadow transition-all d-flex flex-column" id={`project-card-${project.id}`}>
      {/* Project image */}
      <div className="position-relative bg-dark" style={{ height: '180px' }}>
        <Link to={`/projects/${project.id}${highlightedComponentId ? `?owned=${highlightedComponentId}` : ''}`}>
          <ImageFallback
            src={project.imageUrl}
            alt={project.name}
            className="w-100 h-100 object-fit-cover opacity-90 hover-opacity-100 transition-opacity"
            fallbackCategory={project.category}
          />
        </Link>
        <div className="position-absolute top-0 start-0 m-2">
          <span className={`badge border ${difficultyColors[project.difficulty] || 'bg-light text-dark'} rounded-pill px-2 py-1 fw-semibold`} style={{ fontSize: '11px' }}>
            {project.difficulty}
          </span>
        </div>
        <div className="position-absolute bottom-0 start-0 m-2">
          <span className="badge bg-dark bg-opacity-80 text-info rounded-pill px-2 py-1" style={{ fontSize: '11px' }}>
            {project.category}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="card-body p-3 d-flex flex-column flex-grow-1">
        <h5 className="card-title fw-bold mb-2">
          <Link
            to={`/projects/${project.id}${highlightedComponentId ? `?owned=${highlightedComponentId}` : ''}`}
            className="text-dark text-decoration-none hover-text-primary"
          >
            {project.name}
          </Link>
        </h5>

        <p className="card-text text-secondary small line-clamp-2 mb-3 flex-grow-1">
          {project.description}
        </p>

        {/* Progress bar if in Smart Match view */}
        {isMatchedView && (
          <div className="mb-3 p-2 bg-light rounded-2 border">
            <div className="d-flex justify-content-between align-items-center small mb-1">
              <span className="text-secondary fw-medium">
                You have <strong className="text-dark">{matchingCount}</strong> of <strong className="text-dark">{compCount}</strong> parts
              </span>
              <span className="badge bg-primary rounded-pill">{matchPercentage}% Match</span>
            </div>
            <div className="progress" style={{ height: '7px' }}>
              <div
                className={`progress-bar ${matchPercentage >= 70 ? 'bg-success' : matchPercentage >= 40 ? 'bg-primary' : 'bg-warning'}`}
                role="progressbar"
                style={{ width: `${matchPercentage}%` }}
                aria-valuenow={matchPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>
        )}

        {/* Meta details */}
        <div className="d-flex align-items-center justify-content-between text-secondary small pt-2 border-top border-light mb-3">
          <div className="d-flex align-items-center gap-1">
            <Clock size={14} className="text-primary" />
            <span>{project.estimatedTime}</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <Layers size={14} className="text-info" />
            <span>{compCount} required parts</span>
          </div>
        </div>

        {/* View project button */}
        <Link
          to={`/projects/${project.id}${highlightedComponentId ? `?owned=${highlightedComponentId}` : ''}`}
          className={`btn ${isMatchedView ? 'btn-primary' : 'btn-outline-primary'} btn-sm rounded-2 d-flex align-items-center justify-content-center gap-1 fw-semibold py-2`}
          id={`view-project-btn-${project.id}`}
        >
          <span>{isMatchedView ? 'Find Missing Parts' : 'View Requirements & Parts'}</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};
