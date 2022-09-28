import React from "react";
import Graph from "../../../components/Graph/Graph.js";
import { withErrorBoundary } from "../../../hoc.js";
import Loader from "../../../components/Loader/Loader.js";
import { useFetch } from "../../../hooks";

function VaultProtectionMatrix(props) {
  const { uid, ilk } = props;
  const PROTECTION_SCORE_PALETTE = {
    low: "#03640a",
    medium: "#929629",
    high: "#9e0d25",
  };
  const WEEKDAYS = {
    1: "Mo",
    2: "Tu",
    3: "We",
    4: "Th",
    5: "Fr",
    6: "Sa",
    7: "Su",
  };
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/ilks/${ilk}/vaults/${uid}/protection-matrix/`
  );

  if (data === "no data") {
    return <></>;
  }

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const graphData = data.map((row) => {
    return {
      x: row.datetime,
      y: row.day,
      z: row.protection_score,
    };
  });
  const firstEntry = new Date(graphData[graphData.length - 1].x);
  const firstDayDiff =
    firstEntry.getDate() - firstEntry.getDay() + (firstEntry.getDay() === 0 ? -6 : 1);

  const firstDay = new Date(firstEntry.setDate(firstDayDiff));
  const lastEntry = new Date(graphData[0].x);
  const lastDayDiff = lastEntry.getDate() - (lastEntry.getDay() - 1) + 6;
  const lastDay = new Date(lastEntry.setDate(lastDayDiff));
  const weeks_between =
    Math.round((firstDay - lastDay) / (7 * 24 * 60 * 60 * 1000)) + 3;

  const series = [
    {
      label: "Protection score",
      data: graphData,
      backgroundColor: (context) => {
        return PROTECTION_SCORE_PALETTE[context.raw.z];
      },
      hoverBackgroundColor: (context) => {
        return PROTECTION_SCORE_PALETTE[context.raw.z];
      },

      width(c) {
        const a = c.chart.chartArea || {};
        return (a.right - a.left) / weeks_between;
      },
      height(c) {
        const a = c.chart.chartArea || {};
        return (a.bottom - a.top) / 7 - 1;
      },
    },
  ];

  const graphOptions = {
    aspectRatio: 4,
    interaction: {
      intersect: true,
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => WEEKDAYS[value],
          maxRotation: 0,
          autoSkip: true,
          padding: 1,
          font: {
            size: 9,
          },
        },
        offset: true,
        reverse: true,
        position: "right",
        grid: {
          display: false,
          drawBorder: false,
          tickLength: 0,
        },
      },
      x: {
        type: "time",
        position: "bottom",
        offset: true,
        time: {
          unit: "week",
          round: "week",
          isoWeekday: 1,
          displayFormats: {
            week: "MMM dd",
          },
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          font: {
            size: 9,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
          tickLength: 0,
        },
      },
    },
    plugins: {
      legend: false,
      tooltip: {
        displayColors: false,
        callbacks: {
          title() {
            return "";
          },
          label(context) {
            const v = context.dataset.data[context.dataIndex];
            return ["date: " + v.x, "score: " + v.z];
          },
        },
      },
    },
  };
  return <Graph series={series} options={graphOptions} type="matrix" />;
}

export default withErrorBoundary(VaultProtectionMatrix);
