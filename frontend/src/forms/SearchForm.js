import React from "react";
import useFields from "../hooks/useFields";
import { Button, Input } from "reactstrap";


function SearchForm({ search }) {
  const [formData, handleChange, resetForm] = useFields({
    searchQuery: "",
    searchType: "kanji"
  });
  const handleSubmit = e => {
    e.preventDefault();
    search(formData.searchQuery, formData.searchType);
    resetForm();
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex justify-content-center">
        <div className="input-group m-2 w-75">
          <div className="input-group-prepend">
            <div >
              <Input
                name="searchType"
                type="select"
                value={formData.searchType}
                onChange={handleChange} >
                <option>
                  kanji
                </option>
              </Input>
            </div>
          </div>
          <Input
            type="text"
            name="searchQuery"
            value={formData.searchQuery}
            onChange={handleChange}
            placeholder="Search" />
          <div className="input-group-append">
            <Button color="secondary">Search</Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default SearchForm;