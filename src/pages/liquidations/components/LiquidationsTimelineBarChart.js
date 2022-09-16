import _ from "lodash";
import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import { parseUTCDateTime } from "../../../utils/datetime.js";
import {
  tooltipFooterTotal,
  tooltipLabelNumber,
  tooltipTitleDateTime,
} from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function LiquidationsTimelineBarChart(props) {
  const { results, daysAgo } = props;

  const grouped = _.groupBy(results, "ilk");
  const series = [];
  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key,
      data: rows.map((row) => ({
        x: parseUTCDateTime(row["date"]).startOf("day").toMillis(),
        y: row["total_collateral_seized_usd"],
      })),
    });
  });

  let xUnit = "day";
  if (daysAgo > 180) {
    xUnit = "month";
  } else if (daysAgo > 30) {
    xUnit = "week";
  }

  let startDate = new Date();
  let endDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);
  endDate.setDate(endDate.getDate());

  const options = {
    aspectRatio: 1.5,
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        min: startDate,
        max: endDate,
        type: "time",
        time: {
          unit: xUnit,
          displayFormats: {
            week: "W yyyy",
          },
        },
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            let format = "LLL yyyy";
            let prefix = "";
            if (xUnit === "week") {
              prefix = "Week starting on ";
              format = null;
            }
            return prefix + tooltipTitleDateTime(tooltipItems, true, false, format);
          },
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, "$");
          },
          footer: (tooltipItems) => {
            return tooltipFooterTotal(tooltipItems, "Total: $");
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

export default withErrorBoundary(LiquidationsTimelineBarChart);
