// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import Card from "../../../components/Card/Card.js";
import ProgressBar from "../../../components/ProgressBar/ProgressBar.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import styles from "./InfoCard.module.scss";

function InfoCard(props) {
  const { stats, protocol } = props;

  let progressLabel = "success";
  if (stats.supply_utilization > 0.3) {
    progressLabel = "danger";
  } else if (stats.supply_utilization > 0.2) {
    progressLabel = "warning";
  }

  const extraData = (
    <>
      <li className="mb-2">
        <div className="section-title">total real supply</div>
        <Value value={stats.real_supply} prefix="$" compact className="text-big" />
      </li>
      <li>
        <div className="section-title mb-1">exposure / real supply</div>
        <ProgressBar
          animated
          value={stats.supply_utilization * 100}
          color={progressLabel}
        >
          <Value value={stats.supply_utilization * 100} decimals={2} suffix="%" />
        </ProgressBar>
      </li>
    </>
  );

  return (
    <Card className="mb-4" fullHeight={false}>
      <div className={styles.list}>
        <div className="text-center">
          <ul>
            <li className="mb-2">
              <div className="section-title">target borrow rate</div>
              <Value
                value={stats.target_borrow_rate * 100}
                decimals={2}
                suffix="%"
                className="text-big"
              />
            </li>
            <li className="mb-2">
              <div className="section-title">current borrow rate</div>
              <Value
                value={stats.borrow_rate * 100}
                decimals={2}
                suffix="%"
                className="text-big"
              />
            </li>
            {protocol === "aave" && extraData}
          </ul>
          <Link to={`/d3m/${protocol}/revenue/`} key={protocol}>
            <Button color="primary">revenue calculator</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default withErrorBoundary(InfoCard);
