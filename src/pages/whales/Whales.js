// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import classnames from "classnames";
import Loader from "../../components/Loader/Loader.js";
import slugify from "slugify";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import ProgressBar from "../../components/ProgressBar/ProgressBar.js";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import Value from "../../components/Value/Value.js";
import StatsBar from "../../components/Stats/StatsBar.js";
import styles from "./Whales.module.scss";

function Whales(props) {
  usePageTitle("Whales");
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch("/whales/");

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  return (
    <Row>
      {data.results.map((row) => {
        const stats = [
          {
            title: "# of vaults",
            bigValue: (
              <Value value={row.number_of_vaults} className={styles.valueBig} />
            ),
          },
          {
            title: "total debt",
            bigValue: (
              <Value
                value={row.total_debt}
                decimals={2}
                prefix="$"
                compact
                className={styles.valueBig}
              />
            ),
          },
          {
            title: "",
            bigValue: (
              <div className="text-center">
                {row.collateral_symbols.map((symbol) => (
                  <CryptoIcon
                    key={symbol}
                    name={symbol}
                    size="2rem"
                    className={styles.collateralIcon}
                  />
                ))}
              </div>
            ),
          },
        ];
        return (
          <Col xl={4} className="mb-4" key={row.name}>
            <Link
              to={`/wallets/${row.slug}/`}
              key={row.protocol}
              className={styles.link}
            >
              <div className={styles.boxHeader}>
                <div className={classnames(styles.boxTitle, "mb-4")}>
                  <CryptoIcon name={slugify(row.name).toLowerCase()} size="3rem" />
                  <h3 className="m-0">{row.name}</h3>
                </div>
                <div className={styles.boxContent}>
                  <StatsBar stats={stats} cardTag="div" />
                  <div className="text-center mt-3">
                    <div className={styles.smallText}>share of risky debt</div>
                    <ProgressBar
                      animated
                      value={row.share * 100}
                      color="success"
                      className={styles.progress}
                    >
                      <Value value={row.share * 100} decimals={2} suffix="%" />
                    </ProgressBar>
                  </div>
                </div>
              </div>
            </Link>
          </Col>
        );
      })}
    </Row>
  );
}

export default withErrorBoundary(Whales);
