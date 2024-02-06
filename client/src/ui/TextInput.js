import React from "react";
import "../styles/TextInput.css";

const TextInput = ({ setText, disabledCondition, numRows }) => {
  return (
    <div className="text-input-container">
      <textarea
        className="text-input"
        onChange={(e) => setText(e.target.value)}
        rows={numRows}
        placeholder="Type here..."
        disabled={disabledCondition}
      />
    </div>
  );
};

export default TextInput;
