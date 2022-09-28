import _ from "lodash";
import { withErrorBoundary } from "../../../hoc.js";
import { parseUTCDateTimestamp } from "../../../utils/datetime.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import Loader from "../../../components/Loader/Loader.js";
import { compact } from "../../../utils/number.js";
import Graph from "../../../components/Graph/Graph.js";
import { useFetch } from "../../../hooks";

function CEXTotalActivity(props) {
  const { symbol } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/assets/${symbol}/cex/trading-activity/`
  );

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
        x: parseUTCDateTimestamp(row["timestamp"]),
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
        type: "time",
        time: {
          unit: "day",
        },
      },
      y: {
        stacked: false,
        ticks: {
          reverse: true,
          callback: (value) => "$" + compact(value, 2, true),
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
        Aggregated daily trading volume (turnover) of selected centralized exchanges and
        trading pairs. We include ETH, BTC, fiat and stable coins based trading pairs.
        We apply a haircut to some of the exchanges due to obvious over-reported trading
        activity, while on-chain deposits suggest relevancy. (e.g. exchange is
        well-known for over reporting their trading activity, but their asset deposits
        visible on-chain are too great to ignore as a whole)
      </p>
      <Graph series={series} options={options} />
    </>
  );
}

export default withErrorBoundary(CEXTotalActivity);
