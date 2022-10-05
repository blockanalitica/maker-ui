import React from "react";
import { Col, Row } from "reactstrap";
import { withErrorBoundary } from "../../hoc.js";
import { usePageTitle } from "../../hooks";
import RatesSection from "./components/RatesSection.js";
import TVLSection from "./components/TVLSection.js";

function Defi(props) {
  usePageTitle("DeFi");

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h1>DeFi</h1>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xl={12}>
          <RatesSection />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xl={12}>
          <TVLSection />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(Defi);
