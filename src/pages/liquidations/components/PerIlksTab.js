import React from "react";
import { Col, Row } from "reactstrap";
import { withErrorBoundary } from "../../../hoc.js";
import LiquidationsPerIlksTable from "./LiquidationsPerIlksTable.js";

function PerIlksTab(props) {
  return (
    <Row>
      <Col xl={12} className="mb-4">
        <LiquidationsPerIlksTable />
      </Col>
    </Row>
  );
}

export default withErrorBoundary(PerIlksTab);
