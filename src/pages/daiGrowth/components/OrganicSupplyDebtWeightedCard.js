// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import PropTypes from "prop-types";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import Card from "../../../components/Card/Card.js";
import { tooltipLabelNumber } from "../../../utils/graph.js";

function OrganicSupplyDebtWeightedCard(props) {
  const { data } = props;
  if (!data) {
    return null;
  }
  const series = [
    {
      label: data["key"],
      data: data.map((row) => ({
        x: row["key"],
        y: row["value"],
      })),
    },
  ];

  const options = {
    interaction: {
      mode: "x",
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "time period",
        },
      },
      y: {
        ticks: {
          callback: (value) => value + "%",
        },
        title: {
          display: true,
          text: "portfolio organic debt demand growth",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, null, "%");
          },
        },
      },
    },
  };

  return (
    <Card title="Portfolio Organic Debt Demand">
      <p className="mb-4">
        Portfolio organic debt demand growth in the last 7/30/90 days. Organic debt
        demand is computed by normalizing DAI supply change with collateral price
        change. Portfolio metric is a weighted-average of all collateral assets with at
        least 1M of outstanding DAI at the beginning of the chosen period.{" "}
      </p>
      <Graph series={series} type="bar" options={options} />
    </Card>
  );
}

OrganicSupplyDebtWeightedCard.propTypes = {
  data: PropTypes.array.isRequired,
};

export default withErrorBoundary(OrganicSupplyDebtWeightedCard);
