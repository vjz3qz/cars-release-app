// Result.js
import React from "react";
import ReactMarkdown from "react-markdown";
import "../styles/Result.css";
import DocumentDisplay from "../ui/DocumentDisplay";

const Result = ({ responseText, sourceDocument }) => {
  return (
    <div className="result-container">
      {/* <p className="title">Arrhythmogenic Right Ventricular Dysplasia</p> */}
      {/* <p className="codes">Codes: CPT 75557 or CPT 75561</p> */}
      <p className="medical-label">
        <u>Proving Medical Neccesity</u>
      </p>
      <div className="medical-neccesity">
        <ReactMarkdown>{responseText}</ReactMarkdown>
      </div>
      <p className="medical-label">
        <u>Documentation Reference</u>
      </p>
      <DocumentDisplay sourceDocument={sourceDocument} />
    </div>
  );
};

export default Result;
