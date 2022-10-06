// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import Card from "../../../components/Card/Card.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function AbsolutePerVaultTypeCard(props) {
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
        y: row["dai_supply_delta_abs"],
      })),
    });
  });

  const options = {
    interaction: {
      mode: "x",
    },
    scales: {
      x: {
        stacked: true,
        type: "time",
        time: {
          unit: "month",
        },
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => compact(value, 2, true),
        },
        title: {
          display: true,
          text: "absolute DAI supply growth",
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
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce(
              (total, tooltip) => total + tooltip.parsed.y,
              0
            );
            return "Total: " + compact(total, 2, true);
          },
        },
      },
    },
  };

  return (
    <Card title="Absolute DAI Supply Growth per Vault Type">
      <p className="mb-4">Change in absolute DAI supply month over month.</p>
      <Graph series={series} type="bar" options={options} />
    </Card>
  );
}

AbsolutePerVaultTypeCard.propTypes = {
  data: PropTypes.array.isRequired,
};

export default withErrorBoundary(AbsolutePerVaultTypeCard);
