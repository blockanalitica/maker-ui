import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../components/Loader/Loader.js";
import RemoteTable from "../../components/Table/RemoteTable.js";
import Value from "../../components/Value/Value.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch } from "../../hooks";

function LiquidationsPerVaultType(props) {
  const { ilk } = useParams();
  let navigate = useNavigate();

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);
  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `/liquidations/per-ilks/${ilk}/`,
    { p: page, p_size: pageSize, order },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { results, count } = data;

  const onRowClick = (row) => {
    navigate(`/liquidations/${row.ilk}/${row.uid}/`);
  };

  return (
    <>
      {/* <Row>
        <div className="d-flex mb-4 justify-content-space-between align-items-center">
          <div className="mb-2 flex-grow-1">
            <div className={styles.title}>
              <CryptoIcon name={ilk} size="3rem" className="mb-2" />
              <h3>{ilk}</h3>
            </div>
          </div>
        </div>
      </Row> */}
      <Row className="mb-4">
        <h4>liquidations for {ilk}</h4>
        <Col className="text-center">
          <RemoteTable
            loading={isPreviousData}
            keyField="uid"
            hover={true}
            onRowClick={onRowClick}
            data={results}
            defaultSorted={[
              {
                dataField: "uid",
                order: "desc",
              },
            ]}
            columns={[
              {
                dataField: "",
                text: "",
                formatter: (cell, row) => <CryptoIcon name={row.symbol} size="2em" />,
              },
              {
                dataField: "ilk",
                text: "vault type",
              },
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
            ]}
            page={page}
            pageSize={pageSize}
            totalPageSize={count}
            onSortChange={setOrder}
            onPageChange={setPage}
          />
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(LiquidationsPerVaultType);
