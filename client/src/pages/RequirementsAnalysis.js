import React, { useState } from "react";
import axios from "axios";

// Components
import Result from "../components/Result.js";
import FormHeader from "../ui/FormHeader.js";
import FormDropDown from "../ui/FormDropDown.js";
import FormFileDrop from "../ui/FormFileDrop.js";
import FormTextInput from "../ui/FormTextInput.js";
import FormSubmitButton from "../ui/FormSubmitButton.js";
import FormErrorMessage from "../ui/FormErrorMessage.js";

// Styles
import "../styles/RequirementsAnalysis.css";

export default function RequirementsAnalysis() {
  const [additionalInformation, setAdditionalInformation] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [procedure, setProcedure] = useState("");
  const [CPTCode, setCPTCode] = useState("");
  const [formFiles, setFormFiles] = useState([]);
  const [responseText, setResponseText] = useState("");
  const [sourceDocument, setSourceDocument] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function resetForm() {
    setInsuranceProvider(""); // Reset insurance provider
    setProcedure(""); // Reset procedure
    setCPTCode(""); // Reset CPT code
    setFormFiles([]); // Reset files
    setAdditionalInformation(""); // Reset query
  }

  async function handleSend() {
    if (formFiles.length === 0) {
      setErrorMessage("Please upload a file.");
      return;
    } else if (!insuranceProvider) {
      setErrorMessage("Please select an insurance provider.");
      return;
    } else if (!procedure) {
      setErrorMessage("Please select a procedure.");
      return;
    }
    // Create the request body using actual values
    setSending(true);
    setErrorMessage("");
    setResponseText("");
    setSourceDocument("");
    const formData = new FormData();
    formData.append("prior_authorization_letter", formFiles[0]); // only upload one file TODO handle multiple files
    formData.append("insurance_provider", insuranceProvider);
    formData.append("procedure", procedure);
    formData.append("cpt_code", CPTCode);
    formData.append("additional_information", additionalInformation);

    try {
      // Send the POST request to /query-requirements using axios
      const response = await axios.post(
        "http://127.0.0.1:5000/api/v1/analyze-prior-authorization",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Extract the response_text and source_document from the response
      const responseText = response.data.response_text;
      const sourceList = response.data.source_documents;

      setResponseText(responseText);
      setSourceDocument(sourceList[0]); // FOR NOW, TODO LATER
      // resetForm();
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      setErrorMessage("Error: please try again later.");
    }
    setSending(false);
  }

  const handleInsuranceChange = (selectedOption) => {
    setInsuranceProvider(selectedOption.value);
  };

  const insuranceProviders = [
    { value: "unitedhealthcare", label: "UnitedHealthCare" },
    { value: "aetna", label: "CVS Aetna" },
    { value: "kaiserpermanente", label: "Kaiser Permanente" },
  ];

  return (
    <div className="page-container">
      <FormHeader
        header={"Prior Authorization Requirements Analyzer"}
        subheader={
          "First select the insurance provider and the procedure needing prior authorization. Then, enter specific details about the procedure and the patient's condition. For example, if seeking prior authorization for a cardiothoracic MRI, provide details about the patient's existing conditions or other justifying information."
        }
      />

      <FormDropDown
        heading={"Select an Insurance Provider"}
        options={insuranceProviders}
        onChange={handleInsuranceChange}
        disabledCondition={sending}
      />
      <FormTextInput
        heading={"Enter the Procedure"}
        setText={setProcedure}
        disabledCondition={sending}
        numRows={1}
      />
      <FormFileDrop
        heading={"Upload the Prior Authorization Request Files"}
        onFilesUploaded={(files) => setFormFiles(files)}
        disabledCondition={sending}
      />

      <FormTextInput
        heading={"Enter the CPT Code (Optional)"}
        setText={setCPTCode}
        disabledCondition={sending}
        numRows={1}
      />

      <FormTextInput
        heading={"Enter Additional Information (Optional)"}
        setText={setAdditionalInformation}
        disabledCondition={sending}
        numRows={3}
      />

      <FormSubmitButton
        text={"Submit"}
        onClick={handleSend}
        disabledCondition={sending}
      />

      <div className="results-container">
        {responseText && sourceDocument && (
          <Result responseText={responseText} sourceDocument={sourceDocument} />
        )}
      </div>

      <FormErrorMessage errorMessage={errorMessage} />
    </div>
  );
}
