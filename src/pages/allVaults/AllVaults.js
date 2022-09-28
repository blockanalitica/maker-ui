import classnames from "classnames";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Col, Row } from "reactstrap";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import DateTimeAgo from "../../components/DateTime/DateTimeAgo.js";
import EtherscanShort from "../../components/EtherscanShort/EtherscanShort.js";
import Loader from "../../components/Loader/Loader.js";
import RemoteTable from "../../components/Table/RemoteTable.js";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import Value from "../../components/Value/Value.js";
import ValueChange from "../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch } from "../../hooks";
import { parseUTCDateTime } from "../../utils/datetime.js";
import styles from "./AllVaults.module.scss";

function AllVaults(props) {
  const pageSize = 25;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);
  const [timePeriod, setTimePeriod] = useState(1);
  const [vaults, setVaults] = useState("active");
  const [isTokenCurrency, setIsTokenCurrency] = useState(false);
  const [searchText, setSearchText] = useState(null);
  let navigate = useNavigate();
  const { SearchBar } = Search;
  const vaultOptions = [
    { key: "active", value: "Active" },
    { key: "all", value: "All" },
  ];
  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `/vaults/all/`,
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

  const onRowClick = (row) => {
    navigate(`/vault-types/${row.ilk}/vaults/${row.uid}/`);
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
        <Value value={cell} decimals={2} compact hideIfZero />
      ) : (
        <Value
          value={cell * row.osm_price}
          decimals={2}
          prefix="$"
          compact
          hideIfZero
        />
      )}
    </>
  );
  return (
    <>
      <h1 className="h3 mb-4">vault positions</h1>
      <Row>
        <Col xl={12} className="mb-4 text-center">
          <Col className="mb-4 text-center">
            <ToolkitProvider
              bootstrap4
              search
              keyField="address"
              data={data.results}
              columns={[
                {
                  dataField: "uid",
                  text: "vault id",
                },
                {
                  dataField: "ilk",
                  text: "ilk",
                },
                {
                  dataField: "collateral",
                  text: "collateral",
                  sort: true,
                  formatExtraData: { isTokenCurrency },
                  formatter: priceFormatter,
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
                  formatter: (cell, row) => (
                    <Value value={cell} decimals={2} prefix="$" compact />
                  ),
                },
                {
                  dataField: "principal_change_" + timePeriod + "d",
                  text: "Debt Change",
                  sort: true,
                  formatter: (cell, row) => (
                    <ValueChange
                      value={cell}
                      decimals={2}
                      prefix="$"
                      compact
                      hideIfZero
                    />
                  ),
                },
                {
                  dataField: "liquidation_price",
                  text: "Liq. price",
                  sort: true,
                  formatter: (cell, row) => (
                    <Value value={cell} decimals={0} prefix="$" />
                  ),
                },
                {
                  dataField: "collateralization",
                  text: "CR",
                  sort: true,
                  formatter: (cell, row) => (
                    <Value value={cell} decimals={0} suffix="%" />
                  ),
                },
                {
                  dataField: "protection_score",
                  text: "protection score",
                  sort: true,
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
                },
                {
                  dataField: "last_activity",
                  text: "Last activity",
                  formatter: (cell, row) => (
                    <DateTimeAgo dateTime={parseUTCDateTime(cell)} />
                  ),
                  sort: true,
                },
                {
                  dataField: "owner_address",
                  text: "owner address",
                  sort: true,
                  formatter: (cell, row) => (
                    <>
                      {cell && cell !== "None" ? (
                        <EtherscanShort address={cell} name={row.owner_name} />
                      ) : (
                        "-"
                      )}
                    </>
                  ),
                },
              ]}
            >
              {(props) => (
                <div>
                  <div className="d-flex flex-direction-row justify-content-between mt-4">
                    <div className="d-flex react-bootstrap-table-filter align-items-center">
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
                    </div>
                    <div className="d-flex react-bootstrap-table-filter align-items-center justify-content-end">
                      Vaults:{" "}
                      <TimeSwitch
                        activeOption={vaults}
                        onChange={setVaults}
                        options={vaultOptions}
                      />
                    </div>
                    <div className="d-flex react-bootstrap-table-filter align-items-center justify-content-end">
                      Period:{" "}
                      <TimeSwitch activeOption={timePeriod} onChange={setTimePeriod} />
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
                    totalPageSize={data.count}
                    onPageChange={setPage}
                    onSortChange={setOrder}
                    onSearch={setSearchText}
                  />
                </div>
              )}
            </ToolkitProvider>
          </Col>
        </Col>
      </Row>
    </>
  );
}

export default withErrorBoundary(AllVaults);
