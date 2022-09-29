import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function UniqueKeepersTakers(props) {
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/liquidations/keepers-takers/"
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const keepers = [];
  const takers = [];
  data.forEach((row) => {
    keepers.push({
      x: row.date,
      y: row.unique_keepers,
    });
    takers.push({
      x: row.date,
      y: row.unique_takers,
    });
  });

  const series = [
    {
      label: "unique keepers",
      data: keepers,
    },
    {
      label: "unique takers",
      data: takers,
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
            return tooltipLabelNumber(tooltipItem);
          },
        },
      },
    },
  };

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(UniqueKeepersTakers);
