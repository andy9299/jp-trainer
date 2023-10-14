import React from "react";
import { Alert } from "reactstrap";

const ErrorMessages = ({ errors }) => {
  return ((Array.isArray(errors)) ?
    errors.map((err, idx) => <Alert className="" color="danger" key={idx}>
      An error has occurred {err.message ? `: ${err.message}` : `: ${err}`}
    </Alert>)
    : <Alert color="danger" className="">
      An error has occurred {errors.message ? `: ${errors.message}` : `${errors}`}
    </Alert>);
};

export default ErrorMessages;