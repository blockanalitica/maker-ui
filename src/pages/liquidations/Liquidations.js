// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import queryString from "query-string";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import SideTabContent from "../../components/SideTab/SideTabContent.js";
import SideTabNav from "../../components/SideTab/SideTabNav.js";
import { withErrorBoundary } from "../../hoc.js";
import { useQueryParams } from "../../hooks";
import PerDayTab from "./components/PerDayTab.js";
import PerIlksTab from "./components/PerIlksTab.js";
import PerLiquidationTab from "./components/PerLiquidationTab.js";
import UniqueKeepersTakers from "./components/UniqueKeepersTakers.js";

function Liquidations(props) {
  const navigate = useNavigate();

  const queryParams = useQueryParams();
  const qParams = {
    tab: queryParams.get("tab") || "per-liquidation",
  };

  const [activeTab, setActiveTab] = useState(qParams.tab);
  const [params, setParams] = useState(qParams);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setParams({
        ...params,
        tab: tab,
      });

      const queryParams = {
        ...params,
        tab: tab,
      };
      let qs = queryString.stringify(queryParams, { skipNull: true });
      navigate(`?${qs}`);
    }
  };

  return (
    <>
      <Row>
        <Col xl={2}>
          <SideTabNav
            activeTab={activeTab}
            toggleTab={toggleTab}
            tabs={[
              { id: "per-liquidation", text: "per liquidation" },
              { id: "per-date", text: "per date" },
              { id: "per-vault-type", text: "per vault type" },
              { id: "keppers-takers", text: "keepers/takers" },
            ]}
          />
        </Col>
        <Col xl={10}>
          <SideTabContent
            activeTab={activeTab}
            tabs={[
              {
                id: "per-liquidation",
                content: <PerLiquidationTab />,
              },
              {
                id: "per-date",
                content: <PerDayTab type={"tab"} />,
              },
              {
                id: "per-vault-type",
                content: <PerIlksTab />,
              },
              {
                id: "keppers-takers",
                content: <UniqueKeepersTakers />,
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(Liquidations);
