// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../components/Loader/Loader.js";
import RemoteTable from "../../components/Table/RemoteTable.js";
import Value from "../../components/Value/Value.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch } from "../../hooks";
import LiquidationsAuctionsBubbleChart from "./components/LiquidationsAuctionsBubbleChart.js";
import LiquidationsAuctionsSingleBubbleChart from "./components/LiquidationsAuctionsSingleBubbleChart.js";
import SideTabContent from "../../components/SideTab/SideTabContent.js";
import SideTabNav from "../../components/SideTab/SideTabNav.js";

import queryString from "query-string";
import { useQueryParams } from "../../hooks";

function LiquidationsPerDateIlk(props) {
  const { date, ilk } = useParams();
  let navigate = useNavigate();

  const queryParams = useQueryParams();
  const qParams = {
    tab: queryParams.get("tab") || "price-settled",
  };

  const [activeTab, setActiveTab] = useState(qParams.tab);
  const [params, setParams] = useState(qParams);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setParams({
        ...params,
        tab: tab,
      });

      const queryParams = {
        ...params,
        tab: tab,
      };
      let qs = queryString.stringify(queryParams, { skipNull: true });
      navigate(`?${qs}`);
    }
  };

  const pageSize = 15;
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);
  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `/liquidations/per-date/${date}/${ilk}/`,
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
      <Row className="mb-4 mt-4">
        <h4>
          liquidations for {ilk} on {date}
        </h4>
      </Row>
      <Row className="mb-4">
        <Col xl={2}>
          <SideTabNav
            activeTab={activeTab}
            toggleTab={toggleTab}
            tabs={[
              { id: "price-settled", text: "price settled" },
              { id: "price-settled-avg", text: "avg price settled" },
            ]}
          />
        </Col>
        <Col xl={10}>
          <SideTabContent
            activeTab={activeTab}
            tabs={[
              {
                id: "price-settled",
                content: (
                  <>
                    <h3>settled price for each action</h3>
                    <p>
                      Size of the dots represents the liquidated debt of all auctions
                      that happened at that OSM/market price and duration. Bigger the
                      size of the dot, bigger the total liquidatied debt.
                    </p>
                    <LiquidationsAuctionsSingleBubbleChart ilk={ilk} date={date} />
                  </>
                ),
              },
              {
                id: "price-settled-avg",
                content: (
                  <>
                    <h3>average settled price for auction</h3>
                    <p>
                      Size of the dots represents the liquidated debt of all auctions
                      that happened at that OSM/market price and duration. Bigger the
                      size of the dot, bigger the total liquidatied debt.
                    </p>
                    <LiquidationsAuctionsBubbleChart ilk={ilk} date={date} />
                  </>
                ),
              },
            ]}
          />
        </Col>
      </Row>
      {/* <Row className="mb-4">
        <Col className="mb-4">
          <LiquidationsAuctionsBubbleChart data={results} />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="mb-4">
          <h3>Settled Price</h3>
          <p>
            Size of the dots represents the liquidated debt of all auctions that
            happened at that OSM/market price and duration. Bigger the size of the dot,
            bigger the total liquidatied debt.
          </p>
          <LiquidationsAuctionsSingleBubbleChart ilk={ilk} date={date} />
        </Col>
      </Row> */}
      <Row className="mb-4">
        <Col className="text-center mt-4">
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
                dataField: "osm_settled_avg",
                text: "OSM settled",
                sort: true,
                formatter: (cell, row) => (
                  <Value value={cell * 100} decimals={2} suffix="%" />
                ),
              },
              {
                dataField: "mkt_settled_avg",
                text: "MKT settled",
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

export default withErrorBoundary(LiquidationsPerDateIlk);
