// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import React from "react";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { compact } from "../../../utils/number.js";
import { tooltipTitleDateTime } from "../../../utils/graph.js";

function PastHoursCard(props) {
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/dai-trades/last-hours/"
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  if (data.length === 0) {
    return null;
  }

  const series = [];
  const grouped = _.groupBy(data, "exchange");
  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key,
      data: rows.map((row) => ({
        x: row["datetime"],
        y: row["dai_price"],
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
            return tooltipTitleDateTime(tooltipItems, false, true);
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
      <h2 className="mb-4">DAI price over the last 2 hours</h2>
      <Graph series={series} type="scatter" options={options} />
    </>
  );
}

export default withErrorBoundary(PastHoursCard);
