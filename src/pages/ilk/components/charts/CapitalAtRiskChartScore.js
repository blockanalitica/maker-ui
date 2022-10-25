// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Graph from "../../../../components/Graph/Graph.js";
import Loader from "../../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch } from "../../../../hooks";
import { tooltipLabelNumber } from "../../../../utils/graph.js";
import { compact } from "../../../../utils/number.js";

function CapitalAtRiskChartScore(props) {
  const { ilk, daysAgo } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/ilks/${ilk}/capital-at-risk/chart/`,
    { days_ago: daysAgo, type: "protection_score" }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { results } = data;

  const high = [];
  const medium = [];
  const low = [];
  results.forEach((row) => {
    high.push({
      x: row.datetime,
      y: row.high_risk_debt,
    });
    medium.push({
      x: row.datetime,
      y: row.medium_risk_debt,
    });
    low.push({
      x: row.datetime,
      y: row.low_risk_debt,
    });
  });

  const series = [
    {
      label: "high risk",
      protection_score: "high",
      data: high,
    },
    {
      label: "medium risk",
      protection_score: "medium",
      data: medium,
    },
    {
      label: "low risk",
      protection_score: "low",
      data: low,
    },
  ];

  const options = {
    aspectRatio: 4,
    fill: true,
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
        stacked: true,
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },

        title: {
          display: true,
          text: "risky debt",
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

export default withErrorBoundary(CapitalAtRiskChartScore);
