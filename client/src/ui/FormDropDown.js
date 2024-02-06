import Select from "react-select";
import "../styles/RequirementsAnalysis.css";

export default function FormDropDown({
  heading,
  options,
  onChange,
  disabledCondition,
}) {
  return (
    <div>
      <h5 className="select-label">{heading}</h5>
      <div className="select-row">
        <Select
          options={options}
          onChange={onChange}
          disabled={disabledCondition}
        />
      </div>
    </div>
  );
}
