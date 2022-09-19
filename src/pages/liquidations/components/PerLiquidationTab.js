import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import Card from "../../../components/Card/Card.js";
import Loader from "../../../components/Loader/Loader.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import LiquidatedAssetChart from "./LiquidatedAssetChart.js";
import LiquidationsInfo from "./LiquidationsInfo.js";
import LiquidationsTable from "./LiquidationsTable.js";
import LiquidationsTimelineBarChart from "./LiquidationsTimelineBarChart.js";

function PerLiquidationTab(props) {
  const [daysAgo, setDaysAgo] = useState(30);

  const timeOptions = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
    { key: 365, value: "1 year" },
    { key: 0, value: "all" },
  ];

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "maker/liquidations/",
    { days_ago: daysAgo },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { results, totals } = data;

  return (
    <Row>
      <TimeSwitch
        className="mb-3 justify-content-end"
        activeOption={daysAgo}
        onChange={setDaysAgo}
        options={timeOptions}
      />

      <Col xl={12} className="mb-4">
        <LiquidationsInfo data={totals} />
      </Col>
      {results.length > 0 ? (
        <>
          <Col xl={6} className="mb-4">
            <h3>liquidations</h3>
            <LiquidationsTimelineBarChart results={results} daysAgo={daysAgo} />
          </Col>
          <Col xl={6} className="mb-4">
            <LiquidatedAssetChart daysAgo={daysAgo} />
          </Col>
          <Col xl={12} className="mb-4">
            <LiquidationsTable daysAgo={daysAgo} />
          </Col>
        </>
      ) : (
        <Col xl={12} className="mb-4">
          <Card className="text-center">
            <h5>No liquidations in last {daysAgo} days.</h5>
          </Card>
        </Col>
      )}
    </Row>
  );
}

export default withErrorBoundary(PerLiquidationTab);
