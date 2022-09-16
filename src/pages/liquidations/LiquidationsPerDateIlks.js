import React from "react";
import { Col, Row } from "reactstrap";
import { withErrorBoundary } from "../../hoc.js";
import LiquidationsPerDatePerIlksTable from "./components/LiquidationsPerDatePerIlksTable.js";

function PerDateIlks(props) {
  return (
    <Row>
      <Col xl={12} className="mb-4">
        <LiquidationsPerDatePerIlksTable />
      </Col>
    </Row>
  );
}

export default withErrorBoundary(PerDateIlks);
