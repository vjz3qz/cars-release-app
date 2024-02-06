import React, { useState } from "react";
import axios from "axios";
import FormTextInput from "../ui/FormTextInput";
import FormDropDown from "../ui/FormDropDown";
import FormSubmitButton from "../ui/FormSubmitButton";
import FormErrorMessage from "../ui/FormErrorMessage";
import Result from "../components/Result";
import FormHeader from "../ui/FormHeader";

const GuidelineDiscovery = () => {
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [procedure, setProcedure] = useState("");
  const [CPTCode, setCPTCode] = useState("");
  const [HPI, setHPI] = useState("");
  const [additionalInformation, setAdditionalInformation] = useState("");
  const [sending, setSending] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [sourceDocument, setSourceDocument] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function resetForm() {
    setInsuranceProvider(""); // Reset insurance provider
    setProcedure(""); // Reset procedure
    setCPTCode(""); // Reset CPT code
    setHPI(""); // Reset HPI
    setAdditionalInformation(""); // Reset additionalInformation
  }

  async function handleSearch() {
    if (!insuranceProvider) {
      setErrorMessage("Please select an insurance provider.");
      return;
    } else if (!procedure) {
      setErrorMessage("Please select a procedure.");
      return;
    }
    try {
      setSending(true);
      setErrorMessage("");
      const response = await axios.post(
        "http://127.0.0.1:5000/api/v1/query-requirements",
        {
          insurance_provider: insuranceProvider,
          procedure: procedure,
          cpt_code: CPTCode,
          hpi: HPI,
          additional_information: additionalInformation,
        },
        {
          headers: {
            "Content-Type": "application/json",
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
      console.error("Error:", error);
      setErrorMessage("Error: please try again later.");
    }
    setSending(false);
  }

  const handleInsuranceChange = (selectedOption) => {
    setInsuranceProvider(selectedOption.value);
  };

  const insuranceProviders = [
    { value: "unitedhealthcare", label: "UnitedHealthcare" },
    { value: "aetna", label: "CVS Aetna" },
    { value: "kaiserpermanente", label: "Kaiser Permanente" },
  ];

  return (
    <div className="page-container">
      <FormHeader
        header={"Guideline Discovery"}
        subheader={"Search for any medical policy for any insurance provider."}
      />
      <FormDropDown
        heading={"Select an Insurance Provider"}
        options={insuranceProviders}
        onChange={handleInsuranceChange}
        disabledCondition={sending}
      />
      {/* TODO should we do drop down or type in for procedure? */}
      {/* initially, type procedure, then start getting supported features in dropdown autofill */}
      <FormTextInput
        heading={"Enter the Procedure"}
        setText={setProcedure}
        disabledCondition={sending}
        numRows={1}
      />

      <FormTextInput
        heading={"Enter the CPT Code (Optional)"}
        setText={setCPTCode}
        disabledCondition={sending}
        numRows={1}
      />

      <FormTextInput
        heading={"Enter the Patient's HPI (Optional)"}
        setText={setHPI}
        disabledCondition={sending}
        numRows={3}
      />

      <FormTextInput
        heading={"Enter Additional Information (Optional)"}
        setText={setAdditionalInformation}
        disabledCondition={sending}
        numRows={3}
      />
      <FormSubmitButton
        text={"Search"}
        onClick={handleSearch}
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
};

export default GuidelineDiscovery;
