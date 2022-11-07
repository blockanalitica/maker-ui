// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { Col, Row, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, useQueryParams } from "../../hooks";
import Graph from "../../components/Graph/Graph.js";
import { compact } from "../../utils/number.js";
import Card from "../../components/Card/Card.js";
import Slider, { createSliderWithTooltip } from "rc-slider";
import Select from "../../components/Select/Select.js";
import queryString from "query-string";
import LoadingOverlay from "react-loading-overlay";
import Value from "../../components/Value/Value.js";

const SliderWithTooltip = createSliderWithTooltip(Slider);

function RiskModel(props) {
  let navigate = useNavigate();
  const queryParams = useQueryParams();

  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const toggleMethodologyOpen = () => setMethodologyOpen(!methodologyOpen);

  const ilk = queryParams.get("ilk");
  const jumpSeverity = queryParams.get("jumpSeverity");
  const jumpFrequency = queryParams.get("jumpFrequency");
  const keeperProfit = queryParams.get("keeperProfit");

  const [showApply, setShowApply] = useState(false);

  const [params, setParams] = useState({});

  const {
    data,
    isLoading,
    isPreviousData,
    isRefetching,
    isError,
    ErrorFallbackComponent,
  } = useFetch(
    "/simulations/risk-model/",
    {
      ilk: ilk,
      jump_frequency: jumpFrequency,
      jump_severity: jumpSeverity,
      keeper_profit: keeperProfit,
    },
    {
      keepPreviousData: true,
      onSuccess: (responseData) => {
        setParams({
          ilk: ilk ? ilk : responseData.ilk,
          jumpSeverity: jumpSeverity
            ? jumpSeverity
            : responseData.default_params.jump_severity,
          jumpFrequency: jumpFrequency
            ? jumpFrequency
            : responseData.default_params.jump_frequency,
          keeperProfit: keeperProfit
            ? keeperProfit
            : responseData.default_params.keeper_profit,
        });
      },
    }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onVaultChange = (ilk) => {
    const newParams = { ilk };
    setParams(newParams);
    let qs = queryString.stringify(newParams, { skipNull: true });
    navigate(`?${qs}`);
  };

  const onParamChange = (qp) => {
    setParams({
      ...params,
      ...qp,
    });
    setShowApply(true);
  };

  const onApply = (e) => {
    let qs = queryString.stringify(params, { skipNull: true });
    navigate(`?${qs}`);
    setShowApply(false);
    e.preventDefault();
  };

  const {
    data: rows,
    vault_types: vaultTypes,
    default_params: defaultParams,
    debt_ceiling: debtCeiling,
    total_debt_dai: debtExposure,
    risk_premium: riskPremium,
    share_vaults_protected: shareVaultsProtected,
    capital_at_risk: capitalAtRisk,
  } = data;

  const vaultOptions = vaultTypes.map((ilk) => ({
    value: ilk,
    label: ilk,
  }));

  const selectedVaultOption = vaultOptions.find(
    (option) => option.value === params.ilk
  );

  const graphAnnotations = {};

  let maxDebtCeilingCopy = null;
  if (debtCeiling) {
    maxDebtCeilingCopy = (
      <p>
        Maximum Debt Ceiling (Risk Premium = 10%) is{" "}
        <Value value={debtCeiling} prefix="$" decimals={0} className="fw-bold" />
      </p>
    );

    graphAnnotations["maxDC"] = {
      type: "line",
      scaleID: "x",
      value: debtCeiling,
      borderColor: "red",
      borderWidth: 2,
      borderDash: [10, 8],
      label: {
        position: "start",
        backgroundColor: "#0e1726",
        color: "red",
        content: "DC at 10% RP",
        enabled: true,
      },
    };
  } else {
    maxDebtCeilingCopy = (
      <p>
        Maximum Debt Ceiling (Risk Premium = 10%) not reached in the simulated Debt
        Exposure
      </p>
    );
  }

  let riskPremiumCopy = null;
  if (riskPremium) {
    riskPremiumCopy = (
      <p>
        Risk Premium at current Debt Exposure (
        <Value value={debtExposure} prefix="$" decimals={0} className="fw-bold" />) is{" "}
        <Value value={riskPremium} suffix="%" decimals={2} className="fw-bold" />
      </p>
    );

    graphAnnotations["CR"] = {
      type: "line",
      scaleID: "x",
      value: debtExposure,
      borderColor: "green",
      borderWidth: 2,
      borderDash: [10, 8],
      label: {
        position: "start",
        backgroundColor: "#0e1726",
        yAdjust: 40,
        color: "green",
        content: "RP at current DE",
        enabled: true,
      },
    };
  } else {
    riskPremiumCopy = (
      <p>Current Risk Premium is not found in the simulated Debt Ceiling values</p>
    );
  }

  const series = [
    {
      label: "Risk Premium",
      data: rows.map((row) => ({
        x: row["simulated_de"],
        y: row["risk_premium"],
      })),
    },
  ];

  const options = {
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        type: "linear",
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },
        title: {
          display: true,
          text: "debt exposure",
        },
      },
      y: {
        ticks: {
          callback: (value) => `${value}%`,
        },

        title: {
          display: true,
          text: "risk premium",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      annotation: {
        annotations: graphAnnotations,
      },
    },
  };

  return (
    <>
      <h1 className="h3 mb-4">Risk Model</h1>
      <LoadingOverlay active={isPreviousData || isRefetching} spinner>
        <Row>
          <Col xl={3} className="mb-4">
            <Card fullHeight={false}>
              <div className="mb-3">
                <div className="mb-1 section-title">vault type</div>
                <Select
                  value={selectedVaultOption}
                  options={vaultOptions}
                  onChange={(option) => onVaultChange(option.value)}
                />
              </div>

              {defaultParams ? (
                <>
                  <div className="mb-2">
                    <div className="mb-1 section-title">
                      jump severity{" "}
                      <small className="text-content">
                        [default: {defaultParams.jump_severity * 100}%]
                      </small>
                    </div>
                    <SliderWithTooltip
                      value={-params.jumpSeverity}
                      min={0.25}
                      max={0.7}
                      marks={{
                        0.25: "-25%",
                        0.3: "",
                        0.35: "",
                        0.4: "",
                        0.45: "",
                        0.5: "",
                        0.55: "",
                        0.6: "",
                        0.65: "",
                        0.7: "-70%",
                      }}
                      step={null}
                      tipFormatter={(value) => `-${Math.round(value * 100)}%`}
                      onChange={(value) => onParamChange({ jumpSeverity: -value })}
                    />
                  </div>
                  <div className="mb-2">
                    <div className="mb-1 section-title">
                      jump frequency{" "}
                      <small className="text-content">
                        [default: {defaultParams.jump_frequency}]
                      </small>
                    </div>
                    <SliderWithTooltip
                      value={params.jumpFrequency}
                      min={1}
                      max={5}
                      marks={{
                        1: "1",
                        2: "",
                        3: "",
                        4: "",
                        5: "5",
                      }}
                      step={null}
                      onChange={(value) => onParamChange({ jumpFrequency: value })}
                    />
                  </div>
                  <div className="mb-2">
                    <div className="mb-1 section-title">
                      keeper profit{" "}
                      <small className="text-content">
                        [default: {defaultParams.keeper_profit * 100}%]
                      </small>
                    </div>
                    <SliderWithTooltip
                      value={params.keeperProfit}
                      min={0.01}
                      max={0.1}
                      marks={{
                        0.01: "1%",
                        0.025: "",
                        0.05: "",
                        0.075: "",
                        0.1: "10%",
                      }}
                      step={null}
                      tipFormatter={(value) => `${value * 100}%`}
                      onChange={(value) => onParamChange({ keeperProfit: value })}
                    />
                  </div>
                </>
              ) : null}

              {showApply ? (
                <div className="text-center">
                  <Button color="primary" className="mb-4" onClick={onApply}>
                    Apply
                  </Button>
                </div>
              ) : null}
            </Card>
          </Col>
          <Col xl={9} className="mb-4 text-center">
            <h1>{params.ilk}</h1>
            <div className="text-start">
              {maxDebtCeilingCopy}
              {riskPremiumCopy}
              {shareVaultsProtected ? (
                <p>
                  Vaults protected share:{" "}
                  <Value
                    value={shareVaultsProtected * 100}
                    suffix="%"
                    decimals={0}
                    className="fw-bold"
                  />
                </p>
              ) : null}

              {capitalAtRisk ? (
                <p>
                  Capital at Risk:{" "}
                  <Value
                    value={capitalAtRisk}
                    prefix="$"
                    decimals={0}
                    className="fw-bold"
                  />
                </p>
              ) : null}
            </div>
            <Graph series={series} options={options} className="mb-4 mt-4" />

            <div role="button" className="link-primary" onClick={toggleMethodologyOpen}>
              Show Methodology
            </div>
          </Col>
        </Row>
        <Modal isOpen={methodologyOpen} toggle={toggleMethodologyOpen}>
          <ModalHeader toggle={toggleMethodologyOpen}>Methodology</ModalHeader>
          <ModalBody>
            <p>
              The Risk Model is based on the methodology defined and{" "}
              <a
                href="https://www.youtube.com/watch?v=blpPCgLmUaM&t=528s"
                target="_blank"
                rel="noopener noreferrer"
              >
                presented
              </a>{" "}
              on the governance call in April 2020.
            </p>
            <p>
              The model iterates over different debt exposure values per vault type and
              computes the expected loss by averaging over three different scenarios
              (baseline, upside, and downside). Each scenario spec gives insight into
              the expected behavior of Maker vaults system under different market
              conditions.
            </p>
            <p>
              The losses are simulated on the live structure of loans by assuming
              different sets of collateral price drops with predefined severity and
              frequency. Expected loss equals risk premium. For debt ceiling estimation
              purposes we defined max debt ceiling at debt exposure where risk premium
              equals 10%.
            </p>
            <p>We have added extra complexities to the model:</p>
            <ul className="list">
              <li>
                New input variables:
                <ul className="list">
                  <li>
                    share of vaults which unwind their debt position between OSM price
                    delay
                  </li>
                  <li>expected keepers’ profit under Liquidation 2.0</li>
                </ul>
              </li>
              <li>Auction slippage is based on estimated slippage using 1inch</li>
            </ul>
            <p>Main model inputs:</p>
            <ul className="list">
              <li>
                Live collateralization ratio distribution and debt size of each vault
                type
              </li>
              <li>Live on-chain liquidity slippage curves</li>
              <li>Frequency and severity of price drop of each collateral type</li>
              <li>
                Share of vaults unwinding there debt position during price drop and
                between OSM price delay
              </li>
              <li>Keepers’ profit under Liquidation 2.0</li>
            </ul>
          </ModalBody>
        </Modal>
      </LoadingOverlay>
    </>
  );
}

export default withErrorBoundary(RiskModel);
