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
        <h4 className="m-0 flex-grow-1">Debt at Risk per Price Drop (Current)</h4>

        <TimeSwitch activeOption={drop} onChange={setDrop} options={dropOptions} />
      </div>
      <p className="gray">
        Debt Amount at risk of liquidation, assuming a drop in collateral price without
        any vault owner action to increase their position’s collateralization ratio. The
        amounts are also split by{" "}
        <a
          href="https://forum.makerdao.com/t/vault-protection-score-model-validation/15633"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vault Protection Score
        </a>{" "}
        which represents individual vault’s likelihood of liquidation based on its
        current state and historical behavior
      </p>
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
