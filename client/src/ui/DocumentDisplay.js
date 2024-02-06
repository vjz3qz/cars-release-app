function DocumentDisplay({ sourceDocument }) {
  return (
    <iframe
      src={sourceDocument}
      title="PDF Viewer"
      width="100%"
      height="900px"
    ></iframe>
  );
}

export default DocumentDisplay;
