export default function FormErrorMessage({ errorMessage }) {
  return (
    <div style={{ width: "50%" }}>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
