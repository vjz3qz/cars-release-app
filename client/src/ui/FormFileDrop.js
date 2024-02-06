import "../styles/RequirementsAnalysis.css";
import FileDrop from "./FileDrop";

export default function FormFileDrop({
  heading,
  onFilesUploaded,
  disabledCondition,
}) {
  return (
    <div>
      <h5 className="select-label">{heading}</h5>
      <div className="file-drop">
        <FileDrop
          onFilesUploaded={onFilesUploaded}
          disabledCondition={disabledCondition}
        />
      </div>
    </div>
  );
}
