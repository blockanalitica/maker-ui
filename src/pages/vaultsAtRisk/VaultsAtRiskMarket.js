// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import classnames from "classnames";
import React from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Col, Row } from "reactstrap";
import Card from "../../components/Card/Card.js";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import DateTimeAgo from "../../components/DateTime/DateTimeAgo.js";
import Loader from "../../components/Loader/Loader.js";
import StatsBar from "../../components/Stats/StatsBar.js";
import LinkTable from "../../components/Table/LinkTable.js";
import Value from "../../components/Value/Value.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import successImg from "../../images/success_meme.jpg";
import { shorten } from "../../utils/address.js";
import { parseUTCDateTime } from "../../utils/datetime.js";
import styles from "./VaultsAtRisk.module.scss";

function VaultsAtRiskMarket(props) {
  let navigate = useNavigate();
  usePageTitle("Vaults At Risk");

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/vaults-at-risk-market/"
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onRowClick = (row) => {
    navigate(`/vault-types/${row.ilk}/vaults/${row.uid}/`);
  };

  const onOwnerClick = (e, url) => {
    navigate(url);
    e.stopPropagation();
  };

  const { vaults, aggregate_data: aggregateData, market_prices: marketPrices } = data;

  const hasVaults = vaults && vaults.length > 0;

  const stats = [
    {
      title: "# of vaults",
      bigValue: <Value value={aggregateData.count} decimals={0} />,
    },
    {
      title: "total debt",
      bigValue: (
        <Value value={aggregateData.total_debt} decimals={2} prefix="$" compact />
      ),
    },
    {
      title: "high risk",
      bigValue: <Value value={aggregateData.high} decimals={2} prefix="$" compact />,
    },
    {
      title: "medium risk",
      bigValue: <Value value={aggregateData.medium} decimals={2} prefix="$" compact />,
    },
    {
      title: "low risk",
      bigValue: <Value value={aggregateData.low} decimals={2} prefix="$" compact />,
    },
  ];

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h3>Vaults at risk based on market price</h3>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <StatsBar stats={stats} />
        </Col>
      </Row>
      {hasVaults ? (
        <Row>
          <Col xl={3} className="mb-4 text-center">
            {marketPrices.map((market) => {
              const osmStats = [
                {
                  title: "market price",
                  normalValue: (
                    <Value value={market.price} decimals={2} prefix="$" compact100k />
                  ),
                },
              ];
              return (
                <Card className="mb-4" fullHeight={false} key={market.symbol}>
                  <div className="mb-4 text-center">
                    <CryptoIcon className="me-2" name={market.symbol} size="2rem" />
                    {market.symbol}
                  </div>
                  <StatsBar stats={osmStats} cardTag="div" className="mb-2" />
                  <div className="d-flex small gray align-items-center justify-content-end">
                    <DateTimeAgo dateTime={parseUTCDateTime(market.datetime)} />
                  </div>
                </Card>
              );
            })}
          </Col>
          <Col xl={9} className="mb-4">
            <LinkTable
              keyField="uid"
              data={vaults}
              onRowClick={onRowClick}
              pagination={paginationFactory({
                sizePerPageList: [],
                sizePerPage: 20,
                showTotal: true,
              })}
              defaultSorted={[
                {
                  dataField: "debt",
                  order: "desc",
                },
              ]}
              columns={[
                {
                  dataField: "collateral_symbol",
                  text: "",
                  sort: false,
                  formatter: (cell, row) => (
                    <CryptoIcon className="me-2" name={cell} size="2rem" />
                  ),
                },
                {
                  dataField: "ilk",
                  text: "ilk",
                  sort: true,
                },
                {
                  dataField: "uid",
                  text: "vault id",
                },
                {
                  dataField: "liquidation_price",
                  text: "Liq. price",
                  sort: true,
                  formatter: (cell, row) => (
                    <Value value={cell} decimals={2} prefix="$" compact100k />
                  ),
                },
                {
                  dataField: "collateralization",
                  text: "CR",
                  sort: true,
                  formatter: (cell, row) => (
                    <Value value={cell} decimals={0} suffix="%" compact100k />
                  ),
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
                      {cell ? (
                        <span
                          role="button"
                          className="link"
                          onClick={(e) => onOwnerClick(e, `/wallets/${cell}/`)}
                        >
                          {row.owner_name ||
                            (row.owner_ens && row.owner_ens.length < 25
                              ? row.owner_ens
                              : null) ||
                            shorten(cell)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </>
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      ) : null}
      {!hasVaults ? (
        <Row>
          <Col xl={12} className="mb-6 text-center">
            <h3 className="mb-4">no vaults at risk</h3>
            <div className={classnames(styles.successImgWrapper, "mb-4")}>
              <img src={successImg} alt="success" />
            </div>
            <Link to={"/simulations/vaults-at-risk/"}>
              <Button color="primary">vaults at risk simulation</Button>
            </Link>
          </Col>
        </Row>
      ) : null}
    </>
  );
}

export default withErrorBoundary(VaultsAtRiskMarket);
