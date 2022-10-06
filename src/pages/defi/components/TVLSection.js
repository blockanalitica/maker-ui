// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../../components/Loader/Loader.js";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import TVLChart from "./TVLChart.js";

function TVLSection(props) {
  const [type, setType] = useState("WETH");
  const [timePeriod, setTimePeriod] = useState(30);

  const options = [
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
    { key: 180, value: "180 days" },
    { key: 1000, value: "all" },
  ];

  let tabs = [
    { id: "WETH", text: "ETH" },
    { id: "WBTC", text: "WBTC" },
    // { id: "stETH", text: "stETH" },
  ];

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/defi/tvl/${type}/`,
    {
      days_ago: timePeriod,
    }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  let content = null;

  content = <TVLChart timePeriod={timePeriod} type={type} data={data.results} />;
  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <div className="mb-2 flex-grow-1 d-flex align-items-center">
          <CryptoIcon name={type} size="3rem" className="me-2" />
          <h1 className="h3 m-0">TVL</h1>
        </div>
        <TimeSwitch
          activeOption={timePeriod}
          label={""}
          onChange={setTimePeriod}
          options={options}
        />
      </div>
      <Row className="mb-4">
        <Col md={2}>
          <SideTabNav activeTab={type} toggleTab={setType} tabs={tabs} />
        </Col>
        <Col md={10}>
          <Row className="mb-4">
            <Col className="mt-4" xl={12}>
              {content}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(TVLSection);
