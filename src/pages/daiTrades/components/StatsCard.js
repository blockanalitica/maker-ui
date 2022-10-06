// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import Loader from "../../../components/Loader/Loader.js";
import Value from "../../../components/Value/Value.js";
import Card from "../../../components/Card/Card.js";
import styles from "./StatsCard.module.scss";
import BootstrapTable from "react-bootstrap-table-next";

function StatsCard(props) {
  const [showPerExchange, setShowPerExchange] = useState(false);

  const { data, isLoading, isError, ErrorFallbackComponent } =
    useFetch("/dai-trades/stats/");

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { last_24h: lastDay, last_7days: lastWeek } = data;
  const { exchange_stats: exchangeStats } = lastWeek;

  return (
    <>
      <Card fullHeight={false} className="mb-4" title="past 24h" titleNoBorder>
        <div className={styles.sectionWrapper}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>avg price</div>
            <Value
              value={lastDay.avg}
              decimals={6}
              prefix="$"
              compact
              className={styles.valueBig}
            />
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>max price</div>
            <Value
              value={lastDay.max}
              decimals={6}
              prefix="$"
              compact
              className={styles.valueBig}
            />
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>min price</div>
            <Value
              value={lastDay.min}
              decimals={6}
              prefix="$"
              compact
              className={styles.valueBig}
            />
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>total amount</div>
            <Value
              value={lastDay.amount_total}
              decimals={2}
              prefix="$"
              compact
              className={styles.valueBig}
            />
          </div>
        </div>
      </Card>
      <Card fullHeight={false} className="mb-4" title="past 7d" titleNoBorder>
        <div className={styles.sectionWrapper}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>avg price</div>
            <Value
              value={lastWeek.avg}
              decimals={6}
              prefix="$"
              compact
              className={styles.valueBig}
            />
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>max price</div>
            <Value
              value={lastWeek.max}
              decimals={6}
              prefix="$"
              compact
              className={styles.valueBig}
            />
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>min price</div>
            <Value
              value={lastWeek.min}
              decimals={6}
              prefix="$"
              compact
              className={styles.valueBig}
            />
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>total amount</div>
            <Value
              value={lastWeek.amount_total}
              decimals={2}
              prefix="$"
              compact
              className={styles.valueBig}
            />
          </div>
        </div>
      </Card>

      <span
        role="button"
        className="link-primary"
        onClick={() => setShowPerExchange(!showPerExchange)}
      >
        {showPerExchange ? "hide" : "show"} past 7d per exchange table
      </span>
      {showPerExchange ? (
        <div className="mt-4">
          <h2 className="mb-4">past 7d per exchange</h2>
          <BootstrapTable
            bootstrap4
            bordered={false}
            data={exchangeStats}
            keyField="exchange"
            columns={[
              {
                dataField: "exchange",
                text: "Exchange",
              },

              {
                dataField: "avg",
                text: "avg",
                sort: true,
                formatter: (cell) => (
                  <Value value={cell} decimals={6} prefix="$" compact />
                ),
              },
              {
                dataField: "max",
                text: "max",
                sort: true,
                formatter: (cell) => (
                  <Value value={cell} decimals={6} prefix="$" compact />
                ),
              },
              {
                dataField: "min",
                text: "min",
                sort: true,
                formatter: (cell) => (
                  <Value value={cell} decimals={6} prefix="$" compact />
                ),
              },
              {
                dataField: "amount_total",
                text: "amount total",
                sort: true,
                formatter: (cell) => (
                  <Value value={cell} decimals={2} prefix="$" compact />
                ),
              },
            ]}
          />
        </div>
      ) : null}
    </>
  );
}

export default withErrorBoundary(StatsCard);
