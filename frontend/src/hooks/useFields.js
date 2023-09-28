import { useState } from "react";

const useFields = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = e => {
    const { value, name } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: value
    }));
  };
  const resetForm = () => {
    setFormData(initialState);
  };
  return [formData, handleChange, resetForm];
};

export default useFields;