import _ from "lodash";
import React from "react";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import Graph from "../../../components/Graph/Graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { compact } from "../../../utils/number.js";

function VolumePerExchangeCard(props) {
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/dai-trades/volume/per-exchange/"
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  if (data.length === 0) {
    return null;
  }
  const series = [];
  const grouped = _.groupBy(data, "exchange");
  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      label: key,
      data: rows.map((row) => ({
        x: row.amount,
        y: row.price,
      })),
    });
  });

  const options = {
    indexAxis: "y",
    interaction: {
      mode: "y",
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "total amount",
        },
        ticks: {
          callback: (value) => "$" + compact(value, 6, true),
        },
      },
      y: {
        type: "linear",
        stacked: true,
        title: {
          display: true,
          text: "USD price",
        },
        ticks: {
          callback: (value) => "$" + compact(value, 6, true),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return `DAI price: $${tooltipItems[0].parsed.y}`;
          },
          label: (tooltipItem) => {
            let label = tooltipItem.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (tooltipItem.parsed.x !== null) {
              label += "$" + compact(tooltipItem.parsed.x, 2, true);
            }
            return label;
          },
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce(
              (total, tooltip) => total + tooltip.parsed.x,
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
      <h2 className="mb-4">trade volume per exchange over last 24h</h2>
      <Graph series={series} type="bar" options={options} />
    </>
  );
}

export default withErrorBoundary(VolumePerExchangeCard);
