// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { Col, Row, FormGroup, Label, Input, Button } from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { withErrorBoundary } from "../../hoc.js";
import { usePageTitle } from "../../hooks";
import Loader from "../../components/Loader/Loader.js";
import { useFetch, useQueryParams } from "../../hooks.js";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import Select from "../../components/Select/Select.js";
import Switch from "../../components/Switch/Switch.js";
import Card from "../../components/Card/Card.js";
import Value from "../../components/Value/Value.js";

function DustSim(props) {
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  usePageTitle("Dust Simulation");

  const { ExportCSVButton } = CSVExport;

  const qParams = {
    ilk: queryParams.get("ilk") || "ETH-A",
    // date: queryParams.get("date") || undefined,
    eth_price: queryParams.get("eth_price") || undefined,

    liquidation_fees: queryParams.get("liquidation_fees") || undefined,
    bark: queryParams.get("bark") || undefined,
    take: queryParams.get("take") || undefined,
    dex_trade: queryParams.get("dex_trade") || undefined,
    base_debt: queryParams.get("base_debt") || 0,
  };

  const [params, setParams] = useState(qParams);
  const [showApply, setShowApply] = useState(false);

  const onApply = (e) => {
    let qs = queryString.stringify(params, { skipNull: true });
    navigate(`?${qs}`);
    setShowApply(false);
    e.preventDefault();
  };

  const onNumChange = (param, value) => {
    if (value < 0) {
      value = 0;
    }
    onParamChange({ [param]: value });
  };

  const onParamChange = (qp, submit = false) => {
    const queryParams = {
      ...params,
      ...qp,
    };
    setParams(queryParams);
    if (submit) {
      let qs = queryString.stringify(queryParams, { skipNull: true });
      navigate(`?${qs}`);
    } else {
      setShowApply(true);
    }
  };

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "/simulations/dust/",
    qParams,
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { results, ilks, default_settings: defaultSettings } = data;

  let dropColumns = [];
  if (results && results.length > 0) {
    dropColumns = Object.keys(results[0]);
    dropColumns = dropColumns.filter(
      (item) => item !== "gas_gwei" && item !== "gas_dai"
    );
  }

  const ilkOptions = ilks.map((ilk) => {
    return { value: ilk, label: ilk };
  });

  const selectedIlkOption = ilkOptions.find((option) => option.value === qParams.ilk);

  return (
    <div>
      <h1 className="h3 mb-4">Dust simulation</h1>
      <Row>
        <Col xl={3} className="mb-4">
          <Card fullHeight={false}>
            <FormGroup row className="mb-2">
              <Label xl={5} for="ilk">
                ilk:
              </Label>
              <Col xl={7}>
                <Select
                  id="ilk"
                  defaultValue={selectedIlkOption}
                  options={ilkOptions}
                  onChange={(option) => onParamChange({ ilk: option.value })}
                />
              </Col>
            </FormGroup>
            <FormGroup row className="mb-2">
              <Label xl={5} for="eth_price">
                ETH price:
              </Label>
              <Col xl={7}>
                <Input
                  id="eth_price"
                  type="number"
                  min={0}
                  value={params.eth_price || defaultSettings.eth_price}
                  onChange={(e) => onNumChange("eth_price", e.target.value)}
                />
              </Col>
            </FormGroup>

            <FormGroup row className="mb-2">
              <Label xl={5} for="bark">
                bark:
              </Label>
              <Col xl={7}>
                <Input
                  id="bark"
                  type="number"
                  min={0}
                  value={params.bark || defaultSettings.bark}
                  onChange={(e) => onNumChange("bark", e.target.value)}
                />
              </Col>
            </FormGroup>

            <FormGroup row className="mb-2">
              <Label xl={5} for="take">
                take:
              </Label>
              <Col xl={7}>
                <Input
                  id="take"
                  type="number"
                  min={0}
                  value={params.take || defaultSettings.take}
                  onChange={(e) => onNumChange("take", e.target.value)}
                />
              </Col>
            </FormGroup>

            <FormGroup row className="mb-2">
              <Label xl={5} for="dex_trade">
                DEX trade:
              </Label>
              <Col xl={7}>
                <Input
                  id="dex_trade"
                  type="number"
                  min={0}
                  value={params.dex_trade || defaultSettings.dex_trade}
                  onChange={(e) => onNumChange("dex_trade", e.target.value)}
                />
              </Col>
            </FormGroup>

            <FormGroup row className="mb-2">
              <Label xl={5} for="liquidation_fees">
                liq. fees:
              </Label>
              <Col xl={7}>
                <Input
                  id="liquidation_fees"
                  type="number"
                  min={0}
                  value={params.liquidation_fees || defaultSettings.liquidation_fees}
                  onChange={(e) => onNumChange("liquidation_fees", e.target.value)}
                />
              </Col>
            </FormGroup>

            <FormGroup row className="mb-2">
              <Label xl={5} for="base_debt">
                base debt:
              </Label>
              <Col xl={7} className="d-flex align-items-center">
                <Switch
                  id="base_debt"
                  checked={params.base_debt === "1"}
                  onCheckedChange={(checked) =>
                    onParamChange({ base_debt: checked ? "1" : "0" })
                  }
                />
              </Col>
            </FormGroup>

            {showApply ? (
              <div className="text-center">
                <Button color="primary" className="ml-4" onClick={onApply}>
                  Apply
                </Button>
              </div>
            ) : null}
          </Card>
        </Col>
        <Col xl={9}>
          <LoadingOverlay active={isPreviousData || isLoading} spinner>
            <ToolkitProvider
              bootstrap4
              keyField="date"
              data={results}
              columns={[
                {
                  dataField: "gas_gwei",
                  text: "Gas GWEI",
                  sort: true,
                  headerAlign: "right",
                  align: "right",
                },
                {
                  dataField: "gas_dai",
                  text: "Gas DAI",
                  formatter: (cell) => <Value value={cell} decimals={2} />,
                  sort: true,
                  headerAlign: "right",
                  align: "right",
                },

                ...dropColumns.map((drop) => ({
                  dataField: drop,
                  text: `${drop}%`,
                  formatter: (cell) => <Value value={cell} decimals={2} compact />,
                  sort: true,
                  headerAlign: "right",
                  align: "right",
                })),
              ]}
              exportCSV
            >
              {(props) => (
                <>
                  <div className="mb-3 text-end">
                    <ExportCSVButton className="btn-primary" {...props.csvProps}>
                      Export as CSV
                    </ExportCSVButton>
                  </div>
                  <BootstrapTable bordered={false} {...props.baseProps} />
                </>
              )}
            </ToolkitProvider>
          </LoadingOverlay>
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(DustSim);
