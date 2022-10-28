// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../../components/ProgressBar/ProgressBar.js";
import SideTabNav from "../../components/SideTab/SideTabNav.js";
import SideTabContent from "../../components/SideTab/SideTabContent.js";
import Loader from "../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import LoadingOverlay from "react-loading-overlay";
import StatsBar from "../../components/Stats/StatsBar.js";
import Card from "../../components/Card/Card.js";
import Value from "../../components/Value/Value.js";
import ValueChange from "../../components/Value/ValueChange.js";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import CombinedDAISupplyHistoryChart from "./components/CombinedDAISupplyHistoryChart.js";
import CombinedEventStatsChart from "./components/CombinedEventStatsChart.js";

function PSMs(props) {
  usePageTitle("PSMs");
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState(1);
  const [historyTimePeriod, setHistoryTimePeriod] = useState(30);
  const [activeTab, setActiveTab] = useState("1");

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "/psms/",
    { days_ago: timePeriod },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const { results, stats } = data;

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const historyTimeOptions = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
  ];

  let totalStats;
  if (stats) {
    totalStats = [
      {
        title: "debt",
        bigValue: <Value value={stats.debt} prefix="$" compact />,
        smallValue: (
          <ValueChange
            value={stats.change.debt}
            decimals={2}
            prefix="$"
            compact
            hideIfZero
          />
        ),
      },
      {
        title: "debt ceiling",
        bigValue: <Value value={stats.dc} decimals={2} prefix="$" compact />,
        smallValue: (
          <ValueChange
            value={stats.change.dc}
            decimals={2}
            prefix="$"
            compact
            hideIfZero
          />
        ),
      },
      {
        title: "share of total debt",
        bigValue: <Value value={stats.share * 100} decimals={2} suffix="%" />,
        smallValue: (
          <ValueChange
            value={stats.change.share * 100}
            decimals={2}
            suffix="%"
            compact
            hideIfZero
          />
        ),
      },
    ];
  }

  return (
    <>
      <TimeSwitch className="mb-3" activeOption={timePeriod} onChange={setTimePeriod} />
      <LoadingOverlay active={isPreviousData} spinner>
        {totalStats ? <StatsBar stats={totalStats} className="mb-4" /> : null}
        <Row>
          {results.map((psm) => {
            const psmStats = [
              {
                title: "debt",
                bigValue: <Value value={psm.dai_debt} prefix="$" compact />,
                smallValue: (
                  <ValueChange
                    value={psm.debt_diff}
                    decimals={2}
                    prefix="$"
                    compact
                    hideIfZero
                  />
                ),
              },
              {
                title: "debt ceiling",
                bigValue: (
                  <Value value={psm.dc_iam_line} decimals={2} prefix="$" compact />
                ),
                smallValue: (
                  <ValueChange
                    value={psm.dc_diff}
                    decimals={2}
                    prefix="$"
                    compact
                    hideIfZero
                  />
                ),
              },
              {
                title: "utilization",
                bigValue: (
                  <Value value={psm.utilization * 100} decimals={2} suffix="%" />
                ),
              },
            ];

            const bla = [
              {
                title: "fee in",
                smallValue: psm.fee_in ? (
                  <Value value={psm.fee_in} decimals={2} suffix="%" />
                ) : (
                  "-"
                ),
              },
              {
                title: "fee out",
                smallValue: psm.fee_out ? (
                  <Value value={psm.fee_out} decimals={2} suffix="%" />
                ) : (
                  "-"
                ),
              },
            ];

            return (
              <Col xl={4} key={psm.name} className="mb-4">
                <Card role="button" onClick={() => navigate(`/psms/${psm.ilk}/`)}>
                  <div className="d-flex align-items-center mb-4">
                    <CryptoIcon name={psm.collateral} size="3rem" className="me-2" />
                    <h3 className="m-0">{psm.name}</h3>
                  </div>
                  <StatsBar stats={psmStats} cardTag="div" className="mb-3" />

                  <div className="text-center mb-3">
                    <div className="section-title">share of total debt</div>
                    <ProgressBar animated value={psm.share * 100} color="success">
                      <Value value={psm.share * 100} decimals={2} suffix="%" />
                    </ProgressBar>
                  </div>
                  <div className="text-center mb-3">
                    <div className="section-title me-2">share of market cap</div>
                    <ProgressBar
                      animated
                      value={psm.share_captured * 100}
                      color="success"
                    >
                      <Value value={psm.share_captured * 100} decimals={2} suffix="%" />
                    </ProgressBar>
                  </div>
                  <StatsBar stats={bla} cardTag="div" />
                </Card>
              </Col>
            );
          })}
        </Row>
      </LoadingOverlay>

      <Row className="mb-4">
        <Col xl={3}>
          <SideTabNav
            activeTab={activeTab}
            toggleTab={toggleTab}
            tabs={[
              { id: "1", text: "total supply" },
              { id: "2", text: "change per day" },
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
                    <TimeSwitch
                      options={historyTimeOptions}
                      activeOption={historyTimePeriod}
                      onChange={setHistoryTimePeriod}
                    />
                    <CombinedDAISupplyHistoryChart timePeriod={historyTimePeriod} />
                  </>
                ),
              },
              {
                id: "2",
                content: (
                  <>
                    <TimeSwitch
                      options={historyTimeOptions}
                      activeOption={historyTimePeriod}
                      onChange={setHistoryTimePeriod}
                    />
                    <CombinedEventStatsChart timePeriod={historyTimePeriod} />
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

export default withErrorBoundary(PSMs);
