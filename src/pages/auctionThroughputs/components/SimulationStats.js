// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { withErrorBoundary } from "../../../hoc.js";
import Value from "../../../components/Value/Value.js";
import ValueChange from "../../../components/Value/ValueChange.js";
import StatsBar from "../../../components/Stats/StatsBar.js";

function AuctionStats(props) {
  const { data } = props;
  if (!data) {
    return null;
  }

  const stats = [
    {
      title: "debt exposure",
      bigValue: <Value value={data.debt_exposure_share} decimals={2} suffix="%" />,
      smallValue: (
        <ValueChange
          value={data.exposure_diff}
          decimals={2}
          compact
          suffix="%"
          icon
          hideIfZero
          tooltipValue={data.exposure_diff}
        />
      ),
    },
    {
      title: "slippage",
      bigValue: <Value value={data.sim_slippage} decimals={2} suffix="%" />,
      smallValue: (
        <ValueChange
          value={data.slippage_diff}
          decimals={2}
          compact
          suffix="%"
          icon
          hideIfZero
          tooltipValue={data.slippage_diff}
        />
      ),
    },
    {
      title: "cycle",
      bigValue: <Value value={data.auction_cycle} suffix="m" decimals={2} />,
      smallValue: (
        <ValueChange
          value={data.cycle_diff}
          decimals={2}
          compact
          suffix=" min"
          icon
          hideIfZero
          tooltipValue={data.cycle_diff}
        />
      ),
    },
    {
      title: "duration",
      bigValue: data.auction_dur,
      smallValue: (
        <ValueChange
          value={data.dur_diff}
          decimals={2}
          compact
          suffix=" min"
          icon
          hideIfZero
          tooltipValue={data.dur_diff}
        />
      ),
    },
  ];
  return <StatsBar className="mb-4" stats={stats} />;
}

export default withErrorBoundary(AuctionStats);
