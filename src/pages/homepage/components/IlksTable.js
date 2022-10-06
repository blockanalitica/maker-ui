// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../../components/Loader/Loader.js";
import LinkTable from "../../../components/Table/LinkTable.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";

function IlksTable(props) {
  const { daysAgo } = props;
  let navigate = useNavigate();

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch("/ilks/", {
    days_ago: daysAgo,
    type: "risky",
  });

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onRowClick = (row) => {
    navigate(`vault-types/${row.ilk}/`);
  };

  return (
    <>
      <h4 className="mb-4">vault types</h4>
      <LinkTable
        keyField="ilk"
        data={data}
        onRowClick={onRowClick}
        pagination={paginationFactory({
          sizePerPageList: [],
          sizePerPage: 10,
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
            dataField: "collateral",
            text: "",
            sort: false,
            formatter: (cell) => (
              <CryptoIcon className="me-2" name={cell} size="2rem" />
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
            sort: true,
            formatter: (cell, row) => (
              <>
                <Value value={cell} decimals={2} prefix="$" compact />
                <br />
                <ValueChange
                  value={row.total_debt_diff}
                  decimals={2}
                  prefix="$"
                  compact
                  icon
                  hideIfZero
                />
              </>
            ),
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "capital_at_risk",
            text: "capital at risk",
            sort: true,
            formatter: (cell, row) => (
              <>
                <Value value={cell} decimals={2} prefix="$" compact />
                <br />
                <ValueChange
                  value={row.capital_at_risk_diff}
                  decimals={2}
                  prefix="$"
                  compact
                  icon
                  reverse
                  hideIfZero
                />
              </>
            ),
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "risk_premium",
            text: "risk premium",
            sort: true,
            formatter: (cell, row) => (
              <>
                <Value value={cell} decimals={2} suffix="%" />
                <br />
                <ValueChange
                  value={row.risk_premium_diff}
                  decimals={2}
                  suffix="%"
                  icon
                  reverse
                  hideIfZero
                />
              </>
            ),
            headerAlign: "right",
            align: "right",
          },
          {
            dataField: "vaults_count",
            text: "# of vaults",
            sort: true,
            formatter: (cell, row) => (
              <>
                <Value value={cell} decimals={0} />
                <br />
                <ValueChange
                  value={row.vaults_count_diff}
                  decimals={0}
                  icon
                  hideIfZero
                />
              </>
            ),
            headerAlign: "right",
            align: "right",
          },
        ]}
      />
      <div className="text-center">
        <Link to={`/vault-types/`}>
          <Button color="primary">see all vault types</Button>
        </Link>
      </div>
    </>
  );
}

export default withErrorBoundary(IlksTable);
