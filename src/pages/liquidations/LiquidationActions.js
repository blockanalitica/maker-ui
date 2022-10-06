// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import Card from "../../components/Card/Card.js";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import EtherscanShort from "../../components/EtherscanShort/EtherscanShort.js";
import Loader from "../../components/Loader/Loader.js";
import LinkTable from "../../components/Table/LinkTable.js";
import Value from "../../components/Value/Value.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch } from "../../hooks";
import styles from "./LiquidationActions.module.scss";

function LiquidationActions(props) {
  const { ilk, uid } = useParams();
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/liquidations/${ilk}/${uid}/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { kicks, takes, auction } = data;

  const kicksTable = (
    <LinkTable
      keyField="uid"
      data={kicks}
      defaultSorted={[
        {
          dataField: "datetime",
          order: "asc",
        },
      ]}
      columns={[
        {
          dataField: "datetime",
          text: "datetime",
          sort: false,
        },
        // {
        //   dataField: "type",
        //   text: "type",
        // },
        {
          dataField: "debt",
          text: "debt",
          formatter: (cell, row) => (
            <Value value={cell} decimals={2} compact prefix="$" />
          ),
        },
        {
          dataField: "available_collateral",
          text: "available collateral",
          formatter: (cell, row) => <Value value={cell} decimals={2} />,
        },
        {
          dataField: "osm_price",
          text: "osm price",
          formatter: (cell, row) => <Value value={cell} decimals={2} prefix="$" />,
        },
        {
          dataField: "mkt_price",
          text: "market price",
          formatter: (cell, row) => <Value value={cell} decimals={2} prefix="$" />,
        },
        {
          dataField: "keeper",
          text: "keeper",
          formatter: (cell) => <EtherscanShort address={cell} />,
        },
        {
          dataField: "incentives",
          text: "incentives",
          formatter: (cell, row) => <Value value={cell} decimals={2} prefix="$" />,
        },
        {
          dataField: "caller",
          text: "caller",
          formatter: (cell) => <EtherscanShort address={cell} />,
        },
        {
          dataField: "status",
          text: "status",
        },
      ]}
    />
  );

  const takesTable = (
    <LinkTable
      keyField="uid"
      data={takes}
      defaultSorted={[
        {
          dataField: "datetime",
          order: "asc",
        },
      ]}
      columns={[
        {
          dataField: "datetime",
          text: "datetime",
          sort: false,
        },
        // {
        //   dataField: "type",
        //   text: "type",
        // },

        {
          dataField: "sold_collateral",
          text: "sold collaterall",
          formatter: (cell, row) => <Value value={cell} decimals={2} />,
        },
        {
          dataField: "recovered_debt",
          text: "recovered debt",
          formatter: (cell, row) => (
            <Value value={cell} decimals={2} compact prefix="$" />
          ),
        },
        {
          dataField: "collateral_price",
          text: "collateral price",
          formatter: (cell, row) => <Value value={cell} decimals={2} prefix="$" />,
        },
        {
          dataField: "osm_price",
          text: "osm price",
          formatter: (cell, row) => <Value value={cell} decimals={2} prefix="$" />,
        },
        {
          dataField: "mkt_price",
          text: "market price",
          formatter: (cell, row) => <Value value={cell} decimals={2} prefix="$" />,
        },
        {
          dataField: "osm_settled",
          text: "settled osm price",
          formatter: (cell, row) => (
            <Value value={cell * 100} decimals={2} suffix="%" />
          ),
        },
        {
          dataField: "mkt_settled",
          text: "settled market price",
          formatter: (cell, row) => (
            <Value value={cell * 100} decimals={2} suffix="%" />
          ),
        },
        {
          dataField: "caller",
          text: "caller",
          formatter: (cell) => <EtherscanShort address={cell} />,
        },
        {
          dataField: "debt",
          text: "debt",
          formatter: (cell, row) => (
            <Value value={cell} decimals={2} compact prefix="$" />
          ),
        },
        {
          dataField: "available_collateral",
          text: "available collateral",
          formatter: (cell, row) => <Value value={cell} decimals={2} />,
        },
        {
          dataField: "status",
          text: "status",
        },
      ]}
    />
  );

  return (
    <>
      <Row>
        <div className="d-flex mb-4 justify-content-space-between align-items-center">
          <div className="mb-2 flex-grow-1">
            <div className={styles.title}>
              <CryptoIcon name={auction.symbol} size="3rem" className="mb-2" />
              <h3>Liquidation #{uid}</h3>
            </div>
          </div>
        </div>
      </Row>
      <Row>
        <Col xl={12} className="mb-4">
          <Card>
            <div className={styles.sectionWrapper}>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>recovered debt</div>
                <Value
                  value={auction.recovered_debt}
                  decimals={2}
                  prefix="$"
                  compact
                  className={styles.valueBig}
                />
              </div>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>sold collateral</div>
                <Value
                  value={auction.sold_collateral}
                  decimals={2}
                  compact
                  className={styles.valueBig}
                />
              </div>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>penalty</div>
                <Value
                  value={auction.penalty_fee}
                  decimals={2}
                  prefix="$"
                  compact
                  className={styles.valueBig}
                />{" "}
                <Value
                  value={auction.penalty_fee_per * 100}
                  decimals={2}
                  suffix="%"
                  className={styles.smallText}
                />
              </div>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>duration</div>
                <Value
                  value={auction.duration}
                  decimals={2}
                  suffix="min"
                  className={styles.valueBig}
                />
              </div>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>collateral returned</div>
                <Value
                  value={auction.coll_returned * 100}
                  decimals={2}
                  suffix="%"
                  className={styles.valueBig}
                />
              </div>

              {/* <div className={styles.iconBox}>
              <FontAwesomeIcon className={styles.icon} icon={faAngleRight} />
            </div> */}
            </div>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <h4>kick</h4>
        <Col className="text-center">{kicksTable}</Col>
      </Row>
      <Row className="mb-4">
        <h4>takes</h4>
        <Col className="text-center">{takesTable}</Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(LiquidationActions);
