// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Card from "../../../components/Card/Card.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import styles from "./LiquidationsInfo.module.scss";

function LiquidationsInfo(props) {
  const { data } = props;
  const {
    count,
    total_collateral_seized_usd,
    total_debt_repaid_usd,
    penalty_fee,
    penalized_collateral,
    penalized_debt,
  } = data;
  return (
    <Card>
      <div className={styles.sectionWrapper}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>liquidations</div>
          <Value value={count} decimals={0} className={styles.valueBig} />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>collateral auctioned</div>
          <Value
            value={total_collateral_seized_usd}
            decimals={2}
            className={styles.valueBig}
            prefix="$"
            compact
          />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>debt repaid</div>
          <Value
            value={total_debt_repaid_usd}
            decimals={2}
            className={styles.valueBig}
            prefix="$"
            compact
          />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>penalty collected</div>
          <Value
            value={penalty_fee}
            decimals={2}
            className={styles.valueBig}
            prefix="$"
            compact
          />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>penalty fee</div>
          <Value
            value={(penalized_collateral / penalized_debt - 1) * 100}
            decimals={2}
            className={styles.valueBig}
            suffix="%"
          />
        </div>
      </div>
    </Card>
  );
}

export default withErrorBoundary(LiquidationsInfo);
