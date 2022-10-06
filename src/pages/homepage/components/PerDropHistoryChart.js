// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import _ from "lodash";
import LoadingOverlay from "react-loading-overlay";
import { withErrorBoundary } from "../../../hoc.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";
import Loader from "../../../components/Loader/Loader.js";
import { useFetch } from "../../../hooks";
import Graph from "../../../components/Graph/Graph.js";

function PerDropHistoryChart(props) {
  const { timePeriod } = props;
  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "/risk/per-drop/",
    { days_ago: timePeriod },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const grouped = _.groupBy(data, "drop");
  const series = [];

  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: "-" + key + "%",
      data: rows.map((row) => ({
        x: row["datetime"],
        y: row["amount"],
      })),
    });
  });

  const options = {
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        type: "time",
      },
      y: {
        stacked: false,
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return tooltipTitleDateTime(tooltipItems);
          },
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, "$");
          },
        },
      },
    },
  };

  return (
    <>
      <LoadingOverlay active={isPreviousData} spinner>
        <Graph series={series} options={options} />
      </LoadingOverlay>
    </>
  );
}

export default withErrorBoundary(PerDropHistoryChart);
