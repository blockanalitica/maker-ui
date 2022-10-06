// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Graph from "../../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { tooltipLabelNumber } from "../../../../utils/graph.js";
import { compact } from "../../../../utils/number.js";

function CR(props) {
  const { data } = props;

  const { results } = data;
  const series = [
    {
      data: results.map((row) => ({
        x: row["datetime"],
        y: row["collateralization_ratio"],
      })),
    },
  ];
  const options = {
    aspectRatio: 4,
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
      },
      y: {
        ticks: {
          callback: (value) => compact(value, 2, true) + "%",
        },

        title: {
          display: true,
          text: "collateralization ratio",
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
    <>
      <Graph series={series} options={options} />
    </>
  );
}

export default withErrorBoundary(CR);
