// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Loader from "../../../components/Loader/Loader.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";

function DropTable(props) {
  const { timePeriod } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/risk/drop-table",
    { days_ago: timePeriod }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  return (
    <BootstrapTable
      keyField="drop"
      data={data}
      hover={false}
      bordered={false}
      defaultSorted={[
        {
          dataField: "drop",
          order: "asc",
        },
      ]}
      columns={[
        {
          dataField: "drop",
          text: "Drop",
          formatter: (cell, row) => (
            <Value value={cell} decimals={0} prefix="-" suffix="%" />
          ),
        },
        {
          dataField: "low",
          text: "Low",
          formatter: (cell, row) => (
            <>
              <Value value={cell} decimals={2} prefix="$" compact />
              <br />
              <ValueChange
                className="pl-2"
                value={row.low_diff}
                tooltipValue={row.previous_low}
                prefix="$"
                reverse
                hideIfZero
                decimals={2}
                compact
                icon
              />
            </>
          ),
          headerAlign: "right",
          align: "right",
        },
        {
          dataField: "medium",
          text: "Medium",
          formatter: (cell, row) => (
            <>
              <Value value={cell} decimals={2} prefix="$" compact />
              <br />
              <ValueChange
                className="pl-2"
                value={row.medium_diff}
                tooltipValue={row.previous_medium}
                prefix="$"
                reverse
                hideIfZero
                decimals={2}
                icon
                compact
              />
            </>
          ),
          headerAlign: "right",
          align: "right",
        },
        {
          dataField: "high",
          text: "High",
          formatter: (cell, row) => (
            <>
              <Value value={cell} decimals={2} prefix="$" compact />
              <br />
              <ValueChange
                className="pl-2"
                value={row.high_diff}
                tooltipValue={row.previous_high}
                prefix="$"
                reverse
                hideIfZero
                decimals={2}
                icon
                compact
              />
            </>
          ),
          headerAlign: "right",
          align: "right",
        },
        {
          dataField: "total",
          text: "Total",
          formatter: (cell, row) => (
            <>
              <Value value={cell} decimals={2} prefix="$" compact />
              <br />
              <ValueChange
                className="pl-2"
                value={row.total_diff}
                tooltipValue={row.previous_total}
                prefix="$"
                reverse
                hideIfZero
                decimals={2}
                icon
                compact
              />
            </>
          ),
          headerAlign: "right",
          align: "right",
        },
      ]}
    />
  );
}

export default withErrorBoundary(DropTable);
