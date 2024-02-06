import "../styles/RequirementsAnalysis.css";
import FileDrop from "./FileDrop";
import { useCallback } from "react";

export default function FormFileDrop({
  heading,
  setFormFiles,
  disabledCondition,
}) {
  // Assuming setFormFiles is defined here as part of a useState
  const onFilesUploaded = useCallback(
    (files) => {
      setFormFiles(files);
    },
    [setFormFiles]
  ); // setFormFiles is stable and doesn't need to be in the dependency array, but including for clarity

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
