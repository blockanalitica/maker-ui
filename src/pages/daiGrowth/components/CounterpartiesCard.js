// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import Card from "../../../components/Card/Card.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function CounterpartiesCard(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModalOpen = () => setModalOpen(!modalOpen);
  const { data } = props;
  if (!data) {
    return null;
  }

  const grouped = _.groupBy(data, "counterparty");
  const series = [];
  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key,
      data: rows.map((row) => ({
        x: row["report_date"],
        y: row["debt_exposure"],
      })),
    });
  });

  const options = {
    interaction: {
      mode: "x",
    },
    scales: {
      x: {
        stacked: true,
        type: "time",
        time: {
          unit: "month",
        },
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => compact(value, 2, true),
        },
        title: {
          display: true,
          text: "debt exposure",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return tooltipTitleDateTime(tooltipItems, true, false, "LLL yyyy");
          },
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem);
          },
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce(
              (total, tooltip) => total + tooltip.parsed.y,
              0
            );
            return "Total: " + compact(total, 2, true);
          },
        },
      },
    },
  };

  return (
    <>
      <Card title="Counterparty Debt Exposure per Source">
        <p className="mb-4">
          Aggregation of debt exposure across different counterparties that have some
          kind of control over Maker’s portfolio collateral assets.{" "}
          <span role="button" className="link-primary" onClick={toggleModalOpen}>
            List of Counterparties
          </span>
        </p>
        <Graph series={series} type="bar" options={options} />
      </Card>
      <Modal isOpen={modalOpen} toggle={toggleModalOpen}>
        <ModalHeader toggle={toggleModalOpen}>List of Counterparties</ModalHeader>
        <ModalBody>
          BitGo: WBTC
          <br />
          Circle: USDC
          <br />
          Gemini: GUSD
          <br />
          Paxos: USDP
          <br />
          Ren: RENBTC
          <br />
          Tether: USDT
          <br />
          TrustToken: TUSD
          <br />
          Gemini and Circle: GUNIV3DAIUSDC1-A
        </ModalBody>
      </Modal>
    </>
  );
}

CounterpartiesCard.propTypes = {
  data: PropTypes.array.isRequired,
};

export default withErrorBoundary(CounterpartiesCard);
