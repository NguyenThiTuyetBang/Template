import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import './Banner.css';

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="banner-container">
      <div className="banner-content">
        <div className="banner-text-group">
          <Sparkles className="banner-icon" size={16} fill="white" />
          <span className="banner-text">All-in-One AI & 1M+ Templates</span>
        </div>
        
        <div className="banner-action-group">
          <button className="banner-cta">
            Limited time - 50% OFF
          </button>
          <button className="banner-close" onClick={() => setIsVisible(false)}>
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
