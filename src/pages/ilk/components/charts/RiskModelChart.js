// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Graph from "../../../../components/Graph/Graph.js";
import Loader from "../../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch } from "../../../../hooks";
import { compact } from "../../../../utils/number.js";

function RiskModelChart(props) {
  const { ilk } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/ilks/${ilk}/risk-premium/model/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const {
    results: rows,
    debt_ceiling: debtCeiling,
    total_debt_dai: debtExposure,
    risk_premium: riskPremium,
  } = data;

  const graphAnnotations = {};

  if (debtCeiling) {
    graphAnnotations["maxDC"] = {
      type: "line",
      scaleID: "x",
      value: debtCeiling,
      borderColor: "red",
      borderWidth: 2,
      borderDash: [10, 8],
      label: {
        position: "start",
        backgroundColor: "#0e1726",
        color: "red",
        content: "DC at 10% RP",
        enabled: true,
      },
    };
  }

  if (riskPremium) {
    graphAnnotations["CR"] = {
      type: "line",
      scaleID: "x",
      value: debtExposure,
      borderColor: "green",
      borderWidth: 2,
      borderDash: [10, 8],
      label: {
        position: "start",
        backgroundColor: "#0e1726",
        yAdjust: 40,
        color: "green",
        content: "RP at current DE",
        enabled: true,
      },
    };
  }

  const series = [
    {
      label: "Risk Premium",
      data: rows.map((row) => ({
        x: row["simulated_de"],
        y: row["risk_premium"],
      })),
    },
  ];

  const options = {
    aspectRatio: 4,
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        type: "linear",
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },
        title: {
          display: true,
          text: "debt exposure",
        },
      },
      y: {
        ticks: {
          callback: (value) => `${value}%`,
        },

        title: {
          display: true,
          text: "risk premium",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      annotation: {
        annotations: graphAnnotations,
      },
    },
  };

  return (
    <>
      <Graph series={series} options={options} />
    </>
  );
}

export default withErrorBoundary(RiskModelChart);
