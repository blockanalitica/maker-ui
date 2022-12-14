// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import _ from "lodash";
import LoadingOverlay from "react-loading-overlay";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function EventStatsChart(props) {
  const { ilk, timePeriod, ...rest } = props;
  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `/psms/${ilk}/event-stats/`,
    { days_ago: timePeriod },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  if (!data || (data && data.length === 0)) {
    return null;
  }

  const colorMap = {
    GENERATE: "#11613c",
    PAYBACK: "#7d161f",
  };

  let grouped;
  grouped = _.groupBy(data, "operation");
  const series = [];
  Object.entries(grouped).forEach(([key, rows]) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
    let item = {
      label: label,
      data: rows.map((row) => ({
        x: row["dt"],
        y: row["amount"],
      })),
      backgroundColor: colorMap[key],
      borderColor: colorMap[key],
    };
    series.push(item);
  });

  const options = {
    aspectRatio: 3,
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        stacked: true,
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
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return tooltipTitleDateTime(tooltipItems, true, false);
          },
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, "$");
          },
        },
      },
    },
  };

  return (
    <div {...rest}>
      <LoadingOverlay active={isPreviousData} spinner>
        <Graph series={series} options={options} type="bar" />
      </LoadingOverlay>
    </div>
  );
}

export default withErrorBoundary(EventStatsChart);
