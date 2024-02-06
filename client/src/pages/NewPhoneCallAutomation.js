import React, { useState } from "react";
import axios from "axios";

// Components
import FormTextInput from "../ui/FormTextInput.js";
import FormHeader from "../ui/FormHeader.js";

// Styles
import "../styles/RequirementsAnalysis.css";
import "react-select-search/style.css";
import FormSubmitButton from "../ui/FormSubmitButton.js";
import FormErrorMessage from "../ui/FormErrorMessage.js";

const NewPhoneCallAutomation = () => {
  const handleSend = async () => {
    if (!isFormFilled) {
      setErrorMessage("Please fill out all fields.");
      return;
    }
    try {
      setSending(true);
      setErrorMessage("");
      const payload = {
        patientFullName: patientFullName,
        patientDateOfBirth: patientDateOfBirth,
        patientInsuranceID: patientInsuranceID,
        physicianName: physicianName,
        physicianNPI: physicianNPI,
        physicianNotes: physicianNotes,
        reasonForCall: reasonForCall,
        insuranceName: insuranceName,
        insurancePlan: insurancePlan,
        insurancePhoneNumber: insurancePhoneNumber,
      };
      const response = await axios.post(
        "http://127.0.0.1:5000/api/v1/call_insurance",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // TODO display to user, do something with response
      console.log(response);
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error: please try again later.");
    }
    setSending(false);
  };

  function resetForm() {
    setPatientFullName("");
    setPatientDateOfBirth("");
    setPatientInsuranceID("");
    setPhysicianName("");
    setPhysicianNPI("");
    setPhysicianNotes("");
    setReasonForCall("");
    setInsuranceName("");
    setInsurancePlan("");
    setInsurancePhoneNumber("");
  }

  const [patientFullName, setPatientFullName] = useState("");
  const [patientDateOfBirth, setPatientDateOfBirth] = useState("");
  const [patientInsuranceID, setPatientInsuranceID] = useState("");
  const [physicianName, setPhysicianName] = useState("");
  const [physicianNPI, setPhysicianNPI] = useState("");
  const [physicianNotes, setPhysicianNotes] = useState("");
  const [insuranceName, setInsuranceName] = useState("");
  const [insurancePlan, setInsurancePlan] = useState("");
  const [insurancePhoneNumber, setInsurancePhoneNumber] = useState("");
  const [reasonForCall, setReasonForCall] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isFormFilled =
    patientFullName &&
    patientDateOfBirth &&
    patientInsuranceID &&
    physicianName &&
    physicianNPI &&
    physicianNotes &&
    insuranceName &&
    insurancePlan &&
    insurancePhoneNumber &&
    reasonForCall;

  return (
    <div className="page-container">
      <FormHeader
        header={"Schedule an Insurance Phone Call"}
        subheader={
          "Start by selecting the subject you are calling to inquire about. Then, search and select the patient. Verify that their details are correct. Finally, provide any additional specifications or details about the patients situation that may be needed in the phone call. Click send to initiate the automatic phone call Once the phone call is completed, you will see it in the history. Click on any phone call in order to see the transcript, key takeaways, and follow-up actions."
        }
      />
      <FormTextInput
        heading="Enter Patient Full Name"
        setText={setPatientFullName}
        disabledCondition={sending}
        numRows={1}
      />
      <FormTextInput
        heading="Enter Patient Date of Birth"
        setText={setPatientDateOfBirth}
        disabledCondition={sending}
        numRows={1}
      />
      <FormTextInput
        heading="Enter Patient Insurance ID"
        setText={setPatientInsuranceID}
        disabledCondition={sending}
        numRows={1}
      />
      <FormTextInput
        heading="Enter Physician Name"
        setText={setPhysicianName}
        disabledCondition={sending}
        numRows={1}
      />
      <FormTextInput
        heading="Enter Physician NPI"
        setText={setPhysicianNPI}
        disabledCondition={sending}
        numRows={1}
      />
      <FormTextInput
        heading="Enter Physician Notes/Proof of Medical Necessity"
        setText={setPhysicianNotes}
        disabledCondition={sending}
        numRows={3}
      />
      <FormTextInput
        heading="Enter Reason For Call"
        setText={setReasonForCall}
        disabledCondition={sending}
        numRows={1}
      />
      <FormTextInput
        heading="Enter Insurance Name"
        setText={setInsuranceName}
        disabledCondition={sending}
        numRows={1}
      />
      <FormTextInput
        heading="Enter Insurance Plan"
        setText={setInsurancePlan}
        disabledCondition={sending}
        numRows={1}
      />
      <FormTextInput
        heading="Enter Insurance Phone Number"
        setText={setInsurancePhoneNumber}
        disabledCondition={sending}
        numRows={1}
      />
      <FormSubmitButton
        text={"Submit"}
        onClick={handleSend}
        disabledCondition={sending}
      />
      <FormErrorMessage errorMessage={errorMessage} />
    </div>
  );
};

export default NewPhoneCallAutomation;
