// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Col, Row } from "reactstrap";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../components/Loader/Loader.js";
import StatsBar from "../../components/Stats/StatsBar.js";
import Value from "../../components/Value/Value.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import InfoCard from "./components/InfoCard.js";

function CompD3M(props) {
  usePageTitle("Compound D3M");
  const protocol = "compound";
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/d3ms/${protocol}/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { stats } = data;
  const statsBarValues = [
    {
      title: "total exposure",
      bigValue: <Value value={stats.balance} decimals={2} prefix="$" compact />,
    },
    {
      title: "total debt ceiling",
      bigValue: <Value value={stats.debt_ceiling} decimals={2} prefix="$" compact />,
    },
    {
      title: "exposure / surplus buffer",
      bigValue: (
        <Value value={stats.utilization_surplus_buffer * 100} decimals={2} suffix="%" />
      ),
    },
    {
      title: "surplus buffer",
      bigValue: <Value value={stats.surplus_buffer} decimals={2} prefix="$" compact />,
    },
  ];

  return (
    <>
      <div className="d-flex align-items-center mb-4">
        <CryptoIcon name={stats.protocol} size="3rem" className="me-2" />
        <h1 className="h3 m-0">{stats.title}</h1>
      </div>
      <StatsBar className="mb-4" stats={statsBarValues} />
      <Row className="mb-4">
        <Col xl={3}>
          <InfoCard stats={stats} protocol={protocol} />
        </Col>
        {/* <Col xl={9}>
          <RatesChart />
        </Col> */}
      </Row>
    </>
  );
}

export default withErrorBoundary(CompD3M);
