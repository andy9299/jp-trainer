import React, { useContext, useState } from "react";
import useFields from "../hooks/useFields";
import { Button, Input } from "reactstrap";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import ErrorMessages from "../common/ErrorMessages";
import LoadingSpinner from "../common/LoadingSpinner";

function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { editProfile, currentUser } = useContext(UserContext);
  const history = useNavigate();
  const [formData, handleChange] = useFields({
    email: currentUser.email,
    password: ""
  });
  const [errors, setErrors] = useState(null);
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await editProfile(formData);
      history('/');
    }
    catch (err) {
      setErrors(err);
    }
    setIsLoading(false);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="vh-nav d-flex justify-content-center align-items-center" >
      <form className="w40vw" onSubmit={handleSubmit}>
        <div className="mb-2">
          <Input
            disabled
            className="mb-2"
            type="username"
            name="username"
            value={currentUser.username}
            placeholder='username' />
          <Input
            className="mb-2"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='Email' />
          <Input
            className="mb-2"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder='Password' />
          <Button>Edit Profile</Button>
        </div>
        {errors ? <ErrorMessages errors={errors} /> : null}
      </form>
    </div>
  );
}
export default ProfileForm;