// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader/Loader.js";
import RemoteTable from "../../../components/Table/RemoteTable.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";

function LiquidationsPerDaysTable(props) {
  const { type } = props;
  const pageSize = 15;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);

  let navigate = useNavigate();

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "/liquidations/per-date/",
    { p: page, p_size: pageSize, order },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  let onRowClick;
  const { results, count } = data;
  if (type === "tab") {
    onRowClick = (row) => {
      navigate(`per-date/${row.auction_date}/`);
    };
  } else {
    onRowClick = (row) => {
      navigate(`${row.auction_date}/`);
    };
  }

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
            dataField: "auction_date",
            text: "date",
            sort: true,
          },

          {
            dataField: "total_auctions",
            text: "# of liquidations",
            formatter: (cell, row) => <Value value={cell} decimals={0} />,
            sort: true,
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "total_debt",
            text: "debt",
            formatter: (cell, row) => (
              <Value value={cell} decimals={2} prefix="$" compact />
            ),
            sort: true,
            headerAlign: "right",
            align: "right",
          },

          {
            dataField: "recovered_debt",
            text: "recovered debt",
            formatter: (cell, row) => (
              <Value value={cell} decimals={2} prefix="$" compact />
            ),
            sort: true,
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "total_penalty_fee",
            text: "penalty fee",
            formatter: (cell, row) => (
              <Value value={cell} decimals={2} prefix="$" compact />
            ),
            sort: true,
            headerAlign: "right",
            align: "right",
          },
          //   {
          //     dataField: "penalty_fee_per",
          //     text: "penalty fee %",
          //     formatter: (cell, row) => (
          //       <Value value={cell * 100} decimals={2} suffix="%" compact />
          //     ),
          //     sort: true,
          //   },
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

export default withErrorBoundary(LiquidationsPerDaysTable);
