// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../components/Loader/Loader.js";
import LinkTable from "../../components/Table/LinkTable.js";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import Value from "../../components/Value/Value.js";
import ValueChange from "../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle } from "../../hooks";

function Ilks(props) {
  usePageTitle("Vault Types");
  let navigate = useNavigate();

  const [daysAgo, setDaysAgo] = useState(1);
  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "/ilks/",
    { days_ago: daysAgo },
    { keepPreviousData: true }
  );

  const timeOptions = [
    { key: 1, value: "1 day" },
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
  ];

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onRowClick = (row) => {
    if (row.type === "psm") {
      navigate(`/psms/${row.ilk}/`);
    } else if (row.is_stable) {
      navigate(`${row.ilk}/vaults/`);
    } else {
      navigate(`${row.ilk}/`);
    }
  };

  return (
    <>
      <div className="d-flex mb-5 align-items-center">
        <h1 className="h3 mb-0 flex-grow-1">vault types</h1>
        <TimeSwitch
          activeOption={daysAgo}
          label={""}
          onChange={setDaysAgo}
          options={timeOptions}
        />
      </div>
      <LoadingOverlay active={isPreviousData} spinner>
        <Row>
          <Col className="mb-4">
            <LinkTable
              keyField="ilk"
              data={data}
              onRowClick={onRowClick}
              pagination={paginationFactory({
                sizePerPageList: [],
                sizePerPage: 20,
                showTotal: true,
              })}
              defaultSorted={[
                {
                  dataField: "dai_debt",
                  order: "desc",
                },
              ]}
              columns={[
                {
                  dataField: null,
                  text: "",
                  sort: false,
                  formatter: (cell, row) => (
                    <CryptoIcon className="me-2" name={row.collateral} size="2rem" />
                  ),
                },
                {
                  dataField: "ilk",
                  text: "Vault type",
                  sort: true,
                },
                {
                  dataField: "dai_debt",
                  text: "DAI debt",
                  formatter: (cell, row) => (
                    <Value value={cell} decimals={2} prefix="$" compact />
                  ),
                  sort: true,
                  headerAlign: "right",
                  align: "right",
                },
                {
                  dataField: "total_debt_diff",
                  text: "DAI debt change",
                  formatter: (cell, row) => (
                    <ValueChange
                      value={cell}
                      decimals={2}
                      prefix="$"
                      compact
                      icon
                      hideIfZero
                    />
                  ),
                  sort: true,
                },
                {
                  dataField: "vaults_count",
                  text: "# of vaults",
                  sort: true,
                  headerAlign: "right",
                  align: "right",
                },
                {
                  dataField: "vaults_count_diff",
                  text: "# of vaults change",
                  formatter: (cell, row) => (
                    <ValueChange value={cell} icon hideIfZero />
                  ),
                  sort: true,
                },
                {
                  dataField: "locked",
                  text: "TVL",
                  formatter: (cell, row) => <Value value={cell} decimals={2} compact />,
                },
                {
                  dataField: "stability_fee",
                  text: "Fee",
                  sort: true,
                  formatter: (cell, row) => (
                    <Value value={cell * 100} decimals={2} suffix="%" />
                  ),
                  headerAlign: "right",
                  align: "right",
                },
                {
                  dataField: "lr",
                  text: "LR",
                  sort: true,
                  formatter: (cell, row) => (
                    <Value value={cell * 100} decimals={0} suffix="%" />
                  ),
                  headerAlign: "right",
                  align: "right",
                },
                {
                  dataField: "dust",
                  text: "Dust",
                  sort: true,
                  formatter: (cell, row) => (
                    <Value value={cell} decimals={2} prefix="$" compact />
                  ),
                  headerAlign: "right",
                  align: "right",
                },
              ]}
            />
          </Col>
        </Row>
      </LoadingOverlay>
    </>
  );
}

export default withErrorBoundary(Ilks);
