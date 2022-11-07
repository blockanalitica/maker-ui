// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import { faChartArea, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import { withErrorBoundary } from "../../../hoc.js";
import CapitalAtRiskTotalChart from "./CapitalAtRiskTotalChart.js";
import CapitalAtRiskTotalIlksChart from "./CapitalAtRiskTotalIlksChart.js";

function LiquidationCard(props) {
  const [timePeriod, setTimePeriod] = useState(30);
  const [currentTab, setCurrentTab] = useState("line");

  const timeOptions = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
    { key: 365, value: "1 year" },
  ];

  return (
    <>
      <div className="d-flex mb-4 align-items-center">
        <h4 className="mb-0 flex-grow-1">Capital at risk</h4>
        <TimeSwitch
          activeOption={timePeriod}
          onChange={setTimePeriod}
          options={timeOptions}
        />
      </div>

      <IconTabs
        activeTab={currentTab}
        onTabChange={setCurrentTab}
        tabs={[
          {
            id: "line",
            title: <FontAwesomeIcon icon={faChartLine} />,
            content: <CapitalAtRiskTotalChart timePeriod={timePeriod} />,
          },
          {
            id: "bar",
            title: <FontAwesomeIcon icon={faChartArea} />,
            content: <CapitalAtRiskTotalIlksChart timePeriod={timePeriod} />,
          },
        ]}
      />
    </>
  );
}

export default withErrorBoundary(LiquidationCard);
