import { withErrorBoundary } from "../../../hoc.js";
import { parseUTCDateTime } from "../../../utils/datetime.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { compact } from "../../../utils/number.js";
import Graph from "../../../components/Graph/Graph.js";
import { useFetch } from "../../../hooks";

function DailyVolatilityChart(props) {
  const { symbol } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/assets/${symbol}/historical-price/daily-volatility/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const series = [
    {
      label: "Standard deviation",
      data: data.map((row) => ({
        x: parseUTCDateTime(row["date"]),
        y: row["volatility"],
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
          reverse: true,
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
            return tooltipLabelNumber(tooltipItem, "$");
          },
        },
      },
    },
  };

  return (
    <>
      <p className="mb-4">
        Calculated from 90 day hourly price changes. More volatile assets are perceived
        as more risky and thus might require higher collateralization.
      </p>
      <Graph series={series} options={options} />
    </>
  );
}

export default withErrorBoundary(DailyVolatilityChart);
