// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import {
  Col,
  Row,
  FormGroup,
  Label,
  Input,
  Button,
  UncontrolledTooltip,
} from "reactstrap";
import { withErrorBoundary } from "../../../hoc.js";
import { useQueryParams } from "../../../hooks";
import { compact } from "../../../utils/number.js";
import Value from "../../../components/Value/Value.js";
import Stat from "../../../components/Stat/Stat.js";
import Graph from "../../../components/Graph/Graph.js";
import BootstrapTable from "react-bootstrap-table-next";
import InfoIcon from "../../../components/Icon/InfoIcon.js";
import _ from "lodash";
import { round } from "../../../utils/number.js";
import { mean, min, max } from "mathjs";
import LoadingOverlay from "react-loading-overlay";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import { tooltipLabelNumber } from "../../../utils/graph.js";

function KickSimPerStepBuf(props) {
  const { data, onParamChange: onParentParamChange, isLoading } = props;

  const queryParams = useQueryParams();

  const { ExportCSVButton } = CSVExport;
  const qParams = {
    step: queryParams.get("step") || undefined,
    buf: queryParams.get("buf") || undefined,
  };
  const [showApply, setShowApply] = useState(false);

  const [params, setParams] = useState(qParams);

  const onApply = (e) => {
    onParentParamChange(params, true);
    setShowApply(false);
    e.preventDefault();
  };

  const onParamChange = (qp) => {
    const queryParams = {
      ...params,
      ...qp,
    };
    setParams(queryParams);
    setShowApply(true);
  };

  const {
    default_settings: defaultSettings,
    auctions_by_day: auctionsByDay,
    auction_cycle: auctionCycle,
  } = data;

  if (!defaultSettings) {
    return null;
  }

  let durationGraphSeries = [];
  let slippageGraphSeries = [];
  let cdfGraphSeries = [];

  let tableData = [];
  if (auctionsByDay) {
    Object.entries(auctionsByDay).forEach(([date, values]) => {
      const { auctions, cdf } = values;
      cdfGraphSeries.push({
        label: date,
        data: cdf.durations.map((dur, i) => ({
          x: dur,
          y: cdf.cdf[i],
        })),
      });

      const durationCounts = _.countBy(auctions, "duration");
      durationGraphSeries.push({
        label: date,
        data: Object.entries(durationCounts).map(([key, value]) => ({
          x: Number(key),
          y: value,
        })),
      });

      const graphSlippages = auctions.map((v) => round(v.slippage, 3));
      const slippageCounts = _.countBy(graphSlippages);
      slippageGraphSeries.push({
        label: date,
        data: Object.entries(slippageCounts).map(([key, value]) => ({
          x: Number(key),
          y: value,
        })),
      });

      const slippages = auctions.map((v) => round(v.slippage, 4));
      const durations = auctions.map((a) => a.duration);
      const osmDiff = auctions.reduce((obj, item) => {
        obj.push((1 - item.kick_market_price / item.current_osm) * -1);
        return obj;
      }, []);
      tableData.push({
        date,
        slippage_min: min(slippages),
        slippage_max: max(slippages),
        slippage_avg: mean(slippages),
        duration_min: min(durations),
        duration_max: max(durations),
        duration_avg: mean(durations),
        num_kicks: auctions.length,
        osm_implied_slippage: min(osmDiff),
      });
    });
  }

  return (
    <>
      <Row>
        <Col xl={4} className="mb-4">
          <FormGroup row className="mb-3">
            <Label xl={2} for="step">
              Step:
            </Label>
            <Col xl={6}>
              <Input
                id="step"
                type="number"
                value={params.step || defaultSettings.step}
                onChange={(e) => onParamChange({ step: e.target.value })}
              />
            </Col>
            <Col xl={4}>
              <small>(Default: {defaultSettings.step})</small>
            </Col>
          </FormGroup>
          <FormGroup row className="mb-3">
            <Label xl={2} for="buf">
              Buf:
            </Label>
            <Col xl={6}>
              <Input
                id="buf"
                type="number"
                value={params.buf || defaultSettings.buf}
                onChange={(e) => onParamChange({ buf: e.target.value })}
              />
            </Col>
            <Col xl={4}>
              <small>(Default: {defaultSettings.buf})</small>
            </Col>
          </FormGroup>

          {showApply ? (
            <Button color="primary" className="ml-4" onClick={onApply}>
              Apply
            </Button>
          ) : null}
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
      <Row>
        <Col xl={4}>
          <Stat name="Auction cycle:">
            <Value value={auctionCycle} decimals={2} />
          </Stat>
        </Col>
      </Row>

      {tableData && tableData.length > 0 ? (
        <Row className="mb-5">
          <Col>
            <LoadingOverlay active={isLoading} spinner>
              <ToolkitProvider
                bootstrap4
                keyField="date"
                data={tableData}
                columns={[
                  {
                    dataField: "date",
                    text: "date",
                    sort: true,
                    formatter: (cell) => <small>{cell}</small>,
                  },
                  {
                    dataField: "num_kicks",
                    text: "# kicks",
                    formatter: (cell) => <Value value={cell} decimals={0} />,
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

                  {
                    dataField: "duration_avg",
                    text: "Duration Avg",
                    formatter: (cell) => <Value value={cell} decimals={0} />,
                    sort: true,
                    headerAlign: "right",
                    align: "right",
                  },
                  {
                    dataField: "duration_min",
                    text: "Duration Min",
                    formatter: (cell) => <Value value={cell} decimals={0} />,
                    sort: true,
                    headerAlign: "right",
                    align: "right",
                  },
                  {
                    dataField: "duration_max",
                    text: "Duration Max",
                    formatter: (cell) => <Value value={cell} decimals={0} />,
                    sort: true,
                    headerAlign: "right",
                    align: "right",
                  },
                  {
                    dataField: "osm_implied_slippage",
                    text: "OSM lag implied slippage",
                    formatter: (cell) => (
                      <Value value={cell * 100} suffix="%" decimals={2} />
                    ),
                    headerFormatter: (column) => (
                      <>
                        {column.text}
                        <InfoIcon id={"ttLagImpliedSlippage"} className="mx-2" />
                        <UncontrolledTooltip
                          placement="bottom"
                          target={"ttLagImpliedSlippage"}
                        >
                          Highest slippage between market price and OSM [1 - market
                          price / osm) * -1]
                        </UncontrolledTooltip>
                      </>
                    ),
                    headerAlign: "right",
                    align: "right",
                  },
                ]}
                exportCSV
              >
                {(props) => (
                  <div>
                    <ExportCSVButton className="btn-primary" {...props.csvProps}>
                      Export as CSV
                    </ExportCSVButton>

                    <BootstrapTable bordered={false} {...props.baseProps} />
                  </div>
                )}
              </ToolkitProvider>
            </LoadingOverlay>
          </Col>
        </Row>
      ) : null}

      {durationGraphSeries && durationGraphSeries.length > 0 ? (
        <Row className="mb-5">
          <Col>
            <h3 className="mb-4">Duration</h3>
            <LoadingOverlay active={isLoading} spinner>
              <Graph
                series={durationGraphSeries}
                options={{
                  interaction: {
                    mode: "nearest",
                    axis: "x",
                  },
                  scales: {
                    x: {
                      type: "linear",
                      title: {
                        display: true,
                        text: "duration",
                      },
                      ticks: {
                        callback: (value) => value + "min",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "number of auctions",
                      },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        title: (tooltipItems) => {
                          return "Duration: " + tooltipItems[0].parsed.x + " min";
                        },
                      },
                    },
                  },
                }}
              />
            </LoadingOverlay>
          </Col>
        </Row>
      ) : null}

      {cdfGraphSeries && cdfGraphSeries.length > 0 ? (
        <Row className="mb-5">
          <Col>
            <h3 className="mb-4">Duration CDF</h3>
            <LoadingOverlay active={isLoading} spinner>
              <Graph
                series={cdfGraphSeries}
                options={{
                  interaction: {
                    mode: "nearest",
                    axis: "x",
                  },
                  scales: {
                    x: {
                      type: "linear",
                      title: {
                        display: true,
                        text: "duration",
                      },
                      ticks: {
                        callback: (value) => value + "min",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "CDF",
                      },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        title: (tooltipItems) => {
                          return "Duration: " + tooltipItems[0].parsed.x + " min";
                        },
                      },
                    },
                  },
                }}
              />
            </LoadingOverlay>
          </Col>
        </Row>
      ) : null}

      {slippageGraphSeries && slippageGraphSeries.length > 0 ? (
        <Row>
          <Col>
            <h3 className="mb-4">Slippage</h3>
            <LoadingOverlay active={isLoading} spinner>
              <Graph
                type="scatter"
                series={slippageGraphSeries}
                options={{
                  scales: {
                    x: {
                      type: "linear",
                      title: {
                        display: true,
                        text: "slippage",
                      },
                      ticks: {
                        callback: (value) => compact(value * 100, 2, true) + "%",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "number of auctions",
                      },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        title: (tooltipItems) => {
                          return (
                            "Slippage: " +
                            compact(tooltipItems[0].parsed.x * 100, 2, true) +
                            "%"
                          );
                        },
                        label: (tooltipItem) => {
                          return tooltipLabelNumber(tooltipItem);
                        },
                      },
                    },
                  },
                }}
              />
            </LoadingOverlay>
          </Col>
        </Row>
      ) : null}
    </>
  );
}

export default withErrorBoundary(KickSimPerStepBuf);
