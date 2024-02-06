import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import NavBar from "./components/NavBar";

// Styles
import "./App.css";

// Pages
import RequirementsAnalysis from "./pages/RequirementsAnalysis";
import NewPhoneCallAutomation from "./pages/NewPhoneCallAutomation";
import GuidelineDiscovery from "./pages/GuidelineDiscovery";
import UploadDocuments from "./pages/UploadDocuments";
import Dashboard from "./pages/Dashboard";
import PhoneCallAutomation from "./pages/PhoneCallAutomation";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/requirement-analysis"
            element={<RequirementsAnalysis />}
          />
          <Route
            path="/phone-call-automation"
            element={<PhoneCallAutomation />}
          />
          <Route
            path="/new-phone-call-automation"
            element={<NewPhoneCallAutomation />}
          />
          <Route path="/guideline-discovery" element={<GuidelineDiscovery />} />
          <Route
            path="/upload-insurance-documents"
            element={<UploadDocuments />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
