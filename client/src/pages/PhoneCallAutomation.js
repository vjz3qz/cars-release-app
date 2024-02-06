import React, { useState } from "react";
import "../styles/PhoneCallAutomationLandingPage.css";
import TextInput from "../ui/TextInput";
import FormTextInput from "../ui/FormTextInput";
import FormHeader from "../ui/FormHeader";
import FormSubmitButton from "../ui/FormSubmitButton";

import { useNavigate } from "react-router-dom";

const PhoneCallAutomation = () => {
  const [, setCallId] = useState("");
  const navigate = useNavigate();
  const goToPhoneCallAutomationPage = () => {
    navigate("/new-phone-call-automation"); // Replace with your actual path
  };
  return (
    <div className="page-container">
      <FormHeader
        header={"Phone Call Automation"}
        subheader={
          "Automate your phone calls to insurance providers to save time and money."
        }
      />
      <FormSubmitButton
        text={"New Call +"}
        onClick={goToPhoneCallAutomationPage}
        disabledCondition={false}
      />
      <FormTextInput
        heading={"Enter Call ID"}
        setText={setCallId}
        disabledCondition={false}
        numRows={1}
      />
    </div>
  );
};

export default PhoneCallAutomation;
