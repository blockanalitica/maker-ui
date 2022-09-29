import React from "react";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { compact } from "../../../utils/number.js";
import { tooltipTitleDateTime } from "../../../utils/graph.js";

function DailyCard(props) {
  const { data, isLoading, isError, ErrorFallbackComponent } =
    useFetch("/dai-trades/daily/");

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  if (data.length === 0) {
    return null;
  }
  const avgData = [];
  const minData = [];
  const maxData = [];
  data.forEach((row) => {
    avgData.push({
      x: row.dt,
      y: row.price_avg,
    });
    minData.push({
      x: row.dt,
      y: row.price_min,
    });
    maxData.push({
      x: row.dt,
      y: row.price_max,
    });
  });

  const series = [
    {
      label: "avg",
      data: avgData,
    },
    {
      label: "min",
      data: minData,
    },
    {
      label: "max",
      data: maxData,
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
        title: {
          display: true,
          text: "USD price",
        },
        ticks: {
          callback: (value) => "$" + compact(value, 6, true),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return tooltipTitleDateTime(tooltipItems, true, false);
          },
          label: (tooltipItem) => {
            let label = tooltipItem.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (tooltipItem.parsed.y !== null) {
              label += "$" + compact(tooltipItem.parsed.y, 6, true);
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <>
      <h2 className="mb-4">daily data for last 90d</h2>
      <Graph series={series} type="scatter" options={options} />
    </>
  );
}

export default withErrorBoundary(DailyCard);
