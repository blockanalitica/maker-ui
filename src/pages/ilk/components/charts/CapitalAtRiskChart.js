// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Graph from "../../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { tooltipLabelNumber } from "../../../../utils/graph.js";
import { compact } from "../../../../utils/number.js";

function CapitalAtRiskChart(props) {
  const { data } = props;

  const { results } = data;

  const capitalAtRisk = [];
  const avg7 = [];
  const avg30 = [];
  results.forEach((row) => {
    capitalAtRisk.push({
      x: row.datetime,
      y: row.capital_at_risk,
    });
    avg7.push({
      x: row.datetime,
      y: row.capital_at_risk_7d_avg,
    });
    avg30.push({
      x: row.datetime,
      y: row.capital_at_risk_30d_avg,
    });
  });

  const series = [
    {
      label: "capital at risk",
      data: capitalAtRisk,
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
          callback: (value) => "$" + compact(value, 2, true),
        },

        title: {
          display: true,
          text: "capital at risk",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, "$");
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

export default withErrorBoundary(CapitalAtRiskChart);
