// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import LoadingOverlay from "react-loading-overlay";
import Card from "../../../components/Card/Card.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import Loader from "../../../components/Loader/Loader.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import StatsBar from "../../../components/Stats/StatsBar.js";

function AssetPrices(props) {
  const { symbol, timePeriod } = props;

  const { data, isLoading, isPreviousData, isError, ErrorFallbackComponent } = useFetch(
    `/assets/${symbol}/prices/`,
    { days_ago: timePeriod },
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const stats = [
    {
      title: "current OSM price",
      bigValue: <Value value={data.osm_current_price} decimals={2} prefix="$" />,
      smallValue: (
        <ValueChange
          value={data.osm_price_diff}
          decimals={2}
          suffix=" %"
          compact
          hideIfZero
        />
      ),
    },
    {
      title: "next OSM price",
      bigValue: <Value value={data.osm_next_price} decimals={2} prefix="$" />,
    },
    {
      title: "medianizer price",
      bigValue: <Value value={data.mkt_price} decimals={2} prefix="$" />,
      smallValue: (
        <ValueChange
          value={data.medianizer_price_diff}
          decimals={2}
          suffix=" %"
          compact
          hideIfZero
        />
      ),
    },
    {
      title: "market price",
      bigValue: <Value value={data.mkt_price} decimals={2} prefix="$" />,
      smallValue: (
        <ValueChange
          value={data.mkt_price_diff}
          decimals={2}
          suffix=" %"
          compact
          hideIfZero
        />
      ),
    },
  ];

  return (
    <>
      <Card className="mb-4">
        <LoadingOverlay active={isPreviousData} spinner>
          <StatsBar cardTag="div" stats={stats} />
        </LoadingOverlay>
      </Card>
    </>
  );
}

export default withErrorBoundary(AssetPrices);
