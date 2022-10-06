// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Col, Row } from "reactstrap";
import { withErrorBoundary } from "../../hoc.js";
import { usePageTitle } from "../../hooks";
import StatsCard from "./components/StatsCard.js";
import PastHoursCard from "./components/PastHoursCard.js";
import PastDayCard from "./components/PastDayCard.js";
import VolumePerExchangeCard from "./components/VolumePerExchangeCard.js";
import DailyCard from "./components/DailyCard.js";

function DaiTrades(props) {
  usePageTitle("DAI Trades");

  return (
    <>
      <h1 className="mb-4">DAI trades</h1>
      <p>
        Data is refreshed periodically from{" "}
        <a href="https://dai.stablecoin.science/" target="_blank" rel="noreferrer">
          dai.stablecoin.science
        </a>
        .
      </p>
      <Row>
        <Col xl={12} className="mb-4">
          <StatsCard />
        </Col>
        <Col xl={12} className="mb-4">
          <PastHoursCard />
        </Col>
        <Col xl={12} className="mb-4">
          <PastDayCard />
        </Col>
        <Col xl={12} className="mb-4">
          <VolumePerExchangeCard />
        </Col>
        <Col xl={12} className="mb-4">
          <DailyCard />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(DaiTrades);
