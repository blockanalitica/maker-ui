import _ from "lodash";
import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function LiquidationsCurveGraph(props) {
  const { ilk, drop } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/maker/ilks/${ilk}/liquidation-curve/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const { results } = data;
  let grouped;
  grouped = _.groupBy(results, "protection_score");

  const series = [];
  Object.entries(grouped).forEach(([key, rows]) => {
    let item = {
      label: key + " risk",
      protection_score: key,
      data: rows.map((row) =>
        row.drop <= drop
          ? {
              x: row["expected_price"],
              y: row["total_debt"],
            }
          : true
      ),
    };
    series.push(item);
  });
  const options = {
    aspectRatio: 2.5,
    fill: true,
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        type: "linear",
        reverse: true,
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },
        title: {
          display: true,
          text: "price drop",
        },
      },
      y: {
        stacked: true,

        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },
        title: {
          display: true,
          text: "debt at risk",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return "At $" + compact(tooltipItems[0].parsed.x, 2, true) + " price";
          },
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

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(LiquidationsCurveGraph);
