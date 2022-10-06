// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { Col, Row } from "reactstrap";

import { withErrorBoundary } from "../../../hoc.js";
import DailyVolatilityChart from "./DailyVolatilityChart.js";
import DrawdownsChart from "./DrawdownsChart.js";
import OSMDrawdownsChart from "./OSMDrawdownsChart.js";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import SideTabContent from "../../../components/SideTab/SideTabContent.js";

function DrawdownsCard(props) {
  const { symbol } = props;
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <Row>
      <Col xl={3}>
        <SideTabNav
          activeTab={activeTab}
          toggleTab={toggleTab}
          tabs={[
            { id: "1", text: "Daily volatility" },
            { id: "2", text: "Drawdowns - price jumps" },
            { id: "3", text: "OSM drawdowns - price jumps" },
          ]}
        />
      </Col>
      <Col xl={9}>
        <SideTabContent
          activeTab={activeTab}
          tabs={[
            {
              id: "1",
              content: <DailyVolatilityChart symbol={symbol} />,
            },
            {
              id: "2",
              content: <DrawdownsChart symbol={symbol} />,
            },
            {
              id: "3",
              content: <OSMDrawdownsChart symbol={symbol} />,
            },
          ]}
        />
      </Col>
    </Row>
  );
}

export default withErrorBoundary(DrawdownsCard);
