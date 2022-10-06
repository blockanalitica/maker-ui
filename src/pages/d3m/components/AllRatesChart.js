// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber } from "../../../utils/graph.js";

function AllRatesChart(props) {
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(`/d3ms/rates/`);

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const { results } = data;
  let grouped;
  grouped = _.groupBy(results, "protocol");

  const series = [];
  Object.entries(grouped).forEach(([key, rows]) => {
    let item = {
      label: key,
      data: rows.map((row) => ({
        x: row["dt"],
        y: (row["borrow_rate"] - row["eth_supply_rate"] * 2) * 100,
      })),
    };
    series.push(item);
  });

  const options = {
    aspectRatio: 2.8,
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

export default withErrorBoundary(AllRatesChart);
