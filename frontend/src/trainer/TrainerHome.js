import React, { useEffect, useState, useContext } from "react";
import ErrorMessages from "../common/ErrorMessages";
import LoadingSpinner from "../common/LoadingSpinner";
import Trainer from "./Trainer";
import { Button } from "reactstrap";
import KanjiDetails from "../details/KanjiDetails";
import KanaArr from "./KanaArr";
import KanaTable from "./KanaTable";
import UserContext from "../context/UserContext";
import JpTrainerApi from "../api/JpTrainerApi";
import KanjiApiDev from "../api/KanjiApiDev";


function TrainerHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [ansObj, setAnsObj] = useState(null);
  const [errors, setErrors] = useState(null);
  const [prevKanji, setPrevKanji] = useState(null);
  const [type, setType] = useState("");
  const [checkedCols, setCheckedCols] = useState(new Set([0]));
  const [displayTables, setDisplayTables] = useState(false);
  const [userKanjiSets, setUserKanjiSets] = useState(null);
  const { currentUser } = useContext(UserContext);

  let hiragana = KanaArr.slice(0, 16);
  let combinedHiragana = KanaArr.slice(16, 28);
  let katakana = KanaArr.slice(28, 44);
  let combinedKatakana = KanaArr.slice(45);

  // Sets ansObj to: {key: [ans1, ans2, ...], ...}
  const reqAnsObjByKanji = async (kanjiList) => {
    setIsLoading(true);
    let answers = {};
    try {
      await Promise.all(kanjiList.map(async (kanji) => {
        const kanjiData = await KanjiApiDev.kanjiChar(kanji);
        answers[kanji] = kanjiData.meanings;
      }));
      setAnsObj(answers);
    }
    catch (err) {
      setErrors(err);
    }
    finally {
      setIsLoading(false);
    }

  };
  // Kana === Hiragana && Katakana
  const loadKana = async () => {
    console.log(userKanjiSets);
    setIsLoading(true);
    setType("kana");
    let kanaArray = [];
    checkedCols.forEach((idx) => {
      kanaArray = kanaArray.concat(KanaArr[idx]);
    });
    setPrevKanji(null);
    await setAnsObj(Object.assign({}, ...(kanaArray)));
    setIsLoading(false);
  };

  const loadByGrade = async (e) => {
    setIsLoading(true);
    setType("kanji");
    try {
      const kanjiList = await KanjiApiDev.kanjiGrade(e.target.value);
      await reqAnsObjByKanji(kanjiList);
    }
    catch (err) {
      setErrors(err);
    }
    finally {
      setIsLoading(false);
    }
  };

  const loadByKanjiSet = async (e) => {
    setIsLoading(true);
    setType("kanji");
    try {
      const kanjiList = userKanjiSets.find(set => set.id === +e.target.value).characters;
      await reqAnsObjByKanji(kanjiList);
    }
    catch (err) {
      setErrors(err);
    }
    finally {
      setIsLoading(false);
    }
  };

  const onCorrectKanji = async (kanji) => {
    const kanjiData = await KanjiApiDev.kanjiChar(kanji);
    setPrevKanji(kanjiData);
  };

  const onChangeKana = async (e) => {
    if (e.target.checked) {
      setCheckedCols(new Set(checkedCols.add(+e.target.value)));
    }
    else {
      checkedCols.delete(+e.target.value);
      await setCheckedCols(new Set(checkedCols));
    }
  };

  const toggleKanaTables = () => {
    setDisplayTables(!displayTables);
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (checkedCols.size === 0) setCheckedCols(new Set([0]));
    if (type === 'kana') loadKana();
  }, [checkedCols]);

  useEffect(() => {
    setIsLoading(true);
    if (currentUser) {
      async function getKanjiSets() {
        try {
          let sets = await JpTrainerApi.getUserKanjiSets(currentUser.username);
          setUserKanjiSets(
            sets.kanjiSets
          );
        }
        catch (err) {
          alert("Error Loading User's Kanji Sets");
        }
      }
      getKanjiSets();
    }
    setIsLoading(false);
  }, [currentUser]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      {errors ? <ErrorMessages errors={errors} /> : ""}
      {type ?
        ""
        :
        <>
          <h2 className="m-3">
            By Grade: {[1, 2, 3, 4, 5, 6].map((grade) => (
              <Button
                key={grade}
                className="m-2"
                value={grade}
                color="success"
                onClick={loadByGrade}>
                {grade}
              </Button>)
            )}
          </h2>
          <h2 className="m-3">
            Hiragana/Katakana:
            <Button
              className="m-2"
              color="success"
              onClick={loadKana}>
              Go
            </Button>
          </h2>
          {userKanjiSets ?
            <h2 className="m-3">
              By Kanji Set:{userKanjiSets.map((kanjiSet) => (
                <Button
                  key={kanjiSet.id}
                  className="m-2"
                  value={kanjiSet.id}
                  color="success"
                  onClick={loadByKanjiSet}>
                  {kanjiSet.name}
                </Button>
              ))}
            </h2>
            :
            ""
          }

        </>
      }
      {ansObj ?
        (type === "kanji" ?
          <div className="p-3">
            <Trainer ansObj={ansObj} onCorrect={onCorrectKanji} />
          </div>

          :
          <div className="p-3">
            <Trainer ansObj={ansObj} />
          </div>
        )
        :
        ""
      }
      <div className="p-3">
        {prevKanji ?
          <KanjiDetails data={prevKanji} />
          :
          ""
        }
        {type === "kana" ?
          (<>
            <Button
              block
              color="dark"
              onClick={toggleKanaTables}
            >
              Show/Hide Kana Options
            </Button>
            {displayTables ?
              (
                <div>
                  <KanaTable kanaArr={hiragana} startIndex={0} onChange={onChangeKana} checkedCols={checkedCols} />
                  <KanaTable kanaArr={combinedHiragana} startIndex={16} onChange={onChangeKana} checkedCols={checkedCols} />
                  <KanaTable kanaArr={katakana} startIndex={28} onChange={onChangeKana} checkedCols={checkedCols} />
                  <KanaTable kanaArr={combinedKatakana} startIndex={44} onChange={onChangeKana} checkedCols={checkedCols} />
                </div>
              )
              :
              ""
            }
          </>
          )
          :
          ""
        }
      </div>
      <div>
      </div>
    </>


  );
}

export default TrainerHome;