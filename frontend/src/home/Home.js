import React from "react";
import { Container, Row, Col } from "reactstrap";
import './Home.css';

function Home() {

  return (
    <>
      <Container className="vh-nav d-flex justify-content-center align-items-center ">
        <Row >
          <Col>
            <p className="text-center kanji">
              練
            </p>
            <p className="text-center">
              to train
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default Home;