// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import { withErrorBoundary } from "../../../hoc.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";
import Graph from "../../../components/Graph/Graph.js";

function RatesChart(props) {
  const { data, type } = props;

  const grouped = _.groupBy(data, "protocol");
  const series = [];

  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key,
      protocol: key,
      data: rows.map((row) => {
        let y;
        if (type.includes("rewards")) {
          y =
            (row["borrow_rate"] -
              row["rewards_rate"] -
              2 * (row["eth_rate"] + row["eth_reward_rate"])) *
            100;
        } else {
          y = (row["borrow_rate"] - 2 * row["eth_rate"]) * 100;
        }
        return {
          x: row["dt"],
          y: y,
        };
      }),
    });
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
          callback: (value) => compact(value, 2, true) + "%",
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
            return tooltipLabelNumber(tooltipItem, null, " %");
          },
        },
      },
    },
  };

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(RatesChart);
