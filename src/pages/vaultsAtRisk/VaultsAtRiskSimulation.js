// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate } from "react-router-dom";
import { Badge, Col, FormGroup, Input, Label, Row } from "reactstrap";
import Card from "../../components/Card/Card.js";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import DateTimeAgo from "../../components/DateTime/DateTimeAgo.js";
import Loader from "../../components/Loader/Loader.js";
import StatsBar from "../../components/Stats/StatsBar.js";
import RemoteTable from "../../components/Table/RemoteTable.js";
import VaultsAtRiskSimulationBarChart from "./VaultsAtRiskSimulationBarChart.js";
import Value from "../../components/Value/Value.js";
import { withErrorBoundary } from "../../hoc.js";
import { useDidMountEffect, useFetch, usePageTitle, useQueryParams } from "../../hooks";
import { shorten } from "../../utils/address.js";
import { parseUTCDateTime } from "../../utils/datetime.js";

function VaultsAtRiskSimulation(props) {
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  usePageTitle("Vaults At Risk Simulation");

  const queryParamDrop = queryParams.get("drop") || 5;
  const [drop, setDrop] = useState(queryParamDrop);
  const [order, setOrder] = useState(null);
  const pageSize = 25;
  const [page, setPage] = useState(1);

  useDidMountEffect(() => {
    const timer = setTimeout(() => {
      navigate(`?drop=${drop}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [drop]);

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "/simulations/vaults-at-risk/",
    {
      drop: queryParamDrop,
      p: page,
      p_size: pageSize,
      order,
    },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onDropChange = (drop) => {
    if (drop < 0) {
      drop = 0;
    } else if (drop > 99) {
      drop = 99;
    }
    setDrop(drop);
  };

  const onRowClick = (row) => {
    navigate(`/vault-types/${row.ilk}/vaults/${row.uid}/`);
  };

  const onOwnerClick = (e, url) => {
    navigate(url);
    e.stopPropagation();
  };

  const { count, results, aggregate_data: aggregateData, osm_prices: osmPrices } = data;

  const hasVaults = results && results.length > 0;

  const stats = [
    {
      title: "# of vaults",
      bigValue: <Value value={aggregateData.count} decimals={0} />,
    },
    {
      title: "total debt",
      bigValue: (
        <Value value={aggregateData.total_debt || 0} decimals={2} prefix="$" compact />
      ),
    },
    {
      title: "high risk",
      bigValue: (
        <Value value={aggregateData.high || 0} decimals={2} prefix="$" compact />
      ),
    },
    {
      title: "medium risk",
      bigValue: (
        <Value value={aggregateData.medium || 0} decimals={2} prefix="$" compact />
      ),
    },
    {
      title: "low risk",
      bigValue: (
        <Value value={aggregateData.low || 0} decimals={2} prefix="$" compact />
      ),
    },
  ];

  return (
    <>
      <h1 className="h3 mb-4">Vaults at risk simulation</h1>
      <FormGroup row className="mb-4">
        <Label xl={3} for="drop">
          Next OSM price will drop for:
        </Label>
        <Col xl={6} className="d-flex align-items-center">
          <Input
            id="drop"
            min={0}
            max={99}
            type="number"
            value={drop}
            className="me-2"
            style={{ width: "5rem" }}
            onChange={(e) => onDropChange(e.target.value)}
          />
          %
        </Col>
      </FormGroup>
      {hasVaults ? (
        <LoadingOverlay active={isPreviousData} spinner>
          <Row className="mb-4">
            <Col>
              <StatsBar stats={stats} />
            </Col>
          </Row>
          <Row className="mb-5">
            <Col xl={12}>
              <h4 className="my-2">ILK debt for {drop} % drop per ILK</h4>
              <VaultsAtRiskSimulationBarChart data={data} drop={drop} />
            </Col>
          </Row>
          <Row>
            <Col xl={3} className="mb-4">
              {osmPrices.map((osm) => {
                const osmStats = [
                  {
                    title: "Current OSM",
                    normalValue: (
                      <Value
                        value={osm.current_price}
                        decimals={2}
                        prefix="$"
                        compact100k
                      />
                    ),
                  },
                  {
                    title: "Simulated OSM",
                    normalValue: (
                      <Value
                        value={osm.next_price}
                        decimals={2}
                        prefix="$"
                        compact100k
                      />
                    ),
                  },
                ];
                return (
                  <Card className="mb-4" fullHeight={false} key={osm.symbol}>
                    <div className="mb-4 text-center">
                      <CryptoIcon className="me-2" name={osm.symbol} size="2rem" />
                      {osm.symbol}
                    </div>
                    <StatsBar stats={osmStats} cardTag="div" className="mb-2" />
                    <div className="d-flex small gray align-items-center justify-content-end">
                      <DateTimeAgo dateTime={parseUTCDateTime(osm.datetime)} />
                    </div>
                  </Card>
                );
              })}
            </Col>
            <Col xl={9} className="mb-4">
              <RemoteTable
                keyField="uid"
                data={results}
                onRowClick={onRowClick}
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
                    headerAlign: "center",
                    align: "center",
                  },
                  {
                    dataField: "liquidation_price",
                    text: "Liq. price",
                    sort: true,
                    formatter: (cell, row) => (
                      <Value value={cell} decimals={2} prefix="$" />
                    ),
                    headerAlign: "right",
                    align: "right",
                  },
                  {
                    dataField: "collateralization",
                    text: "CR",
                    sort: true,
                    formatter: (cell, row) => (
                      <Value value={cell} decimals={0} suffix="%" compact />
                    ),
                    headerAlign: "right",
                    align: "right",
                  },
                  {
                    dataField: "debt",
                    text: "debt",
                    sort: true,
                    formatter: (cell, row) => (
                      <Value value={cell} decimals={2} prefix="$" compact />
                    ),
                    headerAlign: "right",
                    align: "right",
                  },
                  {
                    dataField: "protection_score",
                    text: "protection score",
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
                    headerAlign: "center",
                    align: "center",
                  },
                  {
                    dataField: "last_activity",
                    text: "Last activity",
                    formatter: (cell, row) => (
                      <DateTimeAgo dateTime={parseUTCDateTime(cell)} />
                    ),
                    sort: true,
                    headerAlign: "right",
                    align: "right",
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
            </Col>
          </Row>
        </LoadingOverlay>
      ) : null}
      {!hasVaults ? (
        <Col xl={12} className="mb-4 text-center">
          <h3>no simulated vaults at risk at {drop}% OSM price drop</h3>
        </Col>
      ) : null}
    </>
  );
}

export default withErrorBoundary(VaultsAtRiskSimulation);
