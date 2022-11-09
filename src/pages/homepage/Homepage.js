// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import { withErrorBoundary } from "../../hoc.js";
import { usePageTitle } from "../../hooks";
import CapitalAtRiskCard from "./components/CapitalAtRiskCard.js";
import IlksTable from "./components/IlksTable.js";
import LiquidationCurveCard from "./components/LiquidationCurveCard.js";
import StatsCard from "./components/StatsCard.js";
import DropTable from "./components/DropTable.js";
import ProtectionHistoryChart from "./components/ProtectionHistoryChart.js";
import PerDropHistoryChart from "./components/PerDropHistoryChart.js";
import SideTabNav from "../../components/SideTab/SideTabNav.js";
import SideTabContent from "../../components/SideTab/SideTabContent.js";
import GasMonitor from "./components/GasMonitor.js";
import VaultsAtRiskCard from "./components/VaultsAtRiskCard.js";
import RiskyDebtPercentageGraph from "./components/RiskyDebtPercentageGraph.js";

function Homepage(props) {
  usePageTitle("Maker Risk");

  const [activeTab, setActiveTab] = useState("1");
  const [timePeriod, setTimePeriod] = useState(1);
  const [riskTimePeriod, setRiskTimePeriod] = useState(30);

  const timeSwitchOptions = [
    { key: 1, value: "1 day" },
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
    { key: 365, value: "1 year" },
  ];

  let description =
    "Debt Amount at risk of liquidation, assuming a drop in collateral price without any vault owner action to increase their position’s collateralization ratio. ";

  return (
    <>
      <VaultsAtRiskCard />
      <div className="text-end mb-4">
        <TimeSwitch activeOption={timePeriod} onChange={setTimePeriod} />
      </div>
      <Row className="mb-4">
        <Col>
          <StatsCard daysAgo={timePeriod} />
        </Col>
      </Row>

      <Row className="mb-5">
        <Col xl={6}>
          <LiquidationCurveCard />
        </Col>
        <Col xl={6}>
          <CapitalAtRiskCard />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <IlksTable daysAgo={timePeriod} />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col sm={12}>
          <h4 className="mb-4">Risk</h4>
        </Col>
        <Col xl={3}>
          <SideTabNav
            activeTab={activeTab}
            toggleTab={(tab) => setActiveTab(tab)}
            tabs={[
              { id: "1", text: "Debt at Risk per Price Drop (Current)" },
              { id: "2", text: "Debt at Risk per Drop (History)" },
              { id: "3", text: "Protection Score History" },
              { id: "4", text: "Gas Monitor" },
              { id: "5", text: "% of Risky Debt" },
            ]}
          />
        </Col>
        <Col xl={9}>
          <SideTabContent
            activeTab={activeTab}
            tabs={[
              {
                id: "1",
                content: (
                  <>
                    <div className="d-flex mb-4 align-items-center">
                      <h4 className="m-0 flex-grow-1">
                        Debt at Risk per Price Drop (Current)
                      </h4>

                      <TimeSwitch
                        activeOption={riskTimePeriod}
                        onChange={setRiskTimePeriod}
                        options={timeSwitchOptions}
                      />
                    </div>
                    <p className="gray">
                      {description} "The amounts are also split by Vault Protection
                      Score which represents individual vault’s likelihood of
                      liquidation based on its current state and historical behavior ";
                    </p>

                    <DropTable timePeriod={riskTimePeriod} />
                  </>
                ),
              },
              {
                id: "2",
                content: (
                  <>
                    <div className="d-flex mb-4 align-items-center">
                      <h4 className="m-0 flex-grow-1">
                        Debt at Risk per Drop (History)
                      </h4>
                      <TimeSwitch
                        activeOption={riskTimePeriod}
                        onChange={setRiskTimePeriod}
                        options={timeSwitchOptions}
                      />
                    </div>
                    <p className="gray">
                      {description} Historical overview across different price drop
                      levels.
                    </p>

                    <PerDropHistoryChart timePeriod={riskTimePeriod} />
                  </>
                ),
              },
              {
                id: "3",
                content: (
                  <>
                    <div className="d-flex mb-4 align-items-center">
                      <h4 className="m-0 flex-grow-1">Protection Score History</h4>
                      <TimeSwitch
                        activeOption={riskTimePeriod}
                        onChange={setRiskTimePeriod}
                        options={timeSwitchOptions}
                      />
                    </div>
                    <p className="gray">
                      {
                        "Risky Debt (debt collateralized by volatile assets) split by Vault Protection Score (individual vault’s likelihood of liquidation based on its current state and historical behavior)."
                      }
                    </p>

                    <ProtectionHistoryChart timePeriod={riskTimePeriod} />
                  </>
                ),
              },
              {
                id: "4",
                content: (
                  <>
                    <div className="d-flex mb-4 align-items-center">
                      <h4 className="m-0 flex-grow-1">Gas Monitor</h4>
                      <TimeSwitch
                        activeOption={riskTimePeriod}
                        onChange={setRiskTimePeriod}
                        options={timeSwitchOptions}
                      />
                    </div>
                    <p className="gray">
                      {
                        "An overview of the cost structure for interacting with the Maker system given the current and historical Ethereum gas prices. This includes creation of a vault, its position management and also participation in auctions."
                      }
                    </p>
                    <GasMonitor timePeriod={riskTimePeriod} />
                  </>
                ),
              },
              {
                id: "5",
                content: (
                  <>
                    <div className="d-flex mb-4 align-items-center">
                      <h4 className="m-0 flex-grow-1">% Risky Debt</h4>
                      <TimeSwitch
                        activeOption={riskTimePeriod}
                        onChange={setRiskTimePeriod}
                        options={timeSwitchOptions}
                      />
                    </div>
                    <p className="gray">
                      {
                        "Capital at Risk, Maker’s portfolio risk measure is compared to its Risky Debt (debt collateralized by volatile assets)."
                      }
                    </p>
                    <RiskyDebtPercentageGraph timePeriod={riskTimePeriod} />
                  </>
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(Homepage);
