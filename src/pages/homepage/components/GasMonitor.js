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
    "/risk/gas",
    { days_ago: timePeriod },
    {
      refetchInterval: 60000, // in ms
      refetchOnWindowFocus: true,
    }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { actions, gas } = data;

  return (
    <>
      <div className="d-flex flex-row">
        <p>
          Gas price in GWEI for fast transfers is {gas.fast} (
          <ValueChange
            value={gas.fast_diff}
            tooltipValue={gas.previous_fast}
            decimals={0}
            icon
            hideIfZero
            reverse
          />
          )
        </p>
      </div>
      <BootstrapTable
        keyField="drop"
        data={actions}
        hover={false}
        bordered={false}
        columns={[
          {
            dataField: "name",
            text: "Action",
          },
          {
            dataField: "gas",
            text: "Gas used",
            formatter: (cell, row) => <Value value={cell} decimals={0} />,
            headerAlign: "right",
            align: "right",
          },

          {
            dataField: "fast_price",
            text: "Price",
            formatter: (cell, row) => (
              <>
                <Value value={cell} prefix="$" decimals={2} />
                <br />
                <ValueChange
                  className="pl-2"
                  value={row.fast_price_diff}
                  tooltipValue={row.previous_fast_price}
                  prefix="$"
                  hideIfZero
                  decimals={2}
                  icon
                />
              </>
            ),
            headerAlign: "right",
            align: "right",
          },
        ]}
      />
    </>
  );
}

export default withErrorBoundary(DropTable);
