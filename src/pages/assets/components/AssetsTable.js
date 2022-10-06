// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useNavigate } from "react-router-dom";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../../components/Loader/Loader.js";
import LinkTable from "../../../components/Table/LinkTable.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";

function AssetsTable(props) {
  const navigate = useNavigate();

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch("/assets/");

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onRowClick = (row) => {
    navigate(`/assets/${row.symbol}/`);
  };

  return (
    <>
      <h1 className="h3 mb-4">assets</h1>
      <LinkTable
        keyField="symbol"
        data={data}
        onRowClick={onRowClick}
        defaultSorted={[
          {
            dataField: "symbol",
            order: "asc",
          },
        ]}
        columns={[
          {
            dataField: "symbol",
            text: "Asset",
            className: "text-nowrap",
            formatter: (cell, row) => (
              <>
                <CryptoIcon className="me-3" name={row.symbol} size="2rem" />
                {cell}
              </>
            ),
            sort: true,
          },
          {
            dataField: "debt",
            text: "Total Debt",
            formatter: (cell) => <Value value={cell} prefix="$" decimals={3} compact />,
            sort: true,
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "collateral",
            text: "Total Collateral",
            formatter: (cell, row) => (
              <Value value={cell} suffix={` ${row.symbol}`} decimals={3} compact />
            ),
            headerAlign: "right",
            align: "right",
            sort: true,
          },
        ]}
      />
    </>
  );
}

export default withErrorBoundary(AssetsTable);
