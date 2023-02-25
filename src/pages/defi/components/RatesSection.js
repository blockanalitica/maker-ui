// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { Col, Row } from "reactstrap";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import Loader from "../../../components/Loader/Loader.js";
import SideTabNav from "../../../components/SideTab/SideTabNav.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import RatesChart from "./RatesChart.js";

function RatesSection(props) {
  const [type, setType] = useState("dai");
  const [timePeriod, setTimePeriod] = useState(30);

  const options = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
  ];

  let tabs = [
    { id: "dai", text: "DAI" },
    { id: "dai_w_rewards", text: "DAI w/ rewards" },
    { id: "usdc", text: "USDC" },
    { id: "usdc_w_rewards", text: "USDC w/ rewards" },
  ];

  let symbol = "DAI";
  if (type.includes("usdc")) {
    symbol = "USDC";
  }
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch("/rates/", {
    days_ago: timePeriod,
    symbol,
  });

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  let content = null;
  let smallText;

  if (type === "dai_w_rewards" || type === "usdc_w_rewards") {
    smallText =
      "Maker Equivalent Borrow Rate = (Borrow Rate - Borrow Reward Rate) - 2 * (ETH Supply Rate + ETH Supply Reward Rate)";
  } else {
    smallText = "Maker Equivalent Borrow Rate = (Borrow Rate ) - 2 * (ETH Supply Rate)";
  }

  content = <RatesChart timePeriod={timePeriod} type={type} data={data.results} />;
  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <div className="mb-2 flex-grow-1 d-flex align-items-center">
          <CryptoIcon name={data.collateral} size="3rem" className="me-2" />
          <h1 className="h3 m-0">Rate Market</h1>
        </div>
        <TimeSwitch
          activeOption={timePeriod}
          label={""}
          onChange={setTimePeriod}
          options={options}
        />
      </div>
      <Row className="mb-4">
        <Col md={2}>
          <SideTabNav activeTab={type} toggleTab={setType} tabs={tabs} />
        </Col>
        <Col md={10}>
          <Row className="mb-4">
            <Col className="mb-4" xl={12}>
              <p>
                To make a comparative analysis we use Maker equivalent borrow rate of
                depositing ETH and borrowing {symbol} (rate calculation methodology)
              </p>
              <small>{smallText}</small>
            </Col>
            <Col className="mt-4" xl={12}>
              {content}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col className="text-end" xl={12}>
          <BootstrapTable
            keyField="protocol"
            data={data.current}
            hover={false}
            bordered={false}
            columns={[
              {
                dataField: "",
                text: "asset",
                formatter: (cell, row) => (
                  <CryptoIcon name={symbol} size="3rem" className="me-2" />
                ),
              },
              {
                dataField: "protocol",
                text: "protocol",
                formatter: (cell, row) => (
                  <CryptoIcon name={cell} size="3rem" className="me-2" />
                ),
              },

              {
                dataField: "supply_rate",
                text: "supply rate",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell * 100} decimals={2} suffix="%" />
                    <br />
                    <ValueChange
                      className="pl-2"
                      value={(row.supply_rate - row.change.supply_rate) * 100}
                      tooltipValue={row.change.supply_rate * 100}
                      suffix="%"
                      decimals={2}
                      icon
                      hideIfZero
                    />
                  </>
                ),
              },
              {
                dataField: "supply_reward_rate",
                text: "supply reward",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell * 100} decimals={2} suffix="%" />
                    <br />
                    <ValueChange
                      className="pl-2"
                      value={
                        (row.supply_reward_rate - row.change.supply_reward_rate) * 100
                      }
                      tooltipValue={row.change.supply_reward_rate * 100}
                      suffix="%"
                      decimals={2}
                      icon
                      hideIfZero
                    />
                  </>
                ),
              },
              {
                dataField: "supply_net_rate",
                text: "supply net",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell * 100} decimals={2} suffix="%" />
                    <br />
                    <ValueChange
                      className="pl-2"
                      value={(row.supply_net_rate - row.change.supply_net_rate) * 100}
                      tooltipValue={row.change.supply_net_rate * 100}
                      suffix="%"
                      decimals={2}
                      icon
                      hideIfZero
                    />
                  </>
                ),
              },
              {
                dataField: "borrow_rate",
                text: "borrow rate",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell * 100} decimals={2} suffix="%" />
                    <br />
                    <ValueChange
                      className="pl-2"
                      value={(row.borrow_rate - row.change.borrow_rate) * 100}
                      tooltipValue={row.change.borrow_rate * 100}
                      suffix="%"
                      decimals={2}
                      icon
                      hideIfZero
                    />
                  </>
                ),
              },
              {
                dataField: "borrow_reward_rate",
                text: "borrow reward",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell * 100} decimals={2} suffix="%" />
                    <br />
                    <ValueChange
                      className="pl-2"
                      value={
                        (row.borrow_reward_rate - row.change.borrow_reward_rate) * 100
                      }
                      tooltipValue={row.change.borrow_reward_rate * 100}
                      suffix="%"
                      decimals={2}
                      icon
                      hideIfZero
                    />
                  </>
                ),
              },
              {
                dataField: "borrow_net_rate",
                text: "borrow net",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell * 100} decimals={2} suffix="%" />
                    <br />
                    <ValueChange
                      className="pl-2"
                      value={(row.borrow_net_rate - row.change.borrow_net_rate) * 100}
                      tooltipValue={row.change.borrow_net_rate * 100}
                      suffix="%"
                      decimals={2}
                      icon
                      hideIfZero
                    />
                  </>
                ),
              },
              {
                dataField: "eth_rate",
                text: "ETH supply rate",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell * 100} decimals={2} suffix="%" />
                    <br />
                    <ValueChange
                      className="pl-2"
                      value={(row.eth_rate - row.change.eth_rate) * 100}
                      tooltipValue={row.change.eth_rate * 100}
                      suffix="%"
                      decimals={2}
                      icon
                      hideIfZero
                    />
                  </>
                ),
              },
              {
                dataField: "real_rate",
                text: "equivalent rate",
                formatter: (cell, row) => (
                  <>
                    <Value value={cell * 100} decimals={2} suffix="%" />
                    <br />
                    <ValueChange
                      className="pl-2"
                      value={(row.real_rate - row.change.real_rate) * 100}
                      tooltipValue={row.change.real_rate * 100}
                      suffix="%"
                      decimals={2}
                      icon
                      hideIfZero
                    />
                  </>
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(RatesSection);
