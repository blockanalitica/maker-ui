// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import queryString from "query-string";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import Loader from "../../../components/Loader/Loader.js";
import SideTabContent from "../../../components/SideTab/SideTabContent.js";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { useQueryParams } from "../../../hooks.js";
import CapitalAtRiskChart from "./charts/CapitalAtRiskChart.js";
import CapitalAtRiskChartScore from "./charts/CapitalAtRiskChartScore.js";
import CR from "./charts/CR.js";
import RiskModelChart from "./charts/RiskModelChart.js";
import LiquidityScoreChart from "./charts/LiquidityScoreChart.js";
import ShareProtected from "./charts/ShareProtected.js";
import DropTable from "./DropTable.js";
import ProtectionHistoryChart from "./ProtectionHistoryChart.js";

function DataTabs(props) {
  const navigate = useNavigate();
  const queryParams = useQueryParams();
  const { ilk, symbol } = props;
  const [timePeriod, setTimePeriod] = useState(30);

  const timeOptions = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
    { key: 365, value: "1 year" },
  ];

  const qParams = {
    tab: queryParams.get("tab") || "1",
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

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/ilks/${ilk}/capital-at-risk/chart/`,
    { days_ago: timePeriod }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  return (
    <Row>
      <Col xl={3}>
        <SideTabNav
          activeTab={activeTab}
          toggleTab={toggleTab}
          tabs={[
            { id: "1", text: "capital at risk" },
            { id: "2", text: "risky debt" },
            { id: "3", text: "share protected" },
            { id: "4", text: "risk model" },
            { id: "5", text: "liquidity score" },
            { id: "6", text: "collateralization" },
            { id: "7", text: "drop table" },
            { id: "8", text: "protection score" },
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
                    <h4 className="m-0 flex-grow-1">capital at risk</h4>
                    <TimeSwitch
                      activeOption={timePeriod}
                      onChange={setTimePeriod}
                      options={timeOptions}
                    />
                  </div>

                  <CapitalAtRiskChart data={data} />
                </>
              ),
            },
            {
              id: "2",
              content: (
                <>
                  <div className="d-flex mb-4 align-items-center mb-4">
                    <h4 className="m-0 flex-grow-1">risky debt</h4>
                    <TimeSwitch
                      activeOption={timePeriod}
                      onChange={setTimePeriod}
                      options={timeOptions}
                    />
                  </div>
                  <CapitalAtRiskChartScore ilk={ilk} daysAgo={timePeriod} />
                </>
              ),
            },
            {
              id: "3",
              content: (
                <>
                  <div className="d-flex mb-4 align-items-center">
                    <h4 className="m-0 flex-grow-1">vaults protected share</h4>
                    <TimeSwitch
                      activeOption={timePeriod}
                      onChange={setTimePeriod}
                      options={timeOptions}
                    />
                  </div>
                  <ShareProtected data={data} />
                </>
              ),
            },
            {
              id: "4",
              content: (
                <>
                  <h4 className="mb-4">risk model</h4>
                  <RiskModelChart ilk={ilk} />
                </>
              ),
            },

            {
              id: "5",
              content: (
                <>
                  <h4 className="mb-4">liquidity score</h4>
                  <p className="mb-4">
                    Liquidity Score (percentage of debt captured after auctioning
                    current DE) over time
                  </p>
                  <LiquidityScoreChart symbol={symbol} />
                </>
              ),
            },

            {
              id: "6",
              content: (
                <>
                  <div className="d-flex mb-4 align-items-center">
                    <h4 className="m-0 flex-grow-1">collateralization ratio</h4>
                    <TimeSwitch
                      activeOption={timePeriod}
                      onChange={setTimePeriod}
                      options={timeOptions}
                    />
                  </div>
                  <CR data={data} />
                </>
              ),
            },
            {
              id: "7",
              content: (
                <>
                  <div className="d-flex mb-4 justify-content-space-between align-items-center">
                    <div className="mb-2 flex-grow-1">
                      <h4>drop table</h4>
                    </div>
                    <TimeSwitch
                      className="mb-3 justify-content-end"
                      activeOption={timePeriod}
                      onChange={setTimePeriod}
                      options={timeOptions}
                    />
                  </div>
                  <DropTable
                    ilk={ilk}
                    setTimePeriod={setTimePeriod}
                    timePeriod={timePeriod}
                  />
                </>
              ),
            },
            {
              id: "8",
              content: (
                <>
                  <div className="d-flex mb-4 justify-content-space-between align-items-center">
                    <div className="mb-2 flex-grow-1">
                      <h4>protection scores</h4>
                    </div>
                    <TimeSwitch
                      className="mb-3 justify-content-end"
                      activeOption={timePeriod}
                      onChange={setTimePeriod}
                      options={timeOptions}
                    />
                  </div>
                  <ProtectionHistoryChart
                    ilk={ilk}
                    setTimePeriod={setTimePeriod}
                    timePeriod={timePeriod}
                  />
                </>
              ),
            },
          ]}
        />
      </Col>
    </Row>
  );
}

export default withErrorBoundary(DataTabs);
