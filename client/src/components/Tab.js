import React from 'react';
import '../styles/Tab.css'; // Make sure to create a corresponding CSS file to style your tab

const Tab = ({ label, active, onClick }) => {
  return (
    <div 
      className={`tab ${active ? 'active' : ''}`} 
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default Tab;
