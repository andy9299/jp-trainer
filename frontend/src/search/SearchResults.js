import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import ErrorMessages from "../common/ErrorMessages";
import KanjiApiDev from "../api/KanjiApiDev";
import LoadingSpinner from "../common/LoadingSpinner";
import SearchForm from "../forms/SearchForm";
import KanjiDetails from "../details/KanjiDetails";

function SearchResults() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [dataArray, setDataArray] = useState([]);
  const search = async (query, type) => {
    try {
      setIsLoading(true);
      setErrors(null);
      if (type === "kanji") {
        const kanjiData = await KanjiApiDev.kanjiChar(query);
        setDataArray([...dataArray, kanjiData]);
      }
      else {
        throw new Error("Invalid Search");
      }
    }
    catch (err) {
      setErrors(err);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.state) {
      search(location.state.query, location.state.type);
      window.history.replaceState({}, document.title);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="m-3">
      <SearchForm search={search} />
      {errors ? <ErrorMessages errors={errors} /> : ""}
      {dataArray.length ?
        <>
          {dataArray.reverse().map((data, index) =>
            <KanjiDetails
              key={`${data.kanji}-${index}`}
              data={data}
            />
          )}
        </> :
        ""
      }

    </div>
  );
}

export default SearchResults;