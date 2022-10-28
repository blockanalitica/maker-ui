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
import { lightenDarkenColor } from "../../../utils/color.js";

function CombinedEventStatsChart(props) {
  const { ilk, timePeriod, ...rest } = props;
  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    "/psms/event-stats/",
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

  let generateColor = "#11613c";
  let paybackColor = "#7d161f";
  const grouped = _.groupBy(data, (item) => {
    return (
      item["operation"].charAt(0).toUpperCase() +
      item["operation"].slice(1).toLowerCase() +
      " " +
      item["ilk"]
    );
  });
  const series = [];
  Object.entries(grouped).forEach(([key, rows]) => {
    const isGenerate = key.includes("Generate");
    let item = {
      label: key,
      data: rows.map((row) => ({
        x: row["dt"],
        y: row["amount"],
      })),
      backgroundColor: isGenerate ? generateColor : paybackColor,
      borderColor: isGenerate ? generateColor : paybackColor,
    };
    series.push(item);

    if (isGenerate) {
      generateColor = lightenDarkenColor(generateColor, -10);
    } else {
      paybackColor = lightenDarkenColor(paybackColor, -10);
    }
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

export default withErrorBoundary(CombinedEventStatsChart);
