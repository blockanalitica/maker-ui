// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import PropTypes from "prop-types";
import { tooltipLabelNumber } from "../../../utils/graph.js";

function PerVaultTypePeriodicalGraph(props) {
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
      y: {
        ticks: {
          callback: (value) => value + "%",
        },
        title: {
          display: true,
          text: "organic demand growth percentage",
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

  return <Graph series={series} type="bar" options={options} />;
}
PerVaultTypePeriodicalGraph.propTypes = {
  data: PropTypes.array.isRequired,
};
export default withErrorBoundary(PerVaultTypePeriodicalGraph);
