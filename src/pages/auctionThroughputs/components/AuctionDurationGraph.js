// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import { tooltipLabelNumber } from "../../../utils/graph.js";

function AuctionDurationGraph(props) {
  const { data } = props;
  if (!data) {
    return null;
  }
  const grouped = _.groupBy(data, "ilk");
  const series = [];
  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key,
      data: rows.map((row) => ({
        x: row["ilk"],
        y: row["auction_dur_m"],
      })),
    });
  });

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
          callback: (value) => value + "min",
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
            return tooltipLabelNumber(tooltipItem, null, "min");
          },
        },
      },
    },
  };

  return (
    <>
      <Graph series={series} type="bar" options={options} />
    </>
  );
}

export default withErrorBoundary(AuctionDurationGraph);
