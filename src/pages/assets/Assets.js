// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { withErrorBoundary } from "../../hoc.js";
import { usePageTitle } from "../../hooks";
import SideTabNav from "../../components/SideTab/SideTabNav.js";
import SideTabContent from "../../components/SideTab/SideTabContent.js";
import AssetsTable from "./components/AssetsTable.js";
import CEXVolumeChart from "./components/CEXVolumeChart.js";
import SlippageChart from "./components/SlippageChart.js";
import DEXLiquidityChart from "./components/DEXLiquidityChart.js";
import DEXVolumeChart from "./components/DEXVolumeChart.js";
import DailyVolatilityChart from "./components/DailyVolatilityChart.js";
import PriceDrawdownsChart from "./components/PriceDrawdownsChart.js";

function Assets(props) {
  usePageTitle("Assets");
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  return (
    <>
      <Row>
        <Col xl={12} className="mb-4">
          <AssetsTable />
        </Col>
        <Col xl={12} className="mb-4">
          <SlippageChart />
        </Col>
      </Row>
      <Row>
        <Col xl={3}>
          <SideTabNav
            activeTab={activeTab}
            toggleTab={toggleTab}
            tabs={[
              { id: "1", text: "CEX trading volume" },
              { id: "2", text: "DEX trading volume" },
              { id: "3", text: "AMM asset deposits" },
              { id: "4", text: "daily volatility" },
              { id: "5", text: "price drawdowns - price jumps" },
            ]}
          />
        </Col>
        <Col xl={9}>
          <SideTabContent
            activeTab={activeTab}
            tabs={[
              {
                id: "1",
                content: <CEXVolumeChart />,
              },
              {
                id: "2",
                content: <DEXLiquidityChart />,
              },
              {
                id: "3",
                content: <DEXVolumeChart />,
              },
              {
                id: "4",
                content: <DailyVolatilityChart />,
              },
              {
                id: "5",
                content: <PriceDrawdownsChart />,
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(Assets);
