// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Col, Row } from "reactstrap";
import Loader from "../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import PerVaultTypeCard from "./components/PerVaultTypeCard.js";
import AbsolutePerVaultTypeCard from "./components/AbsolutePerVaultTypeCard.js";
import OrganicPerVaultTypeCard from "./components/OrganicPerVaultTypeCard.js";
import SupplyPerTenureCategoryCard from "./components/SupplyPerTenureCategoryCard.js";
import NewSupplyPerVaultTypeCard from "./components/NewSupplyPerVaultTypeCard.js";
import SupplyPerCohortCard from "./components/SupplyPerCohortCard.js";
import ConcentrationRiskWhalesCard from "./components/ConcentrationRiskWhalesCard.js";
import ConcentrationRiskGiniCard from "./components/ConcentrationRiskGiniCard.js";
import CounterpartiesCard from "./components/CounterpartiesCard.js";
import OrganicSupplyDebtWeightedCard from "./components/OrganicSupplyDebtWeightedCard.js";
import PerVaultTypePeriodicalCard from "./components/PerVaultTypePeriodicalCard.js";

function DaiGrowth(props) {
  usePageTitle("DAI Supply Metrics");
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch("/dai-growth/");

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const {
    organic_supply_debt_weighted: organicSupplyDebtWeightedData,
    organic_demand_growth_per_vault_7d: organicDemandGrowthPervault7dData,
    organic_demand_growth_per_vault_30d: organicDemandGrowthPervault30dData,
    organic_demand_growth_per_vault_90d: organicDemandGrowthPervault90dData,
    per_vault_type: perVaultTypeData,
    organic_demand_growth_perc: organicDemandGrowthPercData,
    supply_per_tenure_category: supplyPerTenureCategoryData,
    new_supply_per_vault_type: newSupplyPerVaultTypeData,
    supply_per_cohort: supplyPerCohortData,
    concentration_risk_whales: concentrationRiskWhalesData,
    concentration_risk_gini: concentrationRiskGiniData,
    counterparties,
  } = data;
  return (
    <>
      <h1 className="mb-4">DAI supply metrics</h1>
      <h2 className="mb-4">Growth</h2>
      <Row>
        <Col xl={6} className="mb-4">
          <OrganicSupplyDebtWeightedCard data={organicSupplyDebtWeightedData} />
        </Col>
        <Col xl={6} className="mb-4">
          <PerVaultTypePeriodicalCard
            data_7d={organicDemandGrowthPervault7dData}
            data_30d={organicDemandGrowthPervault30dData}
            data_90d={organicDemandGrowthPervault90dData}
          />
        </Col>
        <Col xl={6} className="mb-4">
          <PerVaultTypeCard data={perVaultTypeData} />
        </Col>
        <Col xl={6} className="mb-4">
          <AbsolutePerVaultTypeCard data={perVaultTypeData} />
        </Col>
        <Col xl={6} className="mb-4">
          <OrganicPerVaultTypeCard data={organicDemandGrowthPercData} />
        </Col>
        <Col xl={6} className="mb-4">
          <SupplyPerTenureCategoryCard data={supplyPerTenureCategoryData} />
        </Col>
        <Col xl={6} className="mb-4">
          <NewSupplyPerVaultTypeCard data={newSupplyPerVaultTypeData} />
        </Col>
        <Col xl={6} className="mb-4">
          <SupplyPerCohortCard data={supplyPerCohortData} />
        </Col>
      </Row>
      <h2 className="mb-4">Risk</h2>
      <Row>
        <Col xl={6} className="mb-4">
          <ConcentrationRiskWhalesCard data={concentrationRiskWhalesData} />
        </Col>
        <Col xl={6} className="mb-4">
          <ConcentrationRiskGiniCard data={concentrationRiskGiniData} />
        </Col>
        <Col xl={6} className="mb-4">
          <CounterpartiesCard data={counterparties} />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(DaiGrowth);
