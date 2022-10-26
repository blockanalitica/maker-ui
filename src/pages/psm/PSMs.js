// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { Row, Col, Progress } from "reactstrap";
import { useNavigate } from "react-router-dom";
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

function PSMs(props) {
  usePageTitle("PSMs");
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState(1);

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
        <Row className="mb-5">
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

            return (
              <Col xl={4} key={psm.name} className="mb-4">
                <Card role="button" onClick={() => navigate(`/psms/${psm.ilk}`)}>
                  <div className="d-flex align-items-center mb-4">
                    <CryptoIcon name={psm.collateral} size="3rem" className="me-2" />
                    <h3 className="m-0">{psm.name}</h3>
                  </div>
                  <StatsBar stats={psmStats} cardTag="div" className="mb-3" />
                  <div className="text-center mb-3">
                    <div className="section-title">share of total debt</div>
                    <Progress
                      animated
                      value={psm.share * 100}
                      color="success"
                    ></Progress>
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
      </LoadingOverlay>
    </>
  );
}

export default withErrorBoundary(PSMs);
