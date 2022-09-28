import React from "react";
import PropTypes from "prop-types";
import { useFetch } from "../../../hooks";
import Loader from "../../../components/Loader/Loader.js";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";

function DaiBorrowCurveGraph(props) {
  const { protocol } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/d3ms/${protocol}/dai-borrow-curve/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const series = [
    {
      label: "Borrow rate",
      data: data.map((row) => ({
        x: row.utilization_rate,
        y: row.borrow_rate,
      })),
    },
  ];
  const options = {
    interaction: {
      axis: "x",
    },
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "utilization rate",
        },
      },
      y: {
        title: {
          display: true,
          text: "borrow rate",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return "Utilization rate: " + tooltipItems[0].parsed.x;
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };

  return <Graph series={series} options={options} />;
}

DaiBorrowCurveGraph.propTypes = {
  protocol: PropTypes.string.isRequired,
};

export default withErrorBoundary(DaiBorrowCurveGraph);
