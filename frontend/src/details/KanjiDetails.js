import React from "react";
import { Card, CardBody, Container, Row, Col } from "reactstrap";
import './KanjiDetails.css';

function KanjiDetails({ data }) {
  const {
    kanji,
    meanings,
    kun_readings: kunReadings,
    on_readings: onReadings,
    name_readings: nameReadings,
    grade,
    jlpt,
    stroke_count: strokes,
    unicode,
    heisig_en: heisigEn
  } = data;

  return (
    <Card className="m-2  bg-dark text-white">
      <CardBody>
        <Container>
          <Row className="align-items-center text-center">
            <Col xs="auto" style={{ fontSize: "500%" }}>
              <p>
                {kanji}
              </p>
            </Col>
            <Col >
              {meanings.map((meaning, index) => (
                <p key={index}>
                  {meaning}
                </p>
              ))}
            </Col>
            <Col  >
              <p>
                Kun Readings: {kunReadings ? kunReadings.join(", ") : "N/A"}
              </p>
              <p>
                On Readings: {onReadings ? onReadings.join(", ") : "N/A"}
              </p>
              <p>
                Name Readings: {nameReadings.length ? nameReadings.join(", ") : "N/A"}
              </p>
            </Col>
            <Col >
              <p>
                Grade: {grade || "N/A"}
              </p>
              <p>
                JLPT: {jlpt || "N/A"}
              </p>
              <p>
                Strokes: {strokes || "N/A"}
              </p>
              <p>
                Unicode: {unicode ? `U+${unicode}` : "N/A"}
              </p>
              <p>
                Heisig Keyword: {heisigEn || "N/A"}
              </p>
            </Col>
          </Row>
        </Container>
      </CardBody>
    </Card>
  );
}
export default KanjiDetails;