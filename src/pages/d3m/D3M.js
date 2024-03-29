// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Col, Row } from "reactstrap";
import Card from "../../components/Card/Card.js";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../components/Loader/Loader.js";
import ProgressBar from "../../components/ProgressBar/ProgressBar.js";
import StatsBar from "../../components/Stats/StatsBar.js";
import Value from "../../components/Value/Value.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";

function D3M(props) {
  usePageTitle("D3M");
  const navigate = useNavigate();
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch("/d3ms/");

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const { stats, results } = data;

  const onClickProtocol = (protocol_slug) => {
    if (protocol_slug === "spark") {
      window.open("https://spark.blockanalitica.com", "_blank", "noopener noreferrer");
    } else {
      navigate(`/d3m/${protocol_slug}/`);
    }
  };

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
      <StatsBar className="mb-5" stats={statsBarValues} />
      <Row className="mb-5">
        {results.map((row) => {
          const statsD3M = [
            {
              title: "current exposure",
              bigValue: (
                <Value
                  value={row.balance}
                  decimals={2}
                  suffix={" " + row.symbol}
                  compact
                />
              ),
            },
            {
              title: "debt ceiling",
              bigValue: (
                <Value value={row.max_debt_ceiling} decimals={2} prefix="$" compact />
              ),
            },
            {
              title: "profit",
              bigValue: <Value value={row.profit} decimals={2} prefix="$" dashIfZero />,
            },
          ];

          return (
            <Col xl={6} key={row.protocol} className="mb-4">
              <Card role="button" onClick={() => onClickProtocol(row.protocol_slug)}>
                <div>
                  <div className="d-flex align-items-center mb-4">
                    <CryptoIcon name={row.protocol} size="3rem" className="me-2" />
                    <h3 className="m-0 me-3">{row.title}</h3>
                    {row.pending ? <Badge>Onboarding</Badge> : null}
                  </div>
                  <div>
                    <StatsBar className="mb-3" stats={statsD3M} cardTag="div" />
                    <div className="text-center">
                      <div className="section-title">utilization</div>
                      <ProgressBar
                        animated
                        value={row.utilization * 100}
                        color="success"
                      >
                        <Value value={row.utilization * 100} decimals={2} suffix="%" />
                      </ProgressBar>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
}

export default withErrorBoundary(D3M);
