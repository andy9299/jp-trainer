import React, { useContext, useState } from "react";
import useFields from "../hooks/useFields";
import { Button, Input } from "reactstrap";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import ErrorMessages from "../common/ErrorMessages";
import LoadingSpinner from "../common/LoadingSpinner";
import './Form.css';

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(UserContext);
  const history = useNavigate();
  const [formData, handleChange] = useFields({
    username: "",
    password: "",
    email: ""
  });
  const [errors, setErrors] = useState(null);
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
      history('/');
    }
    catch (err) {
      setErrors(err);
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="vh-nav d-flex justify-content-center align-items-center">
      <form className="w40vw" onSubmit={handleSubmit}>
        <div className="mb-2">
          <Input
            className="mb-2"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username" />
          <Input
            className="mb-2"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password" />
          <Input
            className="mb-2"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email" />
          <Button>Register</Button>
        </div>
        {errors ? <ErrorMessages errors={errors} /> : null}
      </form>
    </div>

  );
}

export default RegisterForm;