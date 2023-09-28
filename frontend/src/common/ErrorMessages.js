import React from "react";
import { Alert } from "reactstrap";

const ErrorMessages = ({ errors }) => {

  return ((Array.isArray(errors)) ?
    errors.map(err => <Alert className="m-2" color="danger">
      An error has occurred {err.message ? `: ${err.message}` : ""}
    </Alert>)
    : <Alert color="danger" className="m-2">
      An error has occurred {errors.message ? `: ${errors.message}` : ""}
    </Alert>);
};

export default ErrorMessages;