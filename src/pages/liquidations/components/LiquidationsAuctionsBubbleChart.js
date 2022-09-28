import React from "react";

import Graph from "../../../components/Graph/Graph.js";

import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { compact } from "../../../utils/number.js";
import Loader from "../../../components/Loader/Loader.js";

function LiquidationsAuctionsBubbleChart(props) {
  const { ilk, date } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/liquidations/per-date/${date}/${ilk}/`,
    { p: 1, p_size: 10000 },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { results } = data;

  const OSMData = [];
  const mktData = [];
  results.forEach((row) => {
    OSMData.push({
      x: row.duration,
      y: row.osm_settled_avg,
      r: Math.min(row.debt_liquidated / 50000, 25),
      label: row.uid,
    });
    mktData.push({
      x: row.duration,
      y: row.mkt_settled_avg,
      r: Math.min(row.debt_liquidated / 50000, 25),
      label: row.uid,
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

export default withErrorBoundary(LiquidationsAuctionsBubbleChart);
