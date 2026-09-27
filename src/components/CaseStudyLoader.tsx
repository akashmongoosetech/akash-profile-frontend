import './CaseStudyLoader.css';

/**
 * Reusable loading animation for case study pages.
 * Presentation only — no data-fetching logic.
 * Used by the public case study listing and detail pages.
 */
const CaseStudyLoader: React.FC = () => {
  return (
    <div className="case-study-loader-container">
      <span className="loader">Load ng</span>
    </div>
  );
};

export default CaseStudyLoader;
