// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import { withErrorBoundary } from "../../../hoc.js";
import { tooltipLabelNumber } from "../../../utils/graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { compact } from "../../../utils/number.js";
import Graph from "../../../components/Graph/Graph.js";
import { useFetch } from "../../../hooks";

function SlippageChart(props) {
  const { symbol } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/assets/${symbol}/slippage/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const grouped = _.groupBy(data, "symbol");
  const series = [];

  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key,
      data: rows.map((row) => ({
        x: row["amount"],
        y: row["slippage"],
      })),
    });
  });

  const options = {
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        type: "linear",
        ticks: {
          callback: (value) => "$" + compact(value, 2, true),
        },
      },
      y: {
        stacked: false,
        ticks: {
          reverse: true,
          callback: (value) => compact(value, 2, true) + "%",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            let key = compact(tooltipItems[0].parsed.x, 2, true);
            return "Slippage @ $" + key;
          },
          label: (tooltipItem) => {
            return tooltipLabelNumber(tooltipItem, null, " %");
          },
        },
      },
    },
  };

  return (
    <>
      <p>
        The slippage curve is an estimate of on-chain liquidity measured by 1inch dex
        aggregator; it shows what would the price change resulted to as a consequence of
        selling some amount of assets with a market order. Greater the liquidity across
        on-chain venues, smaller is the expected slippage.
      </p>
      <Graph series={series} options={options} />
    </>
  );
}

export default withErrorBoundary(SlippageChart);
