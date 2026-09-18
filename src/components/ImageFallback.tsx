import React, { useState } from 'react';
import { Cpu } from 'lucide-react';

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackCategory?: string;
}

export const ImageFallback: React.FC<ImageFallbackProps> = ({
  src,
  alt = 'Component',
  className = '',
  fallbackCategory = 'Hardware',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`d-flex flex-column align-items-center justify-content-center bg-dark text-white p-3 text-center ${className}`}
        style={{ minHeight: '160px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
      >
        <Cpu className="mb-2 text-info opacity-75" size={32} />
        <span className="small fw-semibold text-light text-truncate w-100 px-2">{alt}</span>
        <span className="badge bg-secondary bg-opacity-50 text-light mt-1" style={{ fontSize: '10px' }}>
          {fallbackCategory}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      {...rest}
    />
  );
};
