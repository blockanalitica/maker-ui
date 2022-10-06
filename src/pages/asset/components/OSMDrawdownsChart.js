// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import _ from "lodash";
import { withErrorBoundary } from "../../../hoc.js";
import Loader from "../../../components/Loader/Loader.js";
import { compact } from "../../../utils/number.js";
import { parseUTCDateTimestamp } from "../../../utils/datetime.js";
import Graph from "../../../components/Graph/Graph.js";
import { useFetch } from "../../../hooks";

function OSMDrawdownsChart(props) {
  const { symbol } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/assets/${symbol}/OSM/drawdowns/price-jumps/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const [drawdowns, timestamps] = data;
  const grouped = _.groupBy(drawdowns, "key");
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

  const times = [];
  for (const [key, value] of Object.entries(timestamps)) {
    const start = parseUTCDateTimestamp(value.start_timestamp);
    const end = parseUTCDateTimestamp(value.end_timestamp);

    times.push(
      <span key={key}>
        {key}: {start.toFormat("LLL dd, yyyy")} - {end.toFormat("LLL dd, yyyy")}
        <br />
      </span>
    );
  }

  const options = {
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        reverse: true,
        type: "linear",
        ticks: {
          callback: (value) => compact(value, 2, true) + "#",
        },
      },
      y: {
        stacked: false,
        ticks: {
          callback: (value) => compact(value, 2, true) + "%",
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
      <Graph series={series} options={options} type="bar" />
      <p className="small">{times}</p>
    </>
  );
}

export default withErrorBoundary(OSMDrawdownsChart);
