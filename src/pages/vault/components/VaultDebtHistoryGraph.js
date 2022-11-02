// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { parseUTCDateTimestamp } from "../../../utils/datetime.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function VaultDebtHistoryGraph(props) {
  const { uid, ilk } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/ilks/${ilk}/vaults/${uid}/debt-history/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  let debts;
  let events;
  // TODO: Remove this if statement. Endpoint will only be returning {results, events}
  // from 2022-10-02 onwards.
  if (data instanceof Array) {
    debts = data;
  } else {
    debts = data.debts;
    events = data.events;
  }

  const series = [
    {
      label: "debt",
      stepped: true,
      data: debts.map((row) => ({
        x: parseUTCDateTimestamp(row["timestamp"]),
        y: row["after_principal"],
      })),
    },
    {
      label: "events",
      backgroundColor: "#775DD0",
      borderColor: "#775DD0",
      yAxisID: "y2",
      type: "scatter",
      radius: 5,
      data: events.map((row) => ({
        x: parseUTCDateTimestamp(row["timestamp"]),
        y: 0,
        name: row["human_operation"],
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
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },
      },
      y2: {
        position: "left",
        display: false,
        min: -0.02,
        max: 1,
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
            let label;
            if (tooltipItem["dataset"]["label"] === "events") {
              label = "event: " + tooltipItem.raw.name;
            } else {
              label = tooltipLabelNumber(tooltipItem, "$", null);
            }
            return label;
          },
        },
      },
    },
  };

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(VaultDebtHistoryGraph);
