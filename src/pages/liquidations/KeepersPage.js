// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Col, Row } from "reactstrap";
import EtherscanShort from "../../components/EtherscanShort/EtherscanShort.js";
import StatsBar from "../../components/Stats/StatsBar.js";
import Loader from "../../components/Loader/Loader.js";
import Value from "../../components/Value/Value.js";
import { withErrorBoundary } from "../../hoc.js";
import DateTimeAgo from "../../components/DateTime/DateTimeAgo.js";
import { parseUTCDateTime } from "../../utils/datetime.js";
import { useFetch, usePageTitle, useQueryParams } from "../../hooks";
import BootstrapTable from "react-bootstrap-table-next";

function KeepersPage(props) {
  usePageTitle("Keepers");
  const queryParams = useQueryParams();
  const ilk = queryParams.get("ilk");
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/liquidations/keepers/",
    { ilk }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const { results, stats } = data;

  const statsBar = [
    {
      title: "unique keepers",
      bigValue: <Value value={stats.unique_keepers} decimals={0} />,
    },
    {
      title: "# kicks",
      bigValue: <Value value={stats.kick_count} decimals={0} />,
    },
    {
      title: "total debt kicked",
      bigValue: <Value value={stats.debt_repaid} decimals={2} prefix="$" compact />,
    },
    {
      title: "total incentives",
      bigValue: <Value value={stats.incentives} decimals={2} prefix="$" compact />,
    },
  ];

  return (
    <>
      <Row className="mb-4">
        <Col>
          <StatsBar stats={statsBar} />
        </Col>
      </Row>
      <BootstrapTable
        bordered={false}
        keyField="uid"
        data={results}
        defaultSorted={[
          {
            dataField: "debt_liquidated",
            order: "desc",
          },
        ]}
        columns={[
          {
            dataField: "wallet",
            text: "Keeper",
            formatter: (cell) => (cell ? <EtherscanShort address={cell} /> : <>-</>),
          },
          {
            dataField: "count",
            text: "Auctions Kicked",
            sort: true,
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "debt_liquidated",
            text: "Debt Kicked",
            formatter: (cell) => <Value value={cell} prefix="$" decimals={0} compact />,
            sort: true,
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "incentives",
            text: "Incentives",
            formatter: (cell) => <Value value={cell} prefix="$" decimals={0} />,
            sort: true,
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "share",
            text: "Share",
            formatter: (cell) => <Value value={cell} suffix="%" />,
            sort: true,
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "last_active",
            text: "Last Active",
            formatter: (cell, row) => <DateTimeAgo dateTime={parseUTCDateTime(cell)} />,
            sort: true,
            headerAlign: "right",
            align: "right",
          },
        ]}
        pagination={paginationFactory({
          sizePerPageList: [],
          sizePerPage: 25,
          showTotal: true,
        })}
      />
    </>
  );
}

export default withErrorBoundary(KeepersPage);
