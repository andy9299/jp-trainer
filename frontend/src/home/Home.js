import React from "react";
import { Container, Row, Col } from "reactstrap";
import './Home.css';
import SearchForm from "../forms/SearchForm";
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate();

  const redirectToResults = (query, type) => {
    navigate('/search', { state: { query, type } });
  };

  return (
    <Container className="text-center">
      <Row xs="2" className="align-items-center center g-0">
        <Col>
          <SearchForm search={redirectToResults} />
        </Col>
        <Col>
          Column
        </Col>
      </Row>
    </Container>
  );
}
export default Home;