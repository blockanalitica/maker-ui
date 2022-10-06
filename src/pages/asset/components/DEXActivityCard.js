// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { withErrorBoundary } from "../../../hoc.js";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import SideTabContent from "../../../components/SideTab/SideTabContent.js";
import DEXLiquidityChart from "./DEXLiquidityChart.js";
import DEXVolumeChart from "./DEXVolumeChart.js";

function DEXActivityCard(props) {
  const { symbol } = props;
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <Row className="mb-4">
      <Col xl={3}>
        <SideTabNav
          activeTab={activeTab}
          toggleTab={toggleTab}
          tabs={[
            { id: "1", text: "DEX trading volume" },
            { id: "2", text: "AMM asset deposits" },
          ]}
        />
      </Col>
      <Col xl={9}>
        <SideTabContent
          activeTab={activeTab}
          tabs={[
            {
              id: "1",
              content: <DEXVolumeChart symbol={symbol} />,
            },
            {
              id: "2",
              content: <DEXLiquidityChart symbol={symbol} />,
            },
          ]}
        />
      </Col>
    </Row>
  );
}

export default withErrorBoundary(DEXActivityCard);
