import React from "react";
import { Spinner } from "reactstrap";

const LoadingSpinner = () => {

  return (
    <div className="d-flex justify-content-center mt-3" >
      <Spinner />
    </div>
  );
};

export default LoadingSpinner;