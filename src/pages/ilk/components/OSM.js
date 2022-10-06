// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader/Loader.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import StatsBar from "../../../components/Stats/StatsBar.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import styles from "./OSM.module.scss";

function OSM(props) {
  const { ilk, isLp } = props;
  const navigate = useNavigate();
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/ilks/${ilk}/osm/`
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
    },
    {
      title: "next OSM price",
      bigValue: <Value value={data.osm_next_price} decimals={2} prefix="$" />,
      smallValue: <ValueChange value={data.diff} decimals={2} suffix="%" />,
    },
  ];

  if (!isLp) {
    stats.push({
      title: "medianizer price",
      bigValue: <Value value={data.medianizer} decimals={2} prefix="$" />,
      smallValue: <ValueChange value={data.medianizer_diff} decimals={2} suffix="%" />,
    });

    if (data.to_next_change) {
      stats.push({
        title: "price change in",
        bigValue: (
          <Value
            value={data.to_next_change}
            decimals={2}
            prefix="~"
            suffix="min"
            className={styles.valueBig}
          />
        ),
      });
    }
  }

  return (
    <StatsBar
      stats={stats}
      role="button"
      onClick={() => navigate(`/oracles/${data.symbol}/`)}
    />
  );
}

export default withErrorBoundary(OSM);
