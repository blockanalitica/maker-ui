// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import Loader from "../../../components/Loader/Loader.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import StatsBar from "../../../components/Stats/StatsBar.js";

function StatsCard(props) {
  const { daysAgo } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    "/risk/stats/",
    { days_ago: daysAgo }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const stats = [
    {
      title: "capital at risk 30d avg",
      bigValue: (
        <Value
          value={data.capital_at_risk_30d_avg}
          decimals={2}
          prefix="$"
          compact100k
        />
      ),
      smallValue: (
        <ValueChange
          value={data.change.capital_at_risk_30d_avg_diff}
          tooltipValue={data.change.capital_at_risk_30d_avg}
          decimals={2}
          prefix="$"
          compact100k
          icon
          hideIfZero
          reverse
        />
      ),
    },
    {
      title: "surplus buffer",
      bigValue: (
        <Value value={data.surplus_buffer} decimals={2} prefix="$" compact100k />
      ),
      smallValue: (
        <ValueChange
          value={data.change.surplus_buffer_diff}
          tooltipValue={data.change.surplus_buffer}
          decimals={2}
          prefix="$"
          compact100k
          icon
          hideIfZero
        />
      ),
    },
    {
      title: "total debt",
      bigValue: <Value value={data.total_debt} decimals={2} prefix="$" compact100k />,
      smallValue: (
        <ValueChange
          value={data.change.total_debt_diff}
          tooltipValue={data.change.total_debt}
          decimals={2}
          prefix="$"
          compact100k
          icon
          hideIfZero
        />
      ),
    },
    {
      title: "total risky debt",
      bigValue: (
        <Value value={data.total_risky_debt} decimals={2} prefix="$" compact100k />
      ),
      smallValue: (
        <ValueChange
          value={data.change.total_risky_debt_diff}
          tooltipValue={data.change.total_risky_debt}
          decimals={2}
          prefix="$"
          compact100k
          icon
          hideIfZero
        />
      ),
    },
    {
      title: "total stable debt",
      bigValue: (
        <Value value={data.total_stable_debt} decimals={2} prefix="$" compact100k />
      ),
      smallValue: (
        <ValueChange
          value={data.change.total_stable_debt_diff}
          tooltipValue={data.change.total_stable_debt}
          decimals={2}
          prefix="$"
          compact100k
          icon
          hideIfZero
        />
      ),
    },
    {
      title: "# of vaults",
      bigValue: <Value value={data.vault_count} decimals={0} />,
      smallValue: (
        <ValueChange
          value={data.change.vault_count_diff}
          tooltipValue={data.change.vault_count}
          decimals={0}
          icon
          hideIfZero
        />
      ),
    },
  ];

  return <StatsBar stats={stats} />;
}

export default withErrorBoundary(StatsCard);
