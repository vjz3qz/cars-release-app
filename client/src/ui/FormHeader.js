import "../styles/RequirementsAnalysis.css";

export default function FormHeader({ header, subheader }) {
  return (
    <div>
      <h2>{header}</h2>
      <div className="instruction-container">
        <div className="instructions">
          <p>{subheader}</p>
        </div>
      </div>
    </div>
  );
}
