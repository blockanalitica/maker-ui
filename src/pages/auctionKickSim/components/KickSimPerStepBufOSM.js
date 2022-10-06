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
import { useQueryParams } from "../../../hooks";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import Stat from "../../../components/Stat/Stat.js";
import BootstrapTable from "react-bootstrap-table-next";
import { round } from "../../../utils/number.js";
import InfoIcon from "../../../components/Icon/InfoIcon.js";
import { parseUTCDateTime } from "../../../utils/datetime.js";
import { mean, min, max } from "mathjs";
import LoadingOverlay from "react-loading-overlay";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";

function KickSimPerStepBufOSM(props) {
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

  let allAuctions = [];
  let tableData = [];
  if (auctionsByDay) {
    Object.entries(auctionsByDay).forEach(([date, values]) => {
      const { auctions } = values;
      allAuctions.push(...auctions);
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
              <small className="text-content">(Default: {defaultSettings.step})</small>
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
              <small className="text-content">(Default: {defaultSettings.buf})</small>
            </Col>
          </FormGroup>

          {showApply ? (
            <Button color="primary" className="ml-4" onClick={onApply}>
              Apply
            </Button>
          ) : null}
        </Col>
        <Col xl={6}>
          <p className="text-content">
            This simulation simulates a kick for the actual OSM prices between (date -
            3hrs) and date. Kick happens at the same time as the OSM was set.
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
                    formatter: (cell) => (
                      <Value value={cell} suffix={<small>min</small>} decimals={0} />
                    ),
                    sort: true,
                    headerAlign: "right",
                    align: "right",
                  },
                  {
                    dataField: "duration_min",
                    text: "Duration Min",
                    formatter: (cell) => (
                      <Value value={cell} suffix={<small>min</small>} decimals={0} />
                    ),
                    sort: true,
                    headerAlign: "right",
                    align: "right",
                  },
                  {
                    dataField: "duration_max",
                    text: "Duration Max",
                    formatter: (cell) => (
                      <Value value={cell} suffix={<small>min</small>} decimals={0} />
                    ),
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
      {allAuctions && allAuctions.length > 0 ? (
        <Row className="mb-5">
          <Col>
            <h3 className="mb-4">Detailed information about the kicks</h3>
            <LoadingOverlay active={isLoading} spinner>
              <ToolkitProvider
                bootstrap4
                keyField="kick_time"
                data={allAuctions}
                columns={[
                  {
                    dataField: "kick_time",
                    text: "Kick time",
                    formatter: (cell) => {
                      const dt = parseUTCDateTime(cell);
                      return dt.toFormat("yyyy-MM-dd HH:mm");
                    },
                    sort: true,
                  },
                  {
                    dataField: "kick_market_price",
                    text: "Kick Market Price",
                    formatter: (cell) => <Value value={cell} prefix="$" decimals={2} />,
                    sort: true,
                    headerAlign: "right",
                    align: "right",
                  },
                  {
                    dataField: "current_osm",
                    text: "OSM",
                    formatter: (cell) => <Value value={cell} prefix="$" decimals={2} />,
                    sort: true,
                    headerAlign: "right",
                    align: "right",
                  },
                  {
                    dataField: "top",
                    text: "Top",
                    formatter: (cell) => <Value value={cell} prefix="$" decimals={2} />,
                    sort: true,
                    headerAlign: "right",
                    align: "right",
                  },
                  {
                    dataField: "step_price",
                    text: "Liquidation Price",
                    formatter: (cell) => <Value value={cell} prefix="$" decimals={2} />,
                    sort: true,
                    headerAlign: "right",
                    align: "right",
                  },
                  {
                    dataField: "duration",
                    text: "Duration",
                    formatter: (cell) => (
                      <Value value={cell} suffix={<small>min</small>} decimals={0} />
                    ),
                    sort: true,
                    headerAlign: "right",
                    align: "right",
                  },
                  {
                    dataField: "slippage",
                    text: "Slippage",
                    formatter: (cell) => (
                      <Value value={cell * 100} suffix="%" decimals={2} />
                    ),
                    sort: true,
                    headerAlign: "right",
                    align: "right",
                  },
                ]}
                exportCSV
              >
                {(props) => (
                  <div>
                    <ExportCSVButton className="btn-primary mb-3" {...props.csvProps}>
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
    </>
  );
}

export default withErrorBoundary(KickSimPerStepBufOSM);
