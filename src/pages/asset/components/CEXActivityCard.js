// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import SideTabContent from "../../../components/SideTab/SideTabContent.js";
import { withErrorBoundary } from "../../../hoc.js";
import CEXExchangeActivity from "./CEXExchangeActivity.js";
import CEXTotalActivity from "./CEXTotalActivity.js";
import CEXPairActivity from "./CEXPairActivity.js";

function CEXActivityCard(props) {
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
            { id: "1", text: "Total volume" },
            { id: "2", text: "Per exchange" },
            { id: "3", text: "Per asset pair" },
          ]}
        />
      </Col>
      <Col xl={9}>
        <SideTabContent
          activeTab={activeTab}
          tabs={[
            {
              id: "1",
              content: <CEXTotalActivity symbol={symbol} />,
            },
            {
              id: "2",
              content: <CEXExchangeActivity symbol={symbol} />,
            },
            {
              id: "3",
              content: <CEXPairActivity symbol={symbol} />,
            },
          ]}
        />
      </Col>
    </Row>
  );
}

export default withErrorBoundary(CEXActivityCard);
