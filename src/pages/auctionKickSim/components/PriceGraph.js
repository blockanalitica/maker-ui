// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import PropTypes from "prop-types";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import { parseUTCDateTimestamp } from "../../../utils/datetime.js";
import { compact } from "../../../utils/number.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";

function PriceGraph(props) {
  const { marketPrices, osms, asset } = props;
  let displayLegend = false;
  const series = [
    {
      label: asset,
      stack: "combined",
      type: "line",
      data: marketPrices.map((row) => ({
        //TODO: potential datetime parse should be here?
        x: row["datetime"],
        y: row["price"],
      })),
    },
  ];

  if (osms && osms.length > 0) {
    displayLegend = true;
    series.push({
      label: "OSM",
      radius: 3,
      type: "scatter",
      data: osms.map((osm) => ({
        //TODO: potential datetime parse should be here?
        x: parseUTCDateTimestamp(osm.timestamp),
        y: osm.current_price,
      })),
    });
  }

  const options = {
    interaction: {
      axis: "xy",
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
        },
      },
      y: {
        ticks: {
          reverse: true,
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
      legend: {
        display: displayLegend,
      },
    },
  };

  return (
    <>
      <h3 className="mb-4">Market Low Minute Price Throughout the Day</h3>
      <Graph series={series} options={options} />
    </>
  );
}

PriceGraph.propTypes = {
  marketPrices: PropTypes.array.isRequired,
  asset: PropTypes.string.isRequired,
  osms: PropTypes.array,
};

export default withErrorBoundary(PriceGraph);
