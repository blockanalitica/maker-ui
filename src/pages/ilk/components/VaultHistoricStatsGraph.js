// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import { tooltipLabelNumber } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function VaultHistoricStatsGraph(props) {
  const { data, statType } = props;
  if (!data) {
    return null;
  }

  const { results } = data;

  let preffix = "";
  let suffix = "";

  if (statType === "total_debt") {
    preffix = "$";
  } else if (statType === "vaults_count") {
    preffix = "#";
  } else if (statType === "weighted_collateralization_ratio") {
    suffix = "%";
  }

  const series = [
    {
      data: results.map((row) => ({
        x: row["datetime"],
        y: row["value"],
      })),
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
          callback: (value) => preffix + compact(value, 2, true) + suffix,
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
            return tooltipLabelNumber(tooltipItem, preffix, suffix);
          },
        },
      },
    },
  };

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(VaultHistoricStatsGraph);
