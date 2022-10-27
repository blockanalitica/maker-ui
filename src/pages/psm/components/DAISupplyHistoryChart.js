// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import LoadingOverlay from "react-loading-overlay";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function DAISupplyHistoryChart(props) {
  const { ilk, timePeriod, ...rest } = props;
  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `/psms/${ilk}/dai-supply-history/`,
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

  const series = [
    {
      label: "DAI Supply",
      data: data.map((row) => ({
        x: row["datetime"],
        y: row["total_supply"],
      })),
    },
  ];

  const options = {
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        type: "time",
      },
      y: {
        title: {
          display: true,
          text: "total DAI supply",
        },
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return tooltipTitleDateTime(tooltipItems);
          },
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, "$", null);
          },
        },
      },
    },
  };

  return (
    <div {...rest}>
      <LoadingOverlay active={isPreviousData} spinner>
        <Graph series={series} options={options} />
      </LoadingOverlay>
    </div>
  );
}

export default withErrorBoundary(DAISupplyHistoryChart);
