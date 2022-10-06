// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader/Loader.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import StatsBar from "../../../components/Stats/StatsBar.js";

function StatsCard(props) {
  const { ilk, days_ago } = props;

  const navigate = useNavigate();

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `/ilks/${ilk}/stats/`,
    { days_ago }
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const onValueClick = (e, url) => {
    navigate(url);
    e.stopPropagation();
  };

  const stats = [
    {
      title: "capital at risk",
      bigValue: (
        <Value
          value={data.capital_at_risk}
          decimals={2}
          prefix="$"
          role="button"
          onClick={(e) =>
            onValueClick(e, `/vault-types/${ilk}/history/?type=capital_at_risk`)
          }
          compact100k
        />
      ),
      smallValue: (
        <ValueChange
          value={data.change.capital_at_risk_diff}
          tooltipValue={data.change.capital_at_risk}
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
      title: "risk premium",
      bigValue: (
        <Value
          value={data.risk_premium}
          decimals={2}
          suffix="%"
          role="button"
          onClick={(e) =>
            onValueClick(e, `/vault-types/${ilk}/history/?type=risk_premium`)
          }
        />
      ),
      smallValue: (
        <ValueChange
          value={data.change.risk_premium_diff}
          tooltipValue={data.change.risk_premium}
          decimals={2}
          suffix="%"
          icon
          hideIfZero
          reverse
        />
      ),
    },
    {
      title: "total debt",
      bigValue: (
        <Value
          value={data.total_debt}
          decimals={2}
          prefix="$"
          role="button"
          onClick={(e) =>
            onValueClick(e, `/vault-types/${ilk}/history/?type=total_debt`)
          }
          compact100k
        />
      ),
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
      title: "# of vaults",
      bigValue: (
        <Value
          value={data.vaults_count}
          decimals={2}
          role="button"
          onClick={(e) =>
            onValueClick(e, `/vault-types/${ilk}/history/?type=vaults_count`)
          }
          compact100k
        />
      ),
      smallValue: (
        <ValueChange
          value={data.change.vaults_count_diff}
          tooltipValue={data.change.vaults_count}
          decimals={2}
          compact100k
          icon
          hideIfZero
        />
      ),
    },
    {
      title: "total locked",
      bigValue: (
        <Value
          value={data.total_locked}
          decimals={2}
          role="button"
          onClick={(e) =>
            onValueClick(e, `/vault-types/${ilk}/history/?type=total_locked`)
          }
          compact
        />
      ),
      smallValue: (
        <ValueChange
          value={data.change.total_locked_diff}
          tooltipValue={data.change.total_locked}
          decimals={2}
          compact100k
          icon
          hideIfZero
        />
      ),
    },
    {
      title: "weighted CR",
      bigValue: (
        <Value
          value={data.weighted_collateralization_ratio}
          decimals={0}
          suffix="%"
          role="button"
          onClick={(e) =>
            onValueClick(
              e,
              `/vault-types/${ilk}/history/?type=weighted_collateralization_ratio`
            )
          }
          compact100k
        />
      ),
      smallValue: (
        <ValueChange
          value={data.change.weighted_collateralization_ratio_diff}
          tooltipValue={data.change.weighted_collateralization_ratio}
          decimals={0}
          suffix="%"
          compact100k
          icon
          hideIfZero
        />
      ),
    },
  ];

  return (
    <StatsBar
      stats={stats}
      role="button"
      onClick={(e) => onValueClick(e, `/vault-types/${ilk}/history/`)}
    />
  );
}

export default withErrorBoundary(StatsCard);
