import React, { useEffect, useState } from "react";
import { Input, Tooltip, Container, Row, Col } from "reactstrap";
import './Trainer.css';
function Trainer({ ansObj, onCorrect = () => { } }) {
  const [inputData, setInputData] = useState("");
  const [key, setKey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipHint, setTooltipHint] = useState(true);

  useEffect(() => {
    selectAns();
  }, []);

  useEffect(() => {
    if (answers === inputData.toLowerCase()
      || (Array.isArray(answers) && answers.includes(inputData.toLowerCase()))) {
      handleCorrect();
    }
  }, [inputData]);

  const handleChange = e => {
    const { value } = e.target;
    setInputData(value);
  };

  const handleCorrect = () => {
    setTooltipHint(false);
    setInputData("");
    onCorrect(key);
    selectAns();
  };

  const selectAns = () => {
    delete ansObj[''];
    const keys = Object.keys(ansObj);
    let randomKey;
    do {
      randomKey = keys[Math.floor(Math.random() * keys.length)];
    } while ((randomKey === "" || randomKey === key) && keys.length > 1);
    setKey(randomKey);
    setAnswers(ansObj[randomKey]);
  };

  const toggle = () => setTooltipOpen(!tooltipOpen);

  if (Object.keys(ansObj).length === 0) return (
    <h1 className="text-center">Please Add Kanji To Your List</h1>
  );

  return (
    <div>
      <Container className="mt-5" >
        <Row className="text-center">
          <Col >
            <p id="key" style={{ fontSize: "500%" }} className="m" >
              {key}
            </p>
            <Tooltip
              isOpen={tooltipOpen}
              target="key"
              toggle={toggle}
            >
              {Array.isArray(answers) ? answers.join(", ") : answers}
            </Tooltip>
          </Col>
        </Row>
        <Row className="text-center">
          <Col>
            <Input
              className="mx-auto w-25"
              value={inputData}
              onChange={handleChange}
              placeholder={tooltipHint ? "Hover Character for a Hint" : ""}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Trainer;