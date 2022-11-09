// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import DateTimeAgo from "../../../components/DateTime/DateTimeAgo.js";
import Loader from "../../../components/Loader/Loader.js";
import RemoteTable from "../../../components/Table/RemoteTable.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { parseUTCDateTime } from "../../../utils/datetime.js";

function LiquidationsTable(props) {
  const { daysAgo } = props;
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);

  let navigate = useNavigate();

  // If daysAgo changes, reset page to 1, otherwise if user changes the page to some
  // number, change daysAgo to a lower value, the page might not exist in the new
  // response, raising an exception
  useEffect(() => {
    setPage(1);
  }, [daysAgo]);

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "/liquidations/table/",
    { days_ago: daysAgo, p: page, p_size: pageSize, order },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { results, count } = data;

  const onRowClick = (row) => {
    navigate(`${row.ilk}/${row.uid}/`);
  };

  return (
    <div className="mt-4">
      <RemoteTable
        loading={isPreviousData}
        keyField="id"
        hover={true}
        onRowClick={onRowClick}
        data={results}
        columns={[
          {
            dataField: "",
            text: "",
            formatter: (cell, row) => (
              <CryptoIcon name={row.collateral_symbol} size="2em" />
            ),
          },
          {
            dataField: "ilk",
            text: "vault type",
          },

          {
            dataField: "collateral_seized_usd",
            text: "Coll. Seized",
            formatter: (cell, row) => (
              <>
                <Value
                  value={row.collateral_seized}
                  decimals={2}
                  suffix={<small>{` ${row.collateral_symbol}`}</small>}
                  compact
                />
              </>
            ),
            sort: true,
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "debt_repaid_usd",
            text: "Debt Repaid",
            formatter: (cell, row) => (
              <>
                <Value
                  value={row.debt_repaid}
                  decimals={2}
                  suffix={<small>{` ${row.debt_symbol}`}</small>}
                  compact
                />
              </>
            ),
            sort: true,
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "penalty",
            text: "penalty",
            formatter: (cell, row) => (
              <>
                <Value
                  value={cell}
                  decimals={2}
                  suffix={<small>{` ${row.debt_symbol}`}</small>}
                  compact
                />
              </>
            ),
            sort: true,
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "datetime",
            text: "Date",
            formatter: (cell, row) => <DateTimeAgo dateTime={parseUTCDateTime(cell)} />,
            headerAlign: "right",
            align: "right",
          },
        ]}
        page={page}
        pageSize={pageSize}
        totalPageSize={count}
        onSortChange={setOrder}
        onPageChange={setPage}
      />
    </div>
  );
}

LiquidationsTable.propTypes = {
  daysAgo: PropTypes.number.isRequired,
};

export default withErrorBoundary(LiquidationsTable);
