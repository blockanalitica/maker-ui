// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import { useNavigate } from "react-router";
import { Input, Button } from "reactstrap";
import Value from "../../../components/Value/Value.js";
import React from "react";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import { withErrorBoundary } from "../../../hoc";
import LinkTable from "../../../components/Table/LinkTable.js";
import queryString from "query-string";

function ThroughputsTable(props) {
  const { data, ...rest } = props;
  let navigate = useNavigate();
  const { ExportCSVButton } = CSVExport;

  const onApply = (e) => {
    let qs = queryString.stringify({ percentLiquidated: rest.percentLiquidated });
    navigate(`?${qs}`);
    rest.setShowApply(false);
    e.preventDefault();
  };

  const onRowClick = (row) => {
    let qs = queryString.stringify(
      {
        percentLiquidated: rest.percentLiquidated,
        simHole: row.current_hole,
        buf: row.buf * 100,
        cut: row.cut * 100,
        step: row.step,
        daiDebt: row.dai,
        tail: row.tail,
        cusp: row.cusp,
      },
      { skipNull: true }
    );
    navigate(`/simulations/auctions-throughput/${row.ilk}/?${qs}`);
  };

  const onPercentLiquidated = (value) => {
    if (value > 100) {
      return;
    }
    rest.setPercentLiquidated(value);
    rest.setShowApply(true);
  };
  const auctionDurations = [];
  const ilks = [];
  data.forEach((row) => {
    auctionDurations.push(row.auction_dur_m);
    ilks.push(row.ilk);
  });
  const columns = [
    {
      dataField: "asset",
      text: "Asset",
      formatter: (cell) => <>{cell}</>,
      sort: true,
    },
    {
      dataField: "ilk",
      text: "Ilk",
      formatter: (cell) => <>{cell}</>,
      sort: true,
    },
    {
      dataField: "auction_cycle",
      text: "Auction cycle",
      formatter: (cell) => (
        <Value value={cell} decimals={2} suffix={<small>min</small>} />
      ),
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "auction_dur",
      text: "Auction time",
      formatter: (cell) => <>{cell}</>,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "slippage_to_dai",
      text: "Slippage to dai",
      formatter: (cell) => <Value value={cell} suffix="%" decimals={2} />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "dai",
      text: "Dai",
      formatter: (cell) => <Value value={cell} prefix="$" decimals={2} compact />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "debt_ceiling",
      text: "Debt ceiling",
      formatter: (cell) => <Value value={cell} prefix="$" decimals={2} compact />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "dc_iam_line",
      text: "Dc-iam-line",
      formatter: (cell) => <Value value={cell} prefix="$" decimals={2} compact />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "lr",
      text: "Lr",
      formatter: (cell) => <Value value={cell * 100} suffix="%" decimals={0} />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "chop",
      text: "Chop",
      formatter: (cell) => <Value value={(cell - 1) * 100} suffix="%" decimals={0} />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "current_hole",
      text: "Current hole",
      formatter: (cell) => <Value value={cell} prefix="$" decimals={0} compact />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "debt_exposure_share",
      text: "Share of debt exposure",
      formatter: (cell) => <Value value={cell} suffix="%" decimals={2} />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "buf",
      text: "Buf",
      formatter: (cell) => <Value value={cell * 100} suffix="%" decimals={0} />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "tail",
      text: "Tail",
      formatter: (cell) => (
        <Value value={cell} suffix={<small>sec</small>} decimals={0} />
      ),
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "cusp",
      text: "Cusp",
      formatter: (cell) => <Value value={cell * 100} suffix="%" decimals={2} />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "chip",
      text: "Chip",
      formatter: (cell) => <Value value={cell * 100} suffix="%" decimals={2} />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "tip",
      text: "Tip",
      formatter: (cell) => <Value value={cell} decimals={0} />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "step",
      text: "Step",
      formatter: (cell) => (
        <Value value={cell} suffix={<small>sec</small>} decimals={0} />
      ),
      sort: true,
      headerAlign: "right",
      align: "right",
    },
    {
      dataField: "cut",
      text: "Cut",
      formatter: (cell) => <Value value={cell * 100} suffix="%" decimals={2} />,
      sort: true,
      headerAlign: "right",
      align: "right",
    },
  ];

  return (
    <>
      <ToolkitProvider
        bootstrap4
        keyField="dai"
        data={data}
        columns={columns}
        exportCSV
      >
        {(props) => (
          <div>
            <div className="d-flex mb-4 align-items-center">
              <div className="d-flex flex-row align-items-center">
                <span> Percent of ilk dai liquidated:</span>
                <Input
                  type="number"
                  name="percent_liquidated"
                  id="percent_liquidated"
                  step={5}
                  value={rest.percentLiquidated}
                  className="ms-2 me-1"
                  style={{ width: "5rem" }}
                  onChange={(event) => onPercentLiquidated(event.target.value)}
                ></Input>
                <span className="mr-4">%</span>
              </div>
              {rest.showApply ? (
                <Button color="primary" className="ms-4" onClick={onApply}>
                  Apply
                </Button>
              ) : null}

              <div className="flex-grow-1"></div>
              <ExportCSVButton className="btn-primary" {...props.csvProps}>
                Export as CSV
              </ExportCSVButton>
            </div>

            <LinkTable
              {...props.baseProps}
              onRowClick={onRowClick}
              defaultSorted={[
                {
                  dataField: "dai",
                  order: "desc",
                },
              ]}
            />
          </div>
        )}
      </ToolkitProvider>
    </>
  );
}

export default withErrorBoundary(ThroughputsTable);
