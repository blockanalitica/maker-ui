// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../../components/Loader/Loader.js";
import RemoteTable from "../../../components/Table/RemoteTable.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import styles from "./LiquidationsPerIlksTable.module.scss";

function LiquidationsPerIlksTable(props) {
  const pageSize = 15;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);

  let navigate = useNavigate();

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "/liquidations/per-ilks/",
    { p: page, p_size: pageSize, order },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { results, count } = data;

  const onValueClick = (e, url) => {
    navigate(url);
    e.stopPropagation();
  };

  const onRowClick = (row) => {
    navigate(`per-vault-type/${row.ilk}/`);
  };

  return (
    <div className="mt-4">
      <RemoteTable
        loading={isPreviousData}
        keyField="ilk"
        hover={true}
        onRowClick={onRowClick}
        data={results}
        columns={[
          {
            dataField: "",
            text: "",
            formatter: (cell, row) => <CryptoIcon name={row.symbol} size="2em" />,
          },
          {
            dataField: "ilk",
            text: "vault type",
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
          {
            dataField: "keepers",
            text: "unique keepers",
            formatter: (cell, row) => (
              <>
                <Value value={cell} decimals={0} />
                <FontAwesomeIcon
                  className={styles.icon}
                  icon={faInfoCircle}
                  onClick={(e) =>
                    onValueClick(e, `/liquidations/keepers/?ilk=${row.ilk}`)
                  }
                />
              </>
            ),
            sort: true,
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "takers",
            text: "unique takers",
            formatter: (cell, row) => (
              <>
                <Value value={cell} decimals={0} />
                <FontAwesomeIcon
                  className={styles.icon}
                  icon={faInfoCircle}
                  onClick={(e) =>
                    onValueClick(e, `/liquidations/takers/?ilk=${row.ilk}`)
                  }
                />
              </>
            ),
            sort: true,
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

export default withErrorBoundary(LiquidationsPerIlksTable);
