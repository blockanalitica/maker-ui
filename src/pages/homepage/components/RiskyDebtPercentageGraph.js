// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import { withErrorBoundary } from "../../../hoc.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";
import Loader from "../../../components/Loader/Loader.js";
import { useFetch } from "../../../hooks";
import Graph from "../../../components/Graph/Graph.js";

function RiskyDebtPercentageGraph(props) {
  const { timePeriod } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/risk/risky-debt/",
    { days_ago: timePeriod }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { results } = data;
  const series = [
    {
      label: "% Risky debt",
      data: results.map((row) => ({
        x: row["dt"],
        y: row["risky_debt"],
      })),
    },
  ];

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
        stacked: false,
        ticks: {
          callback: (value) => compact(value, 2, true),
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
            return tooltipLabelNumber(tooltipItem, null, "%");
          },
        },
      },
    },
  };

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(RiskyDebtPercentageGraph);
