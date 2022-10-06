// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import { faChartBar, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import IconTabs from "../../../components/Tabs/IconTabs.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import { withErrorBoundary } from "../../../hoc.js";
import LiquidationCurveBarChart from "./LiquidationCurveBarChart.js";
import LiquidationCurveChart from "./LiquidationCurveChart.js";

function LiquidationCard(props) {
  const [drop, setDrop] = useState(80);
  const [currentTab, setCurrentTab] = useState("line");

  const dropOptions = [
    { key: 5, value: "5%" },
    { key: 10, value: "10%" },
    { key: 25, value: "25%" },
    { key: 50, value: "50%" },
    { key: 80, value: "80%" },
  ];

  return (
    <>
      <div className="d-flex mb-4 align-items-center">
        <h4 className="m-0 flex-grow-1">debt at risk</h4>
        <TimeSwitch activeOption={drop} onChange={setDrop} options={dropOptions} />
      </div>
      <IconTabs
        activeTab={currentTab}
        onTabChange={setCurrentTab}
        tabs={[
          {
            id: "line",
            title: <FontAwesomeIcon icon={faChartLine} />,
            content: <LiquidationCurveChart drop={drop} />,
          },
          {
            id: "bar",
            title: <FontAwesomeIcon icon={faChartBar} />,
            content: <LiquidationCurveBarChart drop={drop} />,
          },
        ]}
      />
    </>
  );
}

export default withErrorBoundary(LiquidationCard);
