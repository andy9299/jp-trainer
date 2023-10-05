import React, { useContext, useState } from "react";
import useFields from "../hooks/useFields";
import { Button, Input } from "reactstrap";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import ErrorMessages from "../common/ErrorMessages";
import './Form.css';

function LoginForm() {
  const { login } = useContext(UserContext);
  const history = useNavigate();
  const [formData, handleChange] = useFields({
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState(null);
  const handleSubmit = async e => {
    try {
      e.preventDefault();
      await login(formData);
      history('/');
    }
    catch (err) {
      setErrors(err);
    }
  };
  return (
    <div className="vh-nav d-flex justify-content-center align-items-center" >
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
            autoComplete="on"
            className="mb-2"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password" />
          <Button>Login</Button>
        </div>
        {errors ? <ErrorMessages errors={errors} /> : null}
      </form>
    </div>

  );
}

export default LoginForm;