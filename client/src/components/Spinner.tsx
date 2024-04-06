import "../styles/Spinner.css";

export const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    </div>
  );
};
