// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import Card from "../../../components/Card/Card.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function ConcentrationRiskGiniCard(props) {
  const { data } = props;
  if (!data) {
    return null;
  }

  const grouped = _.groupBy(data, "ilk");
  const series = [];
  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key,
      data: rows.map((row) => ({
        x: row["report_date"],
        y: row["gini"],
      })),
    });
  });

  const options = {
    interaction: {
      mode: "nearest",
      axis: "x",
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
        },
      },
      y: {
        ticks: {
          callback: (value) => compact(value, 2, true),
        },
        title: {
          display: true,
          text: "DAI supply gini coefficient",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return tooltipTitleDateTime(tooltipItems, true, false, "LLL yyyy");
          },
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem);
          },
        },
      },
    },
  };

  return (
    <Card title="DAI Supply Concentration Risk (Gini Coefficient) per Vault Type">
      <p className="mb-4">
        Using{" "}
        <a
          href="https://en.wikipedia.org/wiki/Gini_coefficient"
          target="_blank"
          rel="noopener noreferrer"
          className="link-primary"
        >
          Gini Coefficient
        </a>{" "}
        to quantify concentration risk. Large concentration risk means that the majority
        of debt exposure comes from a small number or vaults. GI of 0 is total equality
        (all vaults with the same debt exposure), GI of 1 is total inequality (one vault
        with all of the debt exposure).
      </p>
      <Graph series={series} options={options} />
    </Card>
  );
}

export default withErrorBoundary(ConcentrationRiskGiniCard);
