import React from "react";
import { Col, Row } from "reactstrap";
import { withErrorBoundary } from "../../../hoc.js";
import LiquidationsPerDaysTable from "./LiquidationsPerDaysTable.js";

function PerDayTab(props) {
  const { type } = props;
  return (
    <Row>
      <Col xl={12} className="mb-4">
        <LiquidationsPerDaysTable type={type} />
      </Col>
    </Row>
  );
}

export default withErrorBoundary(PerDayTab);
