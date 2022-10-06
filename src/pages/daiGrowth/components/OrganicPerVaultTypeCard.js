// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import Card from "../../../components/Card/Card.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function OrganicPerVaultTypeCard(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModalOpen = () => setModalOpen(!modalOpen);
  const { data } = props;
  if (!data) {
    return null;
  }

  const grouped = _.groupBy(data, "ilk");
  const series = [];
  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key,
      data: rows.map((row) => ({
        x: row["report_date"],
        y: row["dai_supply_organic_demand_growth_perc"],
      })),
    });
  });

  const options = {
    interaction: {
      mode: "nearest",
      axis: "x",
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
        },
      },
      y: {
        ticks: {
          callback: (value) => compact(value, 2, true) + "%",
        },
        title: {
          display: true,
          text: "organic debt demand growth %",
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
            return tooltipLabelNumber(tooltipItem, null, "%");
          },
        },
      },
    },
  };

  return (
    <>
      <Card title="Organic Debt Demand per Vault Type over Time">
        <p className="mb-4">
          Organic debt demand is calculated by normalizing DAI supply change with
          collateral price change.{" "}
          <span role="button" className="link-primary" onClick={toggleModalOpen}>
            Formula Detail
          </span>
        </p>
        <Graph series={series} options={options} />
      </Card>

      <Modal isOpen={modalOpen} toggle={toggleModalOpen}>
        <ModalHeader toggle={toggleModalOpen}>Formulas</ModalHeader>
        <ModalBody>
          <p>
            Organic Debt Demand Growth = DAI Supply Multiplier / Colateral Price
            Multiplier
          </p>

          <p>
            DAI Supply Multiplier = (DAI Supply on the last day of month <i> t </i>) /
            (DAI Supply on last day of month <i> t - 1</i>)
          </p>
          <p>
            Collateral Price Multiplier = (Last OSM collateral price of month <i> t </i>
            ) / (First OSM collateral price of month <i> t </i>)
          </p>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withErrorBoundary(OrganicPerVaultTypeCard);
