// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";

import Graph from "../../../components/Graph/Graph.js";

import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { compact } from "../../../utils/number.js";
import Loader from "../../../components/Loader/Loader.js";

function LiquidationsAuctionsSingleBubbleChart(props) {
  const { ilk, date } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/liquidations/actions/`,
    { date: date, ilk: ilk }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const OSMData = [];
  const mktData = [];
  data.forEach((row) => {
    OSMData.push({
      x: row.duration / 60,
      y: row.osm_settled,
      r: Math.min(row.recovered_debt / 50000, 25),
    });
    mktData.push({
      x: row.duration / 60,
      y: row.mkt_settled,
      r: Math.min(row.recovered_debt / 50000, 25),
    });
  });

  const series = [
    {
      label: "OSM settled price",
      data: OSMData,
    },
    {
      label: "market settled price",
      data: mktData,
    },
  ];

  const options = {
    aspectRatio: 2.5,
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        ticks: {
          callback: (value) => value + "min",
        },
      },
      y: {
        ticks: {
          callback: (value) => compact(value * 100, 2, true) + "%",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            let key = compact(tooltipItems[0].parsed.y * 100, 2, true);
            return "OSM settled @ " + key + "%";
          },
        },
      },
    },
  };

  return <Graph series={series} options={options} type="bubble" />;
}

export default withErrorBoundary(LiquidationsAuctionsSingleBubbleChart);
