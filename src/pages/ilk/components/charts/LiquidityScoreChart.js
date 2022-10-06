// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Graph from "../../../../components/Graph/Graph.js";
import Loader from "../../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch } from "../../../../hooks";

function LiquidityScoreChart(props) {
  const { symbol } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/assets/${symbol}/liquidity-score/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const series = [
    {
      label: "liquidity score",
      data: data.map((row) => ({
        x: row["date"],
        y: row["score"],
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
        title: {
          display: true,
          text: "liquidity score",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(LiquidityScoreChart);
