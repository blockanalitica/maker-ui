import _ from "lodash";
import { withErrorBoundary } from "../../../hoc.js";
import { tooltipLabelNumber, tooltipTitleDateTime } from "../../../utils/graph.js";
import { compact } from "../../../utils/number.js";
import Loader from "../../../components/Loader/Loader.js";
import { useFetch } from "../../../hooks";
import Graph from "../../../components/Graph/Graph.js";

function ProtectionHistoryChart(props) {
  const { timePeriod } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/risk/protection-score/history/",
    { days_ago: timePeriod }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const grouped = _.groupBy(data, "protection_score");
  const series = [];

  Object.entries(grouped).forEach(([key, rows]) => {
    series.push({
      protection_score: key,
      label: key,
      data: rows.map((row) => ({
        x: row["datetime"],
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
            return tooltipLabelNumber(tooltipItem, "$");
          },
        },
      },
    },
  };

  return <Graph series={series} options={options} />;
}

export default withErrorBoundary(ProtectionHistoryChart);
