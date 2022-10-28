// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import ProgressBar from "../../../components/ProgressBar/ProgressBar.js";
import Card from "../../../components/Card/Card.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import styles from "./Profile.module.scss";

function Profile(props) {
  const { data } = props;
  if (!data) {
    return null;
  }

  let progressLabel = "success";
  if (data.utilization > 0.9) {
    progressLabel = "danger";
  } else if (data.utilization > 0.8) {
    progressLabel = "warning";
  }
  return (
    <Card>
      <div className={styles.list}>
        <div className="text-center">
          <ul className="text-center">
            <li className="mb-2">
              <div className="section-title">stability fee</div>
              <Value
                value={data.stability_fee * 100}
                decimals={2}
                suffix="%"
                className="text-big"
              />
            </li>
            <li className="mb-2">
              <div className="section-title">liquidation ratio</div>
              <Value
                value={data.lr * 100}
                decimals={2}
                suffix="%"
                className="text-big"
              />
            </li>
            <li className="mb-2">
              <div className="section-title">dust</div>
              <Value
                value={data.dust}
                decimals={2}
                prefix="$"
                compact
                className="text-big"
              />
            </li>
            <li className="mb-2">
              <div className="section-title">debt ceiling</div>
              <Value
                value={data.dc_iam_line}
                decimals={2}
                prefix="$"
                compact100k
                className="text-big"
              />
            </li>
            <li className="mb-2">
              <div className="section-title">liquidation hole</div>
              <Value
                value={data.hole}
                decimals={2}
                prefix="$"
                compact100k
                className="text-big"
              />
            </li>
            <li>
              <div className="section-title">utilization</div>
              <ProgressBar
                animated
                value={data.utilization * 100}
                color={progressLabel}
                className={styles.progress}
              >
                <Value value={data.utilization * 100} decimals={2} suffix="%" />
              </ProgressBar>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default withErrorBoundary(Profile);
