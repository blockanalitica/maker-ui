// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0
import _ from "lodash";
import Graph from "../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../hoc.js";
import { compact } from "../../utils/number.js";

function BarChart(props) {
  const { data } = props;
  const grouped = _.groupBy(data.results, (item) => item.ilk + item.protection_score);
  const series = [];
  const ilks = _.uniq(data.results.map((item) => item.ilk));
  const protectionScores = ["null", "low", "medium", "high"];

  const BackgroundColors = {
    low: "#03640a",
    medium: "#929629",
    high: "#9e0d25",
    null: "gray",
  };

  protectionScores.forEach((key) => {
    const dataPoints = [];

    ilks.forEach((ilk) => {
      const filteredItems = grouped[ilk + key];
      const totalDebt = filteredItems ? _.sumBy(filteredItems, "debt") : 0;

      dataPoints.push({
        x: ilk,
        y: totalDebt,
      });
    });

    series.push({
      label: key === "null" ? "no risk score" : key + " risk",
      data: dataPoints,
      backgroundColor: BackgroundColors[key],
    });
  });

  const options = {
    aspectRatio: 2.5,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "ILKs",
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: `Debt`,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return (
              tooltipItem.dataset.label +
              ": $" +
              compact(tooltipItem.parsed.y.toFixed(2))
            );
          },
          footer: function (tooltipItems) {
            const total = tooltipItems.reduce(
              (total, tooltip) => total + tooltip.parsed.y,
              0
            );
            return "Total: $" + compact(total, 2, true);
          },
        },
      },
    },
  };

  return (
    <>
      <Graph series={series} options={options} type="bar" />
    </>
  );
}

export default withErrorBoundary(BarChart);
