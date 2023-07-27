// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import React, { useState } from "react";
import { withErrorBoundary } from "../../../hoc.js";
import Loader from "../../../components/Loader/Loader.js";
import { compact } from "../../../utils/number.js";
import Graph from "../../../components/Graph/Graph.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber, tooltipFooterTotal } from "../../../utils/graph.js";
import { Row } from "reactstrap";
function ETHShareHistoric(props) {
  const [timePeriod, setTimePeriod] = useState(30);
  const timeOptions = [
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
    { key: 180, value: "180 days" },
    { key: 1000, value: "all" },
  ];

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/defi/eth-market-share-historic/",
    {
      days_ago: timePeriod,
    }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const { results } = data;
  const grouped = _.groupBy(results, "protocol");
  const series = [];

  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      protocol: key,
      label: key,
      data: rows.map((row) => ({
        x: row["dt"],
        y: row["balance"],
      })),
    });
  });

  const options = {
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
          callback: (value) => compact(value, 2, true),
        },
      },
    },
    plugins: {
      tooltip: {
        filter: (tooltipItem) => {
          return tooltipItem.parsed.y !== 0 && tooltipItem.parsed.y !== null;
        },
        callbacks: {
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, "", " ETH");
          },
          footer: (tooltipItems) => {
            const currentItem = tooltipItems[0];

            if (
              !currentItem ||
              (currentItem.parsed.y === 0 && currentItem.parsed.y === null)
            ) {
              return null;
            }

            return tooltipFooterTotal(tooltipItems, "Total: ", " ETH");
          },
        },
      },
    },
  };
  return (
    <div>
      <div className="mb-4 flex-grow-1 d-flex align-items-center">
        <h1 className="h3 m-0">ETH captured historic</h1>
      </div>

      <Row className="mb-4">
        <TimeSwitch
          activeOption={timePeriod}
          label={""}
          onChange={setTimePeriod}
          options={timeOptions}
        />
        <Graph series={series} options={options} type="bar" />
      </Row>
    </div>
  );
}

export default withErrorBoundary(ETHShareHistoric);
