// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import PropTypes from "prop-types";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import chroma from "chroma-js";
import { round } from "../../../utils/number.js";
import { compact } from "../../../utils/number.js";

function DurationAvgHeatmap(props) {
  const { data } = props;

  const zValues = [];
  const graphData = data.map((row) => {
    const z = round(row.avg_duration, 0);
    zValues.push(z);
    return {
      x: row.step,
      y: row.buf,
      z: z,
    };
  });

  zValues.sort(function (a, b) {
    return a - b;
  });

  var colorScale = chroma
    .scale(["#03640a", "#9e0d25"])
    .domain([zValues[0], zValues[zValues.length - 1]]);

  const series = [
    {
      label: "Duration",
      data: graphData,
      backgroundColor: (context) => {
        return colorScale(context.raw.z).hex();
      },
      hoverBackgroundColor: (context) => {
        return colorScale(context.raw.z).hex();
      },
    },
  ];

  const graphOptions = {
    aspectRatio: 3,
    interaction: {
      intersect: true,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "step",
        },
        ticks: {
          callback: (value) => value + "s",
        },
      },
      y: {
        title: {
          display: true,
          text: "buf",
        },
        ticks: {
          callback: (value) => compact(value * 100, 2, true) + "%",
        },
      },
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          return value.z + " min";
        },
      },
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <>
      <h3 className="mb-4">Duration Avg</h3>
      <Graph series={series} options={graphOptions} type="heatmap" />
    </>
  );
}

DurationAvgHeatmap.propTypes = {
  data: PropTypes.array.isRequired,
};

export default withErrorBoundary(DurationAvgHeatmap);
