import React, { useState } from "react";
import axios from "axios";

// Components
import TextInput from "../ui/TextInput.js";
import FileDrop from "../ui/FileDrop.js";
import Select from "react-select";
import DocumentDisplay from "../ui/DocumentDisplay.js";
import FormDropdown from "../ui/FormDropDown.js";
import FormTextInput from "../ui/FormTextInput.js";
import FormFileDrop from "../ui/FormFileDrop.js";
import FormSubmitButton from "../ui/FormSubmitButton.js";
import FormHeader from "../ui/FormHeader.js";
import FormErrorMessage from "../ui/FormErrorMessage.js";

// TODO reset after submission
const UploadDocuments = () => {
  const [formInsuranceProvider, setFormInsuranceProvider] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formFiles, setFormFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const [fileId, setFileId] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function resetForm() {
    setFormFiles([]); // Reset files
    setFormUrl(""); // Reset URL
    setFormInsuranceProvider(""); // Reset selected option
  }
  const handleSend = async () => {
    // Create the request body using actual values
    if (formFiles.length === 0 && formUrl === "") {
      setErrorMessage("Please upload a file or enter a URL");
      return;
    }
    if (formInsuranceProvider === "") {
      setErrorMessage("Please select an insurance provider");
      return;
    }
    setSending(true);
    setFileId("");
    setFileUrl("");
    setErrorMessage("");
    // create form data
    const formData = new FormData();
    if (formFiles.length !== 0) {
      formData.append("file", formFiles[0]); // only upload one file TODO handle multiple files
    }
    if (formUrl !== "") {
      formData.append("url", formUrl);
    }
    formData.append("insurance_provider", formInsuranceProvider);

    try {
      // Send the POST request to /query-requirements using axios
      const response = await axios.post(
        "http://127.0.0.1:5000/api/v1/upload-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Extract the response_text and source_document from the response
      const fileId = response.data.file_id;
      setFileId(fileId);
      // getFileUrl(fileId, insuranceProvider);
      // resetForm();
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      setErrorMessage("Error: please try again later.");
    }
    setSending(false);
  };

  // const getFileUrl = async (fileId, insuranceProvider) => {
  //   try {
  //     const response = await axios.get(
  //       "http://127.0.0.1:5000/api/v1/get-file",
  //       {
  //         params: {
  //           file_id: fileId,
  //           insurance_provider: insuranceProvider,
  //         },
  //       }
  //     );

  //     setFileUrl(response.data.file_url);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     throw error;
  //   }
  // };

  const handleInsuranceChange = (selectedOption) => {
    setFormInsuranceProvider(selectedOption.value);
  };

  const insuranceProviders = [
    { value: "unitedhealthcare", label: "UnitedHealthCare" },
    { value: "aetna", label: "CVS Aetna" },
    { value: "kaiserpermanente", label: "Kaiser Permanente" },
  ];

  return (
    <div className="page-container">
      <FormHeader
        header={"Upload Insurance Documentation"}
        subheader={
          "To proceed, please select an insurance provider from the dropdown menu and either upload a file or enter a URL."
        }
      />

      <FormDropdown
        heading={"Select an Insurance Provider"}
        options={insuranceProviders}
        onChange={handleInsuranceChange}
        disabledCondition={sending}
      />

      <FormTextInput
        heading={"Add a URL"}
        setText={setFormUrl}
        disabledCondition={sending}
        numRows={1}
      />

      <FormFileDrop
        heading={"Upload a File"}
        setFormFiles={setFormFiles}
        disabledCondition={sending}
      />

      <FormSubmitButton
        text={"Submit"}
        onClick={handleSend}
        disabledCondition={sending}
      />

      <div style={{ width: "50%" }}>
        {fileId && (
          <div>
            <div className="alert alert-success" role="alert">
              {"file uploaded successfully!"}
            </div>
            {/* <DocumentDisplay sourceDocument={fileUrl} /> */}
            {/* try to display document */}
          </div>
        )}
      </div>
      <FormErrorMessage errorMessage={errorMessage} />
    </div>
  );
};

export default UploadDocuments;
