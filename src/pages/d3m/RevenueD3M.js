// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Progress,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
  UncontrolledTooltip,
} from "reactstrap";
import queryString from "query-string";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate, useParams } from "react-router-dom";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import { withErrorBoundary } from "../../hoc.js";
import { useFetch, usePageTitle, useQueryParams } from "../../hooks";
import DaiBorrowCurveGraph from "./components/DaiBorrowCurveGraph.js";
import Loader from "../../components/Loader/Loader.js";
import InfoIcon from "../../components/Icon/InfoIcon.js";
import StatsBar from "../../components/Stats/StatsBar.js";
import Value from "../../components/Value/Value.js";
import ValueChange from "../../components/Value/ValueChange.js";

function RevenueD3M(props) {
  const { protocol } = useParams();
  const queryParams = useQueryParams();
  let navigate = useNavigate();

  const [curveModalOpen, setCurveModalOpen] = useState(false);
  const toggleCurveModalOpen = () => setCurveModalOpen(!curveModalOpen);

  const protocolTitle = protocol.charAt(0).toUpperCase() + protocol.slice(1);
  usePageTitle(`${protocolTitle} D3M Revenue Calculator`);

  const queryDebtCeiling = queryParams.get("debtCeiling");
  const queryTargetBorrowRate = queryParams.get("targetBorrowRate");
  const [debtCeiling, setDebtCeiling] = useState(queryDebtCeiling);
  const [targetBorrowRate, setTargetBorrowRate] = useState(queryTargetBorrowRate);

  const onSetDebtCeiling = (value) => {
    let num = parseInt(value.replace(/,/g, ""));
    if (isNaN(num)) {
      num = queryDebtCeiling;
    }
    if (num < 0) {
      num = 0;
    } else if (num > 1000000000) {
      num = 1000000000;
    }
    setDebtCeiling(num);
  };
  const onSetTargetBorrowRate = (value) => {
    setTargetBorrowRate(value);
  };

  const formatter = Intl.NumberFormat("en");

  const onApply = (e) => {
    const qs = queryString.stringify(
      { debtCeiling, targetBorrowRate },
      { skipNull: true }
    );
    navigate(`?${qs}`);
    e.preventDefault();
  };

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `/d3ms/${protocol}/simulation/`,
    {
      debt_ceiling: queryDebtCeiling,
      target_borrow_rate: queryTargetBorrowRate,
    },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const { stats, result } = data;
  const { line, bar } = result;
  const {
    protocol: protocolName,
    title,
    balance,
    borrow_rate: borrowRate,
    supply_rate: supplyRate,
    total_supply: totalSupply,
    utilization,
  } = stats;

  if (debtCeiling === null) {
    setDebtCeiling(line);
  }

  if (targetBorrowRate === null) {
    setTargetBorrowRate((bar * 100).toPrecision(3));
  }

  const descAave = (
    <p>
      This model fetches the current state of the Aave v2 DAI Market and calculates
      yearly D3M revenue given the chosen Target Borrow Rate and D3M Debt Ceiling.
      <br />
      The borrow rates are calculated using the{" "}
      <span role="button" className="link" onClick={toggleCurveModalOpen}>
        Interest Rate Curve
      </span>{" "}
      and Deposit APY formulas, both taken from{" "}
      <a
        href="https://docs.aave.com/risk/liquidity-risk/borrow-interest-rate"
        target="_blank"
        rel="noopener noreferrer"
      >
        Aave's Documentation
      </a>
    </p>
  );

  const descComp = (
    <p>
      This model fetches the current state of the Compound v2 DAI Market and calculates
      yearly D3M revenue given the chosen Target Borrow Rate and D3M Debt Ceiling.
      <br />
      The borrow rates are calculated using the{" "}
      <span role="button" className="link" onClick={toggleCurveModalOpen}>
        Interest Rate Curve
      </span>{" "}
      and formulas taken from{" "}
      <a
        href="https://compound.finance/documents/Compound.Whitepaper.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        Compound's whitepaper
      </a>
      ,{" "}
      <a
        href="https://observablehq.com/@jflatow/compound-interest-rates"
        target="_blank"
        rel="noopener noreferrer"
      >
        Jared Flatow
      </a>{" "}
      on Observable HQ and the{" "}
      <a
        href="https://etherscan.io/address/0xfb564da37b41b2f6b6edcc3e56fbf523bd9f2012#code"
        target="_blank"
        rel="noopener noreferrer"
      >
        JumpRateModelV2
      </a>{" "}
      smart contract which is used on Compound's cDai market
    </p>
  );

  const statsCurrent = [
    {
      title: "current exposure",
      bigValue: <Value value={balance} decimals={2} prefix="$" compact />,
    },
    {
      title: "current borrow rate",
      bigValue: <Value value={borrowRate * 100} decimals={2} suffix="%" />,
    },
    {
      title: "current supply rate",
      bigValue: <Value value={supplyRate * 100} decimals={2} suffix="%" />,
    },
    {
      title: "current supply",
      bigValue: <Value value={totalSupply} decimals={2} prefix="$" compact />,
    },
    {
      title: "current utilization",
      bigValue: <Value value={utilization * 100} decimals={2} suffix="%" />,
    },
  ];

  const statsSimulated = [
    {
      title: "simulated exposure",
      bigValue: (
        <Value value={result.d3m_exposure_total} decimals={2} prefix="$" compact />
      ),
      smallValue: (
        <ValueChange
          value={result.d3m_exposure}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
        />
      ),
    },
    {
      title: "simulated borrow rate",
      bigValue: (
        <Value value={result.simulation_borrow_rate * 100} decimals={2} suffix="%" />
      ),
      smallValue: (
        <ValueChange
          value={(result.simulation_borrow_rate - stats.borrow_rate) * 100}
          decimals={2}
          suffix="%"
          icon
          hideIfZero
        />
      ),
    },
    {
      title: "simulated supply rate",
      bigValue: (
        <Value value={result.simulation_supply_rate * 100} decimals={2} suffix="%" />
      ),
      smallValue: (
        <ValueChange
          value={(result.simulation_supply_rate - stats.supply_rate) * 100}
          decimals={2}
          suffix="%"
          icon
          hideIfZero
        />
      ),
    },
    {
      title: "simulated supply",
      bigValue: (
        <Value value={result.simulation_dai_supply} decimals={2} prefix="$" compact />
      ),
      smallValue: (
        <ValueChange
          value={result.simulation_dai_supply - stats.total_supply}
          decimals={1}
          prefix="$"
          compact
          icon
          hideIfZero
        />
      ),
    },
    {
      title: "simulated utilization",
      bigValue: (
        <Value
          value={result.simulation_utilization_rate * 100}
          decimals={2}
          suffix="%"
        />
      ),
      smallValue: (
        <ValueChange
          value={(result.simulation_utilization_rate - stats.utilization) * 100}
          decimals={2}
          suffix="%"
          icon
          hideIfZero
        />
      ),
    },
  ];

  const statsOther = [
    {
      title: "profit",
      bigValue: <Value value={result.d3m_revenue} decimals={2} prefix="$" compact />,
      smallValue: (
        <ValueChange
          value={result.d3m_revenue - stats.balance * stats.supply_rate}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
        />
      ),
    },
    {
      title: "real supply",
      bigValue: (
        <Value
          value={result.d3m_exposure + stats.real_supply}
          decimals={2}
          prefix="$"
          compact
        />
      ),
      smallValue: (
        <ValueChange
          value={result.d3m_exposure}
          decimals={2}
          prefix="$"
          compact
          icon
          hideIfZero
        />
      ),
    },
    {
      title: "exposure / real supply",
      normalValue: (
        <div className="text-center mt-2">
          <Progress
            animated
            value={(result.d3m_exposure_total / stats.real_supply) * 100}
          />
          <Value
            value={(result.d3m_exposure_total / stats.real_supply) * 100}
            decimals={2}
            suffix="%"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="d-flex align-items-center mb-4">
        <CryptoIcon name={protocolName} size="3rem" className="me-2" />
        <h1 className="h3 m-0">{title} D3M revenue calculator</h1>
      </div>
      <LoadingOverlay active={isPreviousData} spinner>
        {protocol === "compound" ? descComp : descAave}
        <Row>
          <Col xl={12} className="mb-4">
            <StatsBar stats={statsCurrent} />
          </Col>
        </Row>
        <Row>
          <Col xl={6}>
            <FormGroup row>
              <Label xl={4} for="debt_ceiling">
                Debt Ceiling <InfoIcon id={"tooltipDebtCeiling"} />
                <UncontrolledTooltip placement="bottom" target={"tooltipDebtCeiling"}>
                  Maximum D3M Exposure through supplied DAI into the protocols DAI
                  Market
                </UncontrolledTooltip>
              </Label>
              <Col xl={4}>
                <Input
                  name="debt_ceiling"
                  id="debt_ceiling"
                  value={formatter.format(debtCeiling)}
                  onChange={(event) => onSetDebtCeiling(event.target.value)}
                ></Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label xl={4} for="target_borrow_rate">
                Target borrow rate <InfoIcon id={"tooltipTargetBorrowRate"} />
                <UncontrolledTooltip
                  placement="bottom"
                  target={"tooltipTargetBorrowRate"}
                >
                  The chosen level at which D3M either deposits DAI (Target Borrow Rate
                  &gt;= current Borrow Rate) or withdraws DAI (if D3M Debt Exposure &gt;
                  0 and Target Borrow Rate &lt; current Borrow Rate)
                </UncontrolledTooltip>
              </Label>
              <Col xl={4} className="d-flex align-items-center">
                <Input
                  type="number"
                  name="target_borrow_rate"
                  id="target_borrow_rate"
                  step={0.5}
                  min={2}
                  max={10}
                  value={targetBorrowRate}
                  className="me-2"
                  onChange={(event) => onSetTargetBorrowRate(event.target.value)}
                ></Input>
                %
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xl={4} className="text-center">
            <Button color="primary" className="mb-4" onClick={onApply}>
              Apply
            </Button>
          </Col>
        </Row>

        <Row>
          <Col xl={12} className="mb-4">
            <StatsBar stats={statsSimulated} />
          </Col>
          <Col xl={12} className="mb-4">
            <StatsBar stats={statsOther} />
          </Col>
        </Row>
      </LoadingOverlay>

      <Modal isOpen={curveModalOpen} toggle={toggleCurveModalOpen}>
        <ModalHeader toggle={toggleCurveModalOpen}>DAI Interest Rate Curve</ModalHeader>
        <ModalBody>
          <DaiBorrowCurveGraph protocol={protocol} />
        </ModalBody>
      </Modal>
    </>
  );
}

export default withErrorBoundary(RevenueD3M);
