import "../styles/RequirementsAnalysis.css";

export default function FormSubmitButton({ text, onClick, disabledCondition }) {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={disabledCondition}
        className="reset-button"
      >
        {text}
      </button>
    </div>
  );
}
