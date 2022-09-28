import _ from "lodash";
import { withErrorBoundary } from "../../../hoc.js";
import Loader from "../../../components/Loader/Loader.js";
import { parseUTCDateTimestamp } from "../../../utils/datetime.js";
import { compact } from "../../../utils/number.js";
import Graph from "../../../components/Graph/Graph.js";
import { useFetch } from "../../../hooks";

function DrawdownsChart(props) {
  const { symbol } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/assets/${symbol}/historical-price/drawdowns-price-jumps/`
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
          callback: (value) => compact(value, 2, true) + "%",
        },
      },
      y: {
        stacked: false,
        ticks: {
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
      <p className="small">{times}</p>
      <p className="small">
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

export default withErrorBoundary(DrawdownsChart);
