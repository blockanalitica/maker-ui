// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import PropTypes from "prop-types";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import Card from "../../../components/Card/Card.js";
import { compact } from "../../../utils/number.js";
import chroma from "chroma-js";

function SlippageHeatmap(props) {
  const { data } = props;

  const [activeTab, setActiveTab] = useState("min");
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const zValues = [];
  const graphData = data.map((row) => {
    const z = compact(row.slippage[activeTab] * 100, 1);
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
    .scale(["#9e0d25", "#03640a"])
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
          return value.z + "%";
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
      <h3 className="mb-4">Slippage</h3>
      <Card>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "min" })}
              onClick={() => {
                toggleTab("min");
              }}
            >
              Min
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "max" })}
              onClick={() => {
                toggleTab("max");
              }}
            >
              Max
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "avg" })}
              onClick={() => {
                toggleTab("avg");
              }}
            >
              Avg
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "median" })}
              onClick={() => {
                toggleTab("median");
              }}
            >
              Median
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={"kekec"}>
          <TabPane tabId="kekec">
            <Graph series={series} options={graphOptions} type="heatmap" />
          </TabPane>
        </TabContent>
      </Card>
    </>
  );
}

SlippageHeatmap.propTypes = {
  data: PropTypes.array.isRequired,
};

export default withErrorBoundary(SlippageHeatmap);
