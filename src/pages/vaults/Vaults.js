// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import classnames from "classnames";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Col, Row } from "reactstrap";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import DateTimeAgo from "../../components/DateTime/DateTimeAgo.js";
import Loader from "../../components/Loader/Loader.js";
import RemoteTable from "../../components/Table/RemoteTable.js";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import Value from "../../components/Value/Value.js";
import ValueChange from "../../components/Value/ValueChange.js";
import EventStatsChart from "./components/EventStatsChart.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch } from "../../hooks";
import { parseUTCDateTime } from "../../utils/datetime.js";
import { shorten } from "../../utils/address.js";
import styles from "./Vaults.module.scss";

function Vaults(props) {
  const { ilk } = useParams();
  const pageSize = 25;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);
  const [timePeriod, setTimePeriod] = useState(1);
  const [vaults, setVaults] = useState("active");
  const [isTokenCurrency, setIsTokenCurrency] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const vaultOptions = [
    { key: "active", value: "Active" },
    { key: "all", value: "All" },
  ];
  let navigate = useNavigate();
  const { SearchBar } = Search;
  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `/ilks/${ilk}/vaults/`,
    {
      p: page,
      p_size: pageSize,
      search: searchText,
      order,
      vaults: vaults,
    },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { type, results, count } = data;

  const onRowClick = (row) => {
    navigate(`/vault-types/${ilk}/vaults/${row.uid}/`);
  };

  const onOwnerClick = (e, url) => {
    navigate(url);
    e.stopPropagation();
  };

  const priceChangeFormatter = (cell, row) => (
    <>
      {isTokenCurrency ? (
        <ValueChange value={cell} decimals={2} compact hideIfZero />
      ) : (
        <ValueChange
          value={cell * row.osm_price}
          decimals={2}
          prefix="$"
          compact
          hideIfZero
        />
      )}
    </>
  );
  const priceFormatter = (cell, row) => (
    <>
      {isTokenCurrency ? (
        <Value value={cell} decimals={2} compact />
      ) : (
        <Value value={cell * row.osm_price} decimals={2} prefix="$" compact />
      )}
    </>
  );

  const onDSProxyClick = (e, address, url) => {
    window.open(`${url}${address}`, "_blank");
    e.stopPropagation();
  };

  const columns = [
    {
      dataField: "uid",
      text: "vault id",
    },
    {
      dataField: "collateral",
      text: "collateral",
      sort: true,
      formatExtraData: { isTokenCurrency },
      formatter: priceFormatter,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "collateral_change_" + timePeriod + "d",
      text: "Collateral Change",
      sort: true,
      formatExtraData: { isTokenCurrency, timePeriod },
      formatter: priceChangeFormatter,
    },
    {
      dataField: "debt",
      text: "debt",
      sort: true,
      formatter: (cell, row) => <Value value={cell} decimals={2} prefix="$" compact />,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "principal_change_" + timePeriod + "d",
      text: "Debt Change",
      sort: true,
      formatter: (cell, row) => (
        <ValueChange value={cell} decimals={2} prefix="$" compact hideIfZero />
      ),
    },
    {
      dataField: "liquidation_drop",
      text: "Liq. drop",
      sort: true,
      formatter: (cell, row) => <Value value={cell * 100} decimals={0} suffix="%" />,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "liquidation_price",
      text: "Liq. price",
      sort: true,
      formatter: (cell, row) => <Value value={cell} decimals={0} prefix="$" />,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "collateralization",
      text: "CR",
      sort: true,
      formatter: (cell, row) => <Value value={cell} decimals={0} suffix="%" />,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "ds_proxy_address",
      text: "DS Proxy",
      formatter: (cell, row) => (
        <>
          {cell ? (
            <>
              <div className="small">{shorten(cell)}</div>
              <div>
                <CryptoIcon
                  name="etherscan"
                  className="me-2"
                  onClick={(e) =>
                    onDSProxyClick(e, cell, "https://etherscan.io/address/")
                  }
                />
                <CryptoIcon
                  name="debank"
                  className="me-2"
                  onClick={(e) =>
                    onDSProxyClick(e, cell, "https://debank.com/profile/")
                  }
                />
                <CryptoIcon
                  name="zapper"
                  onClick={(e) => onDSProxyClick(e, cell, "https://zapper.fi/account/")}
                />
              </div>
            </>
          ) : (
            "-"
          )}
        </>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "owner_address",
      text: "owner address",
      sort: true,
      formatter: (cell, row) => (
        <>
          {cell ? (
            <span
              role="button"
              className="link"
              onClick={(e) => onOwnerClick(e, `/wallets/${cell}/`)}
            >
              {row.owner_name ||
                (row.owner_ens && row.owner_ens.length < 25 ? row.owner_ens : null) ||
                shorten(cell)}
            </span>
          ) : (
            "-"
          )}
        </>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "last_activity",
      text: "Last activity",
      formatter: (cell, row) => <DateTimeAgo dateTime={parseUTCDateTime(cell)} />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
  ];

  if (type === "asset") {
    columns.splice(7, 0, {
      dataField: "protection_score",
      text: "protection score",
      sort: true,
      align: "center",
      formatter: (cell, row) => {
        if (row.protection_service) {
          return <CryptoIcon name={row.protection_service} size="2rem" />;
        } else if (cell === "low") {
          return (
            <Badge color="success" className="mr-1">
              {cell} risk
            </Badge>
          );
        } else if (cell === "medium") {
          return (
            <Badge color="warning" className="mr-1">
              {cell} risk
            </Badge>
          );
        } else if (cell === "high") {
          return (
            <Badge color="danger" className="mr-1">
              {cell} risk
            </Badge>
          );
        }
        return null;
      },
    });
  }

  return (
    <>
      <h1 className="h3 mb-4">{ilk} Vaults Positions</h1>

      <Row className="mb-3">
        <Col lg={6} className="d-flex react-bootstrap-table-filter align-items-center">
          <div className={styles.currencySelector}>
            <label>Show amounts in: </label>
            <ul>
              <li
                className={classnames({
                  [styles.currencySelectorActive]: !isTokenCurrency,
                })}
                onClick={() => setIsTokenCurrency(false)}
              >
                $
              </li>
              <li
                className={classnames({
                  [styles.currencySelectorActive]: isTokenCurrency,
                })}
                onClick={() => setIsTokenCurrency(true)}
              >
                Token
              </li>
            </ul>
          </div>
        </Col>
        <Col
          lg={6}
          className="d-flex react-bootstrap-table-filter align-items-center justify-content-end"
        >
          Period: <TimeSwitch activeOption={timePeriod} onChange={setTimePeriod} />
        </Col>
      </Row>

      <EventStatsChart
        ilk={ilk}
        timePeriod={timePeriod}
        isTokenCurrency={isTokenCurrency}
      />
      <ToolkitProvider
        bootstrap4
        search
        keyField="uid"
        data={results}
        columns={columns}
      >
        {(props) => (
          <div>
            <div className="d-flex flex-direction-row justify-content-between mt-4">
              <div className="d-flex react-bootstrap-table-filter align-items-center justify-content-end">
                Vaults:{" "}
                <TimeSwitch
                  activeOption={vaults}
                  onChange={setVaults}
                  options={vaultOptions}
                />
              </div>

              <div className="d-flex react-bootstrap-table-filter align-items-baseline justify-content-center">
                <div className="text-content">Search:</div>
                <div className="ps-2">
                  <SearchBar
                    {...props.searchProps}
                    placeholder="address, uid or tag"
                    delay={500}
                  />
                </div>
              </div>
            </div>
            <RemoteTable
              {...props.baseProps}
              loading={isPreviousData}
              onRowClick={onRowClick}
              page={page}
              pageSize={pageSize}
              totalPageSize={count}
              onPageChange={setPage}
              onSortChange={setOrder}
              onSearch={setSearchText}
            />
          </div>
        )}
      </ToolkitProvider>
    </>
  );
}

export default withErrorBoundary(Vaults);
