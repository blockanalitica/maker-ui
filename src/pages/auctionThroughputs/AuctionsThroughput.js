import { Col, Row } from "reactstrap";
import { usePageTitle } from "../../hooks";
import React, { useState } from "react";
import ThroughputsTable from "./components/ThroughputsTable";
import Loader from "../../components/Loader/Loader.js";
import { useFetch, useQueryParams } from "../../hooks.js";
import AuctionDurationGraph from "./components/AuctionDurationGraph";

function AuctionsThroughput(props) {
  const queryParams = useQueryParams();
  const queryPercentLiquidated = queryParams.get("percentLiquidated") || 20;
  const [showApply, setShowApply] = useState(false);
  const [percentLiquidated, setPercentLiquidated] = useState(queryPercentLiquidated);
  usePageTitle("Auctions Throughput");

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/auctions/throughput/",
    {
      percent_liquidated: queryPercentLiquidated,
    }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  return (
    <>
      <h1 className="h3 mb-4">auctions throughput</h1>
      <Row>
        <Col xl={12} className="mb-5">
          <ThroughputsTable
            data={data}
            setShowApply={setShowApply}
            setPercentLiquidated={setPercentLiquidated}
            showApply={showApply}
            percentLiquidated={percentLiquidated}
          />
        </Col>
        <Col xl={12} className="mb-5">
          <AuctionDurationGraph data={data} />
        </Col>
      </Row>
    </>
  );
}

export default AuctionsThroughput;
