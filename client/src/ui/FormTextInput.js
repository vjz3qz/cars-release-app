import "../styles/RequirementsAnalysis.css";
import TextInput from "./TextInput";

export default function FormTextInput({
  heading,
  setText,
  disabledCondition,
  numRows,
}) {
  return (
    <div>
      {heading && <h5 className="select-label">{heading}</h5>}
      <div className="select-row">
        <TextInput
          setText={setText}
          disabledCondition={disabledCondition}
          numRows={numRows}
        />
      </div>
    </div>
  );
}
