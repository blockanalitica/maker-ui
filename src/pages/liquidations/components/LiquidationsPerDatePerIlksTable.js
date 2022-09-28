import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../../components/Loader/Loader.js";
import LinkTable from "../../../components/Table/LinkTable.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import styles from "./LiquidationsPerIlksTable.module.scss";

function LiquidationsPerDatePerIlksTable(props) {
  const { date } = useParams();
  const pageSize = 15;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);

  let navigate = useNavigate();

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `/liquidations/per-date/${date}`,
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
    navigate(`${row.ilk}/`);
  };

  return (
    <div className="mt-4">
      <LinkTable
        loading={isPreviousData}
        keyField="id"
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
          },
          {
            dataField: "total_debt",
            text: "debt",
            formatter: (cell, row) => (
              <Value value={cell} decimals={2} prefix="$" compact />
            ),
            sort: true,
          },

          {
            dataField: "recovered_debt",
            text: "recovered debt",
            formatter: (cell, row) => (
              <Value value={cell} decimals={2} prefix="$" compact />
            ),
            sort: true,
          },
          {
            dataField: "total_penalty_fee",
            text: "penalty fee",
            formatter: (cell, row) => (
              <Value value={cell} decimals={2} prefix="$" compact />
            ),
            sort: true,
          },
          {
            dataField: "keepers",
            text: "unqiue keepers",
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

export default withErrorBoundary(LiquidationsPerDatePerIlksTable);
