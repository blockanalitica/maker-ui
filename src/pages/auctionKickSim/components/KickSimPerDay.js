// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Col, Row, FormGroup, Label } from "reactstrap";
import { useQueryParams } from "../../../hooks";
import Value from "../../../components/Value/Value.js";
import BootstrapTable from "react-bootstrap-table-next";
import LoadingOverlay from "react-loading-overlay";
import Select from "../../../components/Select/Select.js";
import { withErrorBoundary } from "../../../hoc.js";
import DurationHeatmap from "./DurationHeatmap.js";
import PriceGraph from "./PriceGraph.js";
import SlippageHeatmap from "./SlippageHeatmap.js";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import { parseUTCDateTime } from "../../../utils/datetime.js";

function KickSimPerDay(props) {
  const { data, isLoading, onParamChange, asset } = props;
  const queryParams = useQueryParams();
  const { ExportCSVButton } = CSVExport;
  const qDate = queryParams.get("date") || undefined;

  const {
    default_settings: defaultSettings,
    param_data: paramData,
    dates,
    market_prices: marketPrices,
  } = data;

  if (!defaultSettings) {
    return null;
  }

  const dateOptions = dates.map((value) => {
    const date = parseUTCDateTime(value);
    return {
      value: date.toFormat("yyyy-MM-dd"),
      label: date.toFormat("yyyy-MM-dd HH:m"),
    };
  });

  const selectedDateOption = dateOptions.find((option) => option.value === qDate);

  let cdfColumns = [];
  let tableData = [];
  if (paramData) {
    cdfColumns = Object.keys(paramData[0].cdf_percentiles);
    tableData = paramData.map((row) => {
      return {
        id: row.step + "-" + row.buf,
        step: row.step,
        buf: row.buf,
        slippage_min: row.slippage.min,
        slippage_max: row.slippage.max,
        slippage_avg: row.slippage.avg,

        ...Object.entries(row.cdf_percentiles).reduce((obj, [cdf, duration]) => {
          obj["cdf_" + cdf] = duration;
          return obj;
        }, {}),
      };
    });
  }

  return (
    <>
      <Row>
        <Col xl={4} className="mb-4">
          <FormGroup row className="mb-2">
            <Label xl={2} for="asset">
              Date:
            </Label>
            <Col xl={10}>
              <Select
                defaultValue={selectedDateOption || dateOptions.at(-1)}
                options={dateOptions}
                onChange={(option) => onParamChange({ date: option.value }, true)}
              />
            </Col>
          </FormGroup>
        </Col>
        <Col xl={8}>
          <p className="text-content">
            This simulation simulates a kick for every minute between the (date - 3hrs)
            and date.
            <br />
            For OSM it takes the market price one hour before the kick for every kick.
            <br />
            If current OSM price (1 hr ago) is greater than the previous OSM (2 hrs
            ago), it doesn't trigger a kick.
          </p>
        </Col>
      </Row>
      {marketPrices ? (
        <Row className="mb-5">
          <Col>
            <LoadingOverlay active={isLoading} spinner>
              <PriceGraph marketPrices={marketPrices} asset={asset} />
            </LoadingOverlay>
          </Col>
        </Row>
      ) : null}
      {paramData ? (
        <>
          <Row className="mb-5">
            <Col>
              <LoadingOverlay active={isLoading} spinner>
                <DurationHeatmap data={paramData} />
              </LoadingOverlay>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col>
              <LoadingOverlay active={isLoading} spinner>
                <SlippageHeatmap data={paramData} />
              </LoadingOverlay>
            </Col>
          </Row>
          <Row>
            <Col>
              <LoadingOverlay active={isLoading} spinner>
                <ToolkitProvider
                  bootstrap4
                  keyField="id"
                  data={tableData}
                  columns={[
                    {
                      dataField: "step",
                      text: "Step",
                      formatter: (cell) => <Value value={cell} decimals={0} />,
                      sort: true,
                      headerAlign: "right",
                      align: "right",
                    },
                    {
                      dataField: "buf",
                      text: "Buf",
                      formatter: (cell) => (
                        <Value value={cell * 100} suffix="%" decimals={0} />
                      ),
                      sort: true,
                      headerAlign: "right",
                      align: "right",
                    },
                    {
                      dataField: "slippage_avg",
                      text: "Slippage Avg",
                      formatter: (cell) => (
                        <Value value={cell * 100} suffix="%" decimals={2} />
                      ),
                      sort: true,
                      headerAlign: "right",
                      align: "right",
                    },
                    {
                      dataField: "slippage_min",
                      text: "Slippage Min",
                      formatter: (cell) => (
                        <Value value={cell * 100} suffix="%" decimals={2} />
                      ),
                      sort: true,
                      headerAlign: "right",
                      align: "right",
                    },
                    {
                      dataField: "slippage_max",
                      text: "Slippage Max",
                      formatter: (cell) => (
                        <Value value={cell * 100} suffix="%" decimals={2} />
                      ),
                      sort: true,
                      headerAlign: "right",
                      align: "right",
                    },

                    ...cdfColumns.map((cdf) => ({
                      dataField: "cdf_" + cdf,
                      text: "CDF " + cdf,
                      formatter: (cell) => (
                        <Value value={cell} suffix={<small>min</small>} decimals={0} />
                      ),
                      sort: true,

                      align: "right",
                    })),
                  ]}
                  exportCSV
                >
                  {(props) => (
                    <div>
                      <ExportCSVButton className="btn-primary" {...props.csvProps}>
                        Export as CSV
                      </ExportCSVButton>
                      <BootstrapTable
                        bordered={false}
                        {...props.baseProps}
                        defaultSorted={[
                          {
                            dataField: "step",
                            order: "asc",
                          },
                        ]}
                      />
                    </div>
                  )}
                </ToolkitProvider>
              </LoadingOverlay>
            </Col>
          </Row>
        </>
      ) : null}
    </>
  );
}

export default withErrorBoundary(KickSimPerDay);
