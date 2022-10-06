// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Card from "../../../components/Card/Card.js";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import { tooltipLabelNumber } from "../../../utils/graph.js";

function StairstepGraph(props) {
  const { data, tail, buf, cusp, cycle } = props;

  const series = [
    {
      data: data.map((row) => ({
        x: row["minute"],
        y: row["amount"],
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
          callback: (value) => `′${value}`,
        },
        title: {
          display: true,
          text: "minutes",
        },
      },
      y: {
        title: {
          display: true,
          text: "stairstep",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return `At minute ${tooltipItems[0].parsed.x}:`;
          },

          label: (tooltipItems) => {
            return tooltipLabelNumber(tooltipItems);
          },
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: "line",
            yMin: cusp * buf * 100,
            yMax: cusp * buf * 100,
            borderColor: "#d61146",
            borderWidth: 2,
            borderDash: [10],
          },
          line2: {
            type: "line",
            xMin: tail / 60,
            xMax: tail / 60,
            borderColor: "#fcf760",
            borderWidth: 2,
            borderDash: [10],
          },
          line3: {
            type: "line",
            xMin: cycle,
            xMax: cycle,
            borderColor: "#25db2b",
            borderWidth: 2,
            borderDash: [10],
          },
        },
      },
    },
  };

  return (
    <Card>
      <Graph series={series} options={options} />
    </Card>
  );
}

export default withErrorBoundary(StairstepGraph);
