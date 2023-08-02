// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import React from "react";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { pieGraphDataLimiter, pieTooltipLabelNumber } from "../../../utils/graph.js";
import { Row } from "reactstrap";
function ETHShare(props) {
  const PROTOCOLS_PALETTE = {
    aave: "#B6509E",
    aaveV2: "#B6509E",
    aaveV3: "#b65085",
    compound: "#00D395",
    maker: "#F4B731",
    compoundV3: "#00d360",
    euler: "#e5615e",
    alchemix: "#f5c09a",
    spark: "#f38701",
  };
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/defi/eth-market-share-router/"
  );
  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const { results } = data;
  const { series, labels } = pieGraphDataLimiter(results, "protocol", "balance", 0.1);

  const backgroundColors = labels.map((label) => PROTOCOLS_PALETTE[label] || "#D2691E");
  const borderColors = labels.map((label) => PROTOCOLS_PALETTE[label] || "#D2691E");

  const newSeries = [
    {
      data: series[0]["data"],
      backgroundColor: backgroundColors,
      borderColor: borderColors,
    },
  ];
  const options = {
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return pieTooltipLabelNumber(context, "", " ETH");
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
    maintainAspectRatio: true,
    responsive: true,
    cutout: "42%",
    layout: {
      padding: 0,
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  return (
    <div>
      <div className="mb-4 flex-grow-1 d-flex align-items-center">
        <h1 className="h3 m-0">ETH captured</h1>
      </div>

      <Row className="mb-4">
        <Graph series={newSeries} labels={labels} options={options} type="pie" />
      </Row>
    </div>
  );
}

export default withErrorBoundary(ETHShare);
