// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Graph from "../../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { tooltipLabelNumber } from "../../../../utils/graph.js";
import { compact } from "../../../../utils/number.js";

function DebtCeilingHistoricChart(props) {
  const { data } = props;
  if (!data) {
    return null;
  }

  const { results } = data;

  const normal = [];
  const avg7 = [];
  const avg30 = [];
  const normalMean = [];
  results.forEach((row) => {
    normal.push({
      x: row.datetime,
      y: row.dc,
    });
    normalMean.push(row.dc);
    avg7.push({
      x: row.datetime,
      y: row.dc_7d,
    });
    avg30.push({
      x: row.datetime,
      y: row.dc_30d,
    });
  });

  const mean = normalMean.reduce((x, y) => x + y, 0) / normalMean.length;

  const series = [
    {
      label: "debt ceiling",
      type: "scatter",
      radius: 3,
      data: normal,
    },
    {
      label: "7d rolling avg",
      data: avg7,
    },
    {
      label: "30d rolling avg",
      data: avg30,
    },
  ];

  const options = {
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
          callback: (value) => "$" + compact(value, 2, true),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, "$", null);
          },
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: "line",
            yMin: mean,
            yMax: mean,
            borderColor: "#d61146",
            borderWidth: 2,
            borderDash: [10],
          },
        },
      },
    },
  };

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(DebtCeilingHistoricChart);
