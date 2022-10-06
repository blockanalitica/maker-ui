// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import queryString from "query-string";
import { React, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import Loader from "../../components/Loader/Loader.js";
import SideTabNav from "../../components/SideTab/SideTabNav.js";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle, useQueryParams } from "../../hooks";
import CapitalAtRiskHistoricChart from "./components/charts/CapitalAtRiskHistoricChart.js";
import DebtCeilingHistoricChart from "./components/charts/DebtCeilingHistoricChart.js";
import RiskPremiumHistoricChart from "./components/charts/RiskPremiumHistoricChart.js";
import VaultHistoricStatsGraph from "./components/VaultHistoricStatsGraph.js";

function IlkHistoricStats(props) {
  const { ilk } = useParams();
  const queryParams = useQueryParams();
  const navigate = useNavigate();

  usePageTitle(ilk);

  const [daysAgo, setDaysAgo] = useState(30);
  const timeOptions = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 180, value: "180 days" },
    { key: 365, value: "1 year" },
  ];

  const statType = queryParams.get("type") || "capital_at_risk";

  const [activeTab, setActiveTab] = useState(statType);
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      let qs = queryString.stringify({
        type: tab,
      });
      setActiveTab(tab);
      navigate(`?${qs}`);
    }
  };

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `/ilks/${ilk}/stats/history/`,
    { days_ago: daysAgo, type: statType },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  let graphContent = null;
  if (statType === "capital_at_risk") {
    graphContent = <CapitalAtRiskHistoricChart data={data} />;
  } else if (statType === "risk_premium") {
    graphContent = <RiskPremiumHistoricChart data={data} />;
  } else if (statType === "debt_ceiling") {
    graphContent = <DebtCeilingHistoricChart data={data} />;
  } else {
    graphContent = <VaultHistoricStatsGraph data={data} statType={statType} />;
  }
  return (
    <>
      <div className="d-flex mb-4">
        <div className="mb-4 flex-grow-1"></div>
        <TimeSwitch
          className="mb-3 justify-content-end"
          activeOption={daysAgo}
          onChange={setDaysAgo}
          options={timeOptions}
        />
      </div>
      <Row className="mb-4">
        <Col xl={3} className="mb-4">
          <SideTabNav
            activeTab={activeTab}
            toggleTab={toggleTab}
            tabs={[
              { id: "capital_at_risk", text: "Capital at risk" },
              { id: "risk_premium", text: "Risk premium" },
              { id: "debt_ceiling", text: "Debt ceiling" },
              { id: "total_debt", text: "Total debt" },
              { id: "vaults_count", text: "Number of vaults" },
              { id: "weighted_collateralization_ratio", text: "Debt weighted CR" },
              { id: "cr_lr", text: "CR/LR multiplier" },
              { id: "total_locked", text: "Total locked" },
            ]}
          />
        </Col>
        <Col xl={9}>
          <LoadingOverlay active={isPreviousData} spinner>
            {graphContent}
          </LoadingOverlay>
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(IlkHistoricStats);
