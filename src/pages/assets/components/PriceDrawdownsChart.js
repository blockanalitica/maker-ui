// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import { withErrorBoundary } from "../../../hoc.js";
import Loader from "../../../components/Loader/Loader.js";
import { compact } from "../../../utils/number.js";
import Graph from "../../../components/Graph/Graph.js";
import { useFetch } from "../../../hooks";

function PriceDrawdownsChart(props) {
  const { data, isLoading, isError, ErrorFallbackComponent } =
    useFetch("/assets/drawdowns/");

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const grouped = _.groupBy(data, "key");
  const series = [];

  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key,
      data: rows.map((row) => ({
        x: row["drop"],
        y: row["amount"],
      })),
    });
  });

  const options = {
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        reverse: true,
        type: "linear",
        ticks: {
          reverse: true,
          callback: (value) => value + "%",
        },
      },
      y: {
        stacked: false,
        ticks: {
          reverse: true,
          callback: (value) => compact(value, 2, true) + "#",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return "Drop: " + tooltipItems[0].parsed.x + " %";
          },
          label: (tooltipItems) => {
            return (
              tooltipItems.dataset.label + " drop count: " + tooltipItems.formattedValue
            );
          },
        },
      },
    },
  };

  return (
    <>
      <p className="mb-4">
        This metric measures the numerical amount of larger price drops that asset
        experienced in its observable price patterns. This metric differs from price
        volatility as volatility can be small, while price drops are large. In general,
        assets which experienced larger price drops in the past, or resemble those that
        did (some are very young) tend to have higher collateral requirements.
      </p>
      <Graph series={series} options={options} type="bar" />
      <p className="small text-content">
        Source:{" "}
        <a
          href="https://www.cryptocompare.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CryptoCompare
        </a>
        <br />
        Disclaimer: in some cases cryptocompare is reporting wrong OHLCV and because of
        that some drawdowns can be wrong.
      </p>
    </>
  );
}

export default withErrorBoundary(PriceDrawdownsChart);
