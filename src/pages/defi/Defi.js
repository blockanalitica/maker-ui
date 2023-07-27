// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Col, Row } from "reactstrap";
import { withErrorBoundary } from "../../hoc.js";
import { usePageTitle } from "../../hooks";
import RatesSection from "./components/RatesSection.js";
import TVLSection from "./components/TVLSection.js";
import ETHShare from "./components/ETHShare.js";
import ETHShareHistoric from "./components/ETHShareHistoric.js";
function Defi(props) {
  usePageTitle("DeFi");

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h1>DeFi</h1>
          <p>
            An overview of the cost of borrowing across major DeFi lending protocols
            (Maker, Aave, Compound) either DAI or USDC.
          </p>
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
      <Row className="mb-4">
        <Col xl={6}>
          <ETHShare />
        </Col>
        <Col xl={6}>
          <ETHShareHistoric />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(Defi);
