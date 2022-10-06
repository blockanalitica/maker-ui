// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Row, Col, Progress } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import StatsBar from "../../components/Stats/StatsBar.js";
import Card from "../../components/Card/Card.js";
import Value from "../../components/Value/Value.js";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";

function PSMs(props) {
  usePageTitle("PSMs");
  const navigate = useNavigate();

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch("/psms/");

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const { results } = data;

  return (
    <Row className="mb-5">
      {results.map((psm) => {
        const stats = [
          {
            title: "debt",
            bigValue: <Value value={psm.dai_debt} prefix="$" compact />,
          },
          {
            title: "debt ceiling",
            bigValue: <Value value={psm.dc_iam_line} decimals={2} prefix="$" compact />,
          },
          {
            title: "utilization",
            bigValue: <Value value={psm.utilization * 100} decimals={2} suffix="%" />,
          },
        ];

        return (
          <Col xl={4} key={psm.name} className="mb-4">
            <Card role="button" onClick={() => navigate(`/psms/${psm.ilk}`)}>
              <div className="d-flex align-items-center mb-4">
                <CryptoIcon name={psm.collateral} size="3rem" className="me-2" />
                <h3 className="m-0">{psm.name}</h3>
              </div>
              <StatsBar stats={stats} cardTag="div" className="mb-3" />
              <div className="text-center mb-3">
                <div className="section-title">share of total debt</div>
                <Progress animated value={psm.share * 100} color="success"></Progress>
                <Value value={psm.share * 100} decimals={2} suffix="%" />
              </div>
              <div className="text-center">
                <div className="section-title">share of market cap</div>
                <Progress
                  animated
                  value={psm.share_captured * 100}
                  color="success"
                ></Progress>
                <Value value={psm.share_captured * 100} decimals={2} suffix="%" />
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

export default withErrorBoundary(PSMs);
