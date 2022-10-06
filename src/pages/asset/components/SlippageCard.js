// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { withErrorBoundary } from "../../../hoc.js";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import SideTabContent from "../../../components/SideTab/SideTabContent.js";
import SlippageGraph from "./SlippageGraph.js";
import SlippageHistoryGraph from "./SlippageHistoryGraph.js";

function SlippageCard(props) {
  const { symbol } = props;
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <Row className="mb-4">
        <Col xl={3}>
          <SideTabNav
            activeTab={activeTab}
            toggleTab={toggleTab}
            tabs={[
              { id: "1", text: "Slippage" },
              { id: "2", text: "Slippage history" },
            ]}
          />
        </Col>
        <Col xl={9}>
          <SideTabContent
            activeTab={activeTab}
            tabs={[
              {
                id: "1",
                content: <SlippageGraph symbol={symbol} />,
              },
              {
                id: "2",
                content: <SlippageHistoryGraph symbol={symbol} />,
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(SlippageCard);
