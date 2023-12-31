import React, { useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import JpTrainerApi from "../api/JpTrainerApi";
import KanjiApiDev from "../api/KanjiApiDev";
import LoadingSpinner from "../common/LoadingSpinner";
import { Button, Input } from "reactstrap";
import ErrorMessages from "../common/ErrorMessages";
import useFields from "../hooks/useFields";
import './CustomizeLists.css';


function CustomizeLists() {
  const { currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [userKanjiSets, setUserKanjiSets] = useState(null);
  const [chosenSet, setChosenSet] = useState(null);
  const [chosenSetId, setChosenSetId] = useState(null);
  const [errors, setErrors] = useState(null);
  const [formData, handleChange, resetForm] = useFields({
    kanji: "",
    newName: ""
  });

  useEffect(() => {
    setIsLoading(true);
    setErrors(null);
    if (currentUser) {
      getKanjiSets();
    };
    setIsLoading(false);
  }, [currentUser]);

  const getKanjiSets = async () => {
    try {
      setIsLoading(true);
      let sets = await JpTrainerApi.getUserKanjiSets(currentUser.username);
      setUserKanjiSets(
        sets.kanjiSets
      );
    }
    catch (err) {
      alert("Error Loading User's KanjiSets");
    }
    finally {
      setIsLoading(false);
    }
  };

  const onSelectSet = async (e) => {
    try {
      setIsLoading(true);
      setChosenSetId(+e.target.value);
      let set = await JpTrainerApi.getKanjiSet(+e.target.value);
      setChosenSet(set.kanjiSet);
    }
    catch (err) {
      setErrors(err);
    }
    finally {
      setIsLoading(false);
    }
  };

  const onDeleteSet = async (e) => {
    try {
      setIsLoading(true);
      let deleteId = +e.target.value;
      await JpTrainerApi.deleteSet(deleteId);
      setUserKanjiSets([...(userKanjiSets.filter(set => set.id !== deleteId))]);
    }
    catch (err) {
      setErrors(err);
    }
    finally {
      setIsLoading(false);
    }
  };

  const onAddSet = async (e) => {
    e.preventDefault();
    resetForm();
    try {
      setIsLoading(true);
      await JpTrainerApi.createKanjiSet(formData.newName);
      getKanjiSets();
    }
    catch (err) {
      setErrors(err);
    }
    finally {
      setIsLoading(false);
    }
  };

  const onAddKanji = async e => {
    e.preventDefault();
    setErrors(null);
    resetForm();
    try {
      setIsLoading(true);
      await KanjiApiDev.kanjiChar(formData.kanji);
      await JpTrainerApi.insertKanji(chosenSetId, formData.kanji);
      // changed here instead of requesting again since response is slow
      setChosenSet({ ...chosenSet, characters: [...(chosenSet.characters), formData.kanji] });

    }
    catch (err) {
      setErrors(err);
    }
    finally {
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const removeKanji = async (e) => {
    setErrors(null);
    try {
      setIsLoading(true);
      let removeValue = e.target.value;
      await JpTrainerApi.removeKanji(chosenSetId, removeValue);
      setChosenSet({
        ...chosenSet,
        characters: [...(chosenSet.characters.filter(character => character !== removeValue))]
      });
    }
    catch (err) {
      setErrors(err);
    }
    finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      {userKanjiSets && !chosenSet ?
        <>
          <h2 className="m-3">
            Edit: {userKanjiSets.map(set => (
              <Button
                key={set.id}
                className="m-2"
                value={set.id}
                color="success"
                onClick={onSelectSet}
              >
                {set.name}
              </Button>
            ))}
          </h2>
          <h2 className="m-3">
            Delete: {userKanjiSets.map(set => (
              <Button
                key={set.id}
                className="m-2"
                value={set.id}
                color="danger"
                onClick={onDeleteSet}
              >
                {set.name}
              </Button>
            ))}
          </h2>
          <h2 className="m-3">
            Add:
          </h2>
          <div className="d-flex m-3" >
            <form onSubmit={onAddSet}>
              <div className="mb-2">
                <Input
                  className="mb-2"
                  type="text"
                  name="newName"
                  value={formData.newName}
                  onChange={handleChange}
                  placeholder="Add a New Set" />

                <Button>Add Set</Button>
              </div>
            </form>
          </div>

        </>
        :
        ""
      }
      {
        chosenSet ?
          <>
            <div className="d-flex m-3" >
              <form onSubmit={onAddKanji}>
                <div className="mb-2">
                  <Input
                    className="mb-2"
                    type="text"
                    name="kanji"
                    value={formData.kanji}
                    onChange={handleChange}
                    placeholder="Kanji" />
                  <Button>Add Kanji</Button>
                </div>
              </form>
              {errors ? <div className="ml-2"><ErrorMessages errors={errors} /></div> : null}
            </div>
            <p className="m-3">Click on a Kanji Character to Remove</p>
            {chosenSet.characters.map(character => (
              <Button
                key={character}
                value={character}
                className="m-3 remove-kanji"
                color="danger"
                onClick={removeKanji}
              >
                {character}
              </Button>
            ))}
          </>
          :
          ""
      }

    </>
  );
}

export default CustomizeLists;