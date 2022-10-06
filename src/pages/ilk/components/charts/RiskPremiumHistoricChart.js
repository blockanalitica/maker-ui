// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Graph from "../../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { tooltipLabelNumber } from "../../../../utils/graph.js";

function RiskPremiumHistoricChart(props) {
  const { data } = props;
  if (!data) {
    return null;
  }

  const { results } = data;

  const normal = [];
  const avg7 = [];
  const avg30 = [];
  results.forEach((row) => {
    normal.push({
      x: row.datetime,
      y: row.risk_premium,
    });
    avg7.push({
      x: row.datetime,
      y: row.risk_premium_7d_avg,
    });
    avg30.push({
      x: row.datetime,
      y: row.risk_premium_30d_avg,
    });
  });

  const series = [
    {
      label: "risk premium",
      data: normal,
      type: "scatter",
      radius: 3,
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
          callback: (value) => value + "%",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, null, "%");
          },
        },
      },
    },
  };

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(RiskPremiumHistoricChart);
