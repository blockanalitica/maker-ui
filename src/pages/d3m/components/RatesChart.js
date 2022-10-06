// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import { React, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import TimeSwitch from "../../../components/TimeSwitch/TimeSwitch.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { tooltipLabelNumber } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function RatesChart(props) {
  const { protocol } = useParams();
  const [daysAgo, setDaysAgo] = useState(30);
  const timeOptions = [
    { key: 7, value: "7 days" },
    { key: 30, value: "30 days" },
    { key: 90, value: "90 days" },
  ];

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `/d3ms/${protocol}/rates/`,
    { days_ago: daysAgo },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { aave_borrow_rates, target_borrow_rates } = data;

  const series = [];
  series.push({
    label: "aave borrow rate",
    data: aave_borrow_rates.map((row) => ({
      x: row["datetime"],
      y: row["variable_borrow_rate"] * 100,
    })),
  });
  series.push({
    label: "target borrow rate",
    data: target_borrow_rates.map((row) => ({
      x: row["dt"],
      y: row["target_borrow_rate"] * 100,
    })),
  });
  const options = {
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
        ticks: {
          callback: (value) => compact(value, 2, true),
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, "$");
          },
        },
      },
    },
  };

  return (
    <>
      <div className="d-flex mb-4align-items-center mb-4">
        <div className="flex-grow-1">
          <h4 className="m-0">historic DAI borrow rate</h4>
        </div>
        <TimeSwitch
          className="justify-content-end"
          activeOption={daysAgo}
          onChange={setDaysAgo}
          options={timeOptions}
        />
      </div>
      <LoadingOverlay active={isPreviousData} spinner>
        <Graph series={series} options={options} />
      </LoadingOverlay>
    </>
  );
}

export default withErrorBoundary(RatesChart);
