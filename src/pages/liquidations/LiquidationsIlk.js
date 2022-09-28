import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../components/Loader/Loader.js";
import LinkTable from "../../components/Table/LinkTable.js";
import Value from "../../components/Value/Value.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch } from "../../hooks";
import styles from "./LiquidationActions.module.scss";

function LiquidationsIlk(props) {
  const { ilk } = useParams();
  let navigate = useNavigate();
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/liquidations/${ilk}/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { results } = data;

  const onRowClick = (row) => {
    navigate(`${row.uid}/`);
  };

  return (
    <>
      <Row>
        <div className="d-flex mb-4 justify-content-space-between align-items-center">
          <div className="mb-2 flex-grow-1">
            <div className={styles.title}>
              <CryptoIcon name={ilk} size="3rem" className="mb-2" />
              <h3>{ilk}</h3>
            </div>
          </div>
        </div>
      </Row>
      <Row className="mb-4">
        <h4>liquidations</h4>
        <Col className="text-center">
          <LinkTable
            keyField="uid"
            data={results}
            onRowClick={onRowClick}
            defaultSorted={[
              {
                dataField: "uid",
                order: "desc",
              },
            ]}
            columns={[
              {
                dataField: "uid",
                text: "#",
              },
              {
                dataField: "vault",
                text: "vault",
              },
              {
                dataField: "debt_liquidated",
                text: "liquidated debt",
                sort: true,
                formatter: (cell, row) => (
                  <Value value={cell} decimals={2} compact prefix="$" />
                ),
              },
              {
                dataField: "penalty_fee",
                text: "penalty fee",
                sort: true,
                formatter: (cell, row) => (
                  <Value value={cell} decimals={2} compact prefix="$" />
                ),
              },
              {
                dataField: "recovered_debt",
                text: "recovered debt",
                sort: true,
                formatter: (cell, row) => (
                  <Value value={cell} decimals={2} compact prefix="$" />
                ),
              },
              {
                dataField: "penalty_fee_per",
                text: "penalty fee %",
                sort: true,
                formatter: (cell, row) => (
                  <Value value={cell * 100} decimals={2} suffix="%" />
                ),
              },
              {
                dataField: "sold_collateral",
                text: "sold collateral",
                sort: true,
                formatter: (cell, row) => (
                  <Value value={cell * 100} decimals={2} compact />
                ),
              },
              {
                dataField: "coll_returned",
                text: "collateral returned",
                sort: true,
                formatter: (cell, row) => (
                  <Value value={cell * 100} decimals={2} suffix="%" />
                ),
              },

              {
                dataField: "duration",
                text: "duration",
                sort: true,
                formatter: (cell, row) => <Value value={cell} suffix="min" />,
              },
              {
                dataField: "auction_start",
                text: "auction start",
                sort: true,
              },
              // {
              //   dataField: "type",
              //   text: "type",
              //   // },
              //   {
              //     dataField: "debt",
              //     text: "debt",
              //     formatter: (cell, row) => (
              //       <Value value={cell} decimals={2} compact prefix="$" />
              //     ),
              //   },
              //   {
              //     dataField: "available_collateral",
              //     text: "available collateral",
              //     formatter: (cell, row) => <Value value={cell} decimals={2} />,
              //   },
              //   {
              //     dataField: "osm_price",
              //     text: "osm price",
              //     formatter: (cell, row) => (
              //       <Value value={cell} decimals={2} prefix="$" />
              //     ),
              //   },
              //   {
              //     dataField: "mkt_price",
              //     text: "market price",
              //     formatter: (cell, row) => (
              //       <Value value={cell} decimals={2} prefix="$" />
              //     ),
              //   },
              //   {
              //     dataField: "keeper",
              //     text: "keeper",
              //     formatter: (cell) => <EtherscanShort address={cell} />,
              //   },
              //   {
              //     dataField: "incentives",
              //     text: "incentives",
              //     formatter: (cell, row) => (
              //       <Value value={cell} decimals={2} prefix="$" />
              //     ),
              //   },
              //   {
              //     dataField: "caller",
              //     text: "caller",
              //     formatter: (cell) => <EtherscanShort address={cell} />,
              //   },
              //   {
              //     dataField: "status",
              //     text: "status",
              //   },
            ]}
          />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(LiquidationsIlk);
