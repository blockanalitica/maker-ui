// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function CapitalAtRiskTotalChart(props) {
  const { timePeriod } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/risk/capital-at-risk/",
    { days_ago: timePeriod }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { results } = data;

  const capitalAtRisk = [];
  const surplusBuffer = [];
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
    surplusBuffer.push({
      x: row.datetime,
      y: row.surplus_buffer,
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
    {
      label: "surplus buffer",
      data: surplusBuffer,
      borderDash: [5, 5],
      borderWidth: 2,
      hidden: true,
    },
  ];

  const options = {
    aspectRatio: 1.5,
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
          callback: (value) => compact(value, 2, true),
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

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(CapitalAtRiskTotalChart);
