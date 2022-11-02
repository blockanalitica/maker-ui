// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Graph, {
  ASSETS_PALETTE,
  DEFAULT_PALETTE,
} from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import {
  barGraphSeriesCountLimiter,
  tooltipLabelNumber,
} from "../../../utils/graph.js";

import { compact } from "../../../utils/number.js";

function LiquidatedAssetChart(props) {
  const { daysAgo } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/liquidations/assets/",
    { days_ago: daysAgo },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const results = data;

  let { series } = barGraphSeriesCountLimiter(
    results,
    "collateral_symbol",
    "collateral_seized_usd",
    5,
    true
  );

  series = [
    {
      ...series[0],
      backgroundColor: series[0].data.map(
        (sData) => ASSETS_PALETTE[sData.x] || DEFAULT_PALETTE[0]
      ),
    },
  ];

  const options = {
    interaction: {
      mode: "x",
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
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
            return tooltipLabelNumber(tooltipItem, "$");
          },
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce(
              (total, tooltip) => total + tooltip.parsed.y,
              0
            );
            return "Total: $" + compact(total, 2, true);
          },
        },
      },
    },
  };

  return (
    <>
      <h3>liquidated collateral</h3>
      <Graph series={series} type="bar" options={options} />
    </>
  );
}

export default withErrorBoundary(LiquidatedAssetChart);
