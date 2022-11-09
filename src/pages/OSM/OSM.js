// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import DateTimeAgo from "../../components/DateTime/DateTimeAgo.js";
import Loader from "../../components/Loader/Loader.js";
import LinkTable from "../../components/Table/LinkTable.js";
import Value from "../../components/Value/Value.js";
import ValueChange from "../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";
import { parseUTCDateTime } from "../../utils/datetime.js";

function Ilks(props) {
  usePageTitle("Oracles");
  let navigate = useNavigate();
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch("/osm/");

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { assets, lps } = data;

  const onRowClick = (row) => {
    navigate(`/oracles/${row.symbol}/`);
  };

  const assetsTable = (
    <Row>
      <h4>Assets</h4>
      <Col className="mb-4">
        <LinkTable
          keyField="symbol"
          data={assets}
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
              sort: false,
              formatter: (cell, row) => (
                <>
                  <CryptoIcon className="me-2" name={row.symbol} size="1.5rem" />
                  {cell}
                </>
              ),
            },
            {
              dataField: "osm_current_price",
              text: "Current price",
              formatter: (cell, row) => <Value value={cell} decimals={2} prefix="$" />,
              sort: true,
              headerAlign: "right",
              align: "right",
            },

            {
              dataField: "osm_next_price",
              text: "Next price",
              formatter: (cell, row) => (
                <>
                  <div className="text-nowrap">
                    <Value value={cell} decimals={2} prefix="$" />
                    <br />
                    <ValueChange
                      className="pl-2"
                      value={row.diff}
                      suffix="%"
                      hideIfZero
                      decimals={2}
                      icon
                    />
                  </div>
                </>
              ),
              sort: true,
              headerAlign: "right",
              align: "right",
            },
            {
              dataField: "medianizer",
              text: "Medianizer price",
              formatter: (cell, row) => <Value value={cell} decimals={2} prefix="$" />,
              sort: true,
              headerAlign: "right",
              align: "right",
            },

            {
              dataField: null,
              text: "Next change in",
              formatter: (cell, row) => (
                <>
                  {row.to_next_change && (
                    <Value value={row.to_next_change} decimals={0} suffix=" min" />
                  )}
                </>
              ),
              sort: true,
              headerAlign: "right",
              align: "right",
            },
            {
              dataField: "datetime",
              text: "Last updated",
              formatter: (cell, row) => (
                <DateTimeAgo dateTime={parseUTCDateTime(cell)} />
              ),
              sort: true,
              headerAlign: "right",
              align: "right",
            },
          ]}
        />
      </Col>
    </Row>
  );

  const lpsTable = (
    <Row>
      <h4>LPs</h4>
      <Col className="mb-4">
        <LinkTable
          keyField="symbol"
          data={lps}
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
              text: "LP",
              sort: false,
              formatter: (cell, row) => (
                <>
                  <CryptoIcon className="me-2" name={row.symbol} size="1.5rem" />
                  {cell}
                </>
              ),
            },
            {
              dataField: "osm_current_price",
              text: "Current price",
              formatter: (cell, row) => <Value value={cell} decimals={2} prefix="$" />,
              sort: true,
              headerAlign: "right",
              align: "right",
            },
            {
              dataField: "osm_next_price",
              text: "Next price",
              formatter: (cell, row) => (
                <>
                  <div className="text-nowrap">
                    <Value value={cell} decimals={2} prefix="$" />
                    <br />
                    <ValueChange
                      className="pl-2"
                      value={row.diff}
                      suffix="%"
                      hideIfZero
                      decimals={2}
                      icon
                    />
                  </div>
                </>
              ),
              sort: true,
              headerAlign: "right",
              align: "right",
            },
            {
              dataField: "datetime",
              text: "Last updated",
              formatter: (cell, row) => (
                <DateTimeAgo dateTime={parseUTCDateTime(cell)} />
              ),
              sort: true,
              headerAlign: "right",
              align: "right",
            },
          ]}
        />
      </Col>
    </Row>
  );

  return (
    <>
      {assetsTable}
      {lpsTable}
    </>
  );
}

export default withErrorBoundary(Ilks);
