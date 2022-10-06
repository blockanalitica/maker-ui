// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import PropTypes from "prop-types";
import { FormGroup, Label, Col } from "reactstrap";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import Select from "../../../components/Select/Select.js";
import chroma from "chroma-js";
import { compact } from "../../../utils/number.js";

function DurationHeatmap(props) {
  const { data } = props;

  const [cdfDuration, setCdfDuration] = useState(0.95);
  const zValues = [];
  const graphData = data.map((row) => {
    zValues.push(row.cdf_percentiles[cdfDuration]);
    return {
      x: row.step,
      y: row.buf,
      z: row.cdf_percentiles[cdfDuration],
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

  const options = Object.keys(data[0].cdf_percentiles).map((value) => ({
    value: parseFloat(value),
    label: value,
  }));

  const selectedOption = options.find((option) => option.value === cdfDuration);
  return (
    <>
      <h3 className="mb-4">Duration CDF</h3>
      <FormGroup row>
        <Label xl={1} for="date">
          CDF:
        </Label>
        <Col xl={2}>
          <Select
            defaultValue={selectedOption}
            options={options}
            onChange={(option) => setCdfDuration(option.value)}
          />
        </Col>
      </FormGroup>
      <div>
        <Graph series={series} options={graphOptions} type="heatmap" />
      </div>
    </>
  );
}

DurationHeatmap.propTypes = {
  data: PropTypes.array.isRequired,
};

export default withErrorBoundary(DurationHeatmap);
