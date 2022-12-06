// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import React, { useState } from "react";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";
import { parseUTCDateTimestamp } from "../../../utils/datetime.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";

function DebtChart(props) {
  const { address, showAllVaults } = props;
  const [daysAgo, setDaysAgo] = useState(90);
  const timeOptions = [
    { key: 7, value: "7 day" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
    { key: 180, value: "180 days" },
    { key: 0, value: "all" },
  ];

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/wallets/${address}/debt-history/`,
    { all_vaults: showAllVaults }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  if (!data) {
    return null;
  }

  let grouped;
  grouped = _.groupBy(data, "vault_uid");
  const series = [];

  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: (rows.length > 0 ? rows[0]["ilk"] : "") + " " + key,
      stepped: true,
      data: rows.map((row) => ({
        x: parseUTCDateTimestamp(row["timestamp"]),
        y: row["after_principal"],
      })),
    });
  });

  let startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);
  if (daysAgo === 0) {
    startDate = null;
  }

  const options = {
    fill: true,
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        min: startDate,
        type: "time",
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },
        title: {
          display: true,
          text: "debt",
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

  return (
    <>
      <h3 className="my-4">debt history</h3>
      <div className="d-flex align-items-center justify-content-end">
        <span className="gray">Period:</span>{" "}
        <TimeSwitch
          activeOption={daysAgo}
          onChange={setDaysAgo}
          options={timeOptions}
        />
      </div>
      <Graph series={series} options={options} />
    </>
  );
}

export default withErrorBoundary(DebtChart);
