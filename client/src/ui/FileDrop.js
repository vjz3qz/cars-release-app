import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";

const FileDrop = ({ onFilesUploaded, disabledCondition }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Call onFilesUploaded whenever uploadedFiles changes
  useEffect(() => {
    onFilesUploaded(uploadedFiles);
  }, [onFilesUploaded, uploadedFiles]);

  const handleDragEnter = (e) => {
    if (disabledCondition) return;
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (disabledCondition) return;
    e.preventDefault();
    setDragOver(false);
  };

  const handleDragOver = (e) => {
    if (disabledCondition) return;
    e.preventDefault();
  };

  const handleDrop = (e) => {
    if (disabledCondition) return;
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (disabledCondition) return;
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    if (disabledCondition) return;
    processFiles(e.target.files);
  };

  const processFiles = (files) => {
    const fileList = Array.from(files);
    setUploadedFiles((currentFiles) => [...currentFiles, ...fileList]);
  };

  const removeFile = (fileName) => {
    setUploadedFiles((currentFiles) =>
      currentFiles.filter((file) => file.name !== fileName)
    );
  };

  return (
    <div>
      <div
        className={`border ${
          dragOver ? "border-primary" : "border-secondary"
        } p-5 text-center`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <p>Drop files here or click to select</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleFileSelect}
        disabled={disabledCondition}
      />
      {uploadedFiles.map((file, index) => (
        <div
          key={index}
          className="d-flex align-items-center justify-content-between bg-light p-2 mt-2"
          style={{ borderRadius: "0.25rem", overflow: "hidden" }}
        >
          <div
            className="me-2"
            style={{
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginRight: "1rem",
            }}
          >
            {/* Added marginRight to create space between the text and the button */}
            <p className="mb-0">{file.name}</p>
          </div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => removeFile(file.name)}
          >
            &times;
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FileDrop;
