// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import PropTypes from "prop-types";
import { withErrorBoundary } from "../../../hoc.js";
import Card from "../../../components/Card/Card.js";
import PerVaultTypePeriodicalGraph from "./PerVaultTypePeriodicalGraph.js";

function PerVaultTypePeriodicalCard(props) {
  const [activeTab, setActiveTab] = useState("1");
  const { data_7d, data_30d, data_90d } = props;
  if (!data_7d || !data_30d || !data_90d) {
    return null;
  }

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <Card title="Organic Debt Demand per Vault Type">
      <p className="mb-4">
        Organic debt demand growth per vault type in the last 7/30/90 days. Organic debt
        demand is computed by normalizing DAI supply change with collateral price
        change. Includes vault types with at least 1M of outstanding DAI at the
        beginning of the chosen period.
      </p>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => {
              toggleTab("1");
            }}
          >
            7 days
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => {
              toggleTab("2");
            }}
          >
            30 days
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "3" })}
            onClick={() => {
              toggleTab("3");
            }}
          >
            90 days
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          {activeTab === "1" ? <PerVaultTypePeriodicalGraph data={data_7d} /> : null}
        </TabPane>
        <TabPane tabId="2">
          {activeTab === "2" ? <PerVaultTypePeriodicalGraph data={data_30d} /> : null}
        </TabPane>
        <TabPane tabId="3">
          {activeTab === "3" ? <PerVaultTypePeriodicalGraph data={data_90d} /> : null}
        </TabPane>
      </TabContent>
    </Card>
  );
}

PerVaultTypePeriodicalCard.propTypes = {
  data_7d: PropTypes.array,
  data_30d: PropTypes.array,
  data_90d: PropTypes.array,
};

export default withErrorBoundary(PerVaultTypePeriodicalCard);
