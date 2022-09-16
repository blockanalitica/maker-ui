import _ from "lodash";
import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import Card from "../../../components/Card/Card.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";

function ConcentrationRiskWhalesCard(props) {
  const { data } = props;
  if (!data) {
    return null;
  }

  const grouped = _.groupBy(data, "whale");
  const series = [];
  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key,
      data: rows.map((row) => ({
        x: row["report_date"],
        y: row["dai_supply_percent"] * 100,
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
          callback: (value) => compact(value, 2, true) + "%",
        },
        title: {
          display: true,
          text: "percent of total DAI supply",
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
            return tooltipLabelNumber(tooltipItem, null, "%");
          },
        },
      },
    },
  };

  return (
    <Card title="Concentration Risk: DAI Supply per Vault Owner Label">
      <p className="mb-4">
        Aggregating DAI supply across different whales (identified by Risk team) and
        comparing it to the contribution of the rest of the vault portfolio.
      </p>
      <Graph series={series} type="bar" options={options} />
    </Card>
  );
}

export default withErrorBoundary(ConcentrationRiskWhalesCard);
