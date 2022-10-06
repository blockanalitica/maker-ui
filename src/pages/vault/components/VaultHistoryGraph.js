// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import React, { useState } from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { parseUTCDateTimestamp } from "../../../utils/datetime.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function VaultHistoryGraph(props) {
  const { uid, ilk } = props;
  const [daysAgo, setDaysAgo] = useState(30);

  const timeOptions = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
  ];

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/ilks/${ilk}/vaults/${uid}/cr/`,
    { days_ago: daysAgo },
    { keepPreviousData: false }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const palette = {
    liquidation_ratio: "#FF4560",
    osm_price: "#1e4620",
    collateralization: "#03A9F4",
  };

  const graphLabels = {
    liquidation_ratio: "Liquidation Ratio",
    osm_price: "OSM Price",
    collateralization: "Collateralization",
  };

  const grouped = _.groupBy(data, "key");
  const series = [];

  Object.entries(grouped).forEach(([key, rows]) => {
    let item = {
      label: graphLabels[key],
      backgroundColor: palette[key],
      borderColor: palette[key],
      data: rows.map((row) => ({
        x: parseUTCDateTimestamp(row["timestamp"]),
        y: row["amount"],
      })),
    };
    if (key === "osm_price") {
      item["yAxisID"] = "y";
    } else {
      item["yAxisID"] = "y1";
    }
    series.push(item);
  });

  const options = {
    fill: false,
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
        stacked: false,
        position: "right",
        title: {
          display: true,
          text: "OSM price",
        },
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },
      },
      y1: {
        position: "left",
        title: {
          display: true,
          text: "collateralization",
        },
        ticks: {
          callback: (value) => value + "%",
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
            let label;
            if (tooltipItem["dataset"]["label"] === "osm_price") {
              label = tooltipLabelNumber(tooltipItem, "$", null);
            } else {
              label = tooltipLabelNumber(tooltipItem, null, "%");
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <>
      <TimeSwitch
        className="mb-3 justify-content-end"
        label="Showing last:"
        activeOption={daysAgo}
        onChange={setDaysAgo}
        options={timeOptions}
      />
      <Graph series={series} options={options} />
    </>
  );
}

export default withErrorBoundary(VaultHistoryGraph);
