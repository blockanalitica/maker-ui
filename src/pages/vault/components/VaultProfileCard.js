// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Badge } from "reactstrap";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import StatsBar from "../../../components/Stats/StatsBar.js";

function VaultProfileCard(props) {
  const { data } = props;

  const badgeMap = {
    low: "success",
    meidum: "warning",
    high: "danger",
  };

  const stats = [
    {
      title: "collateral",
      bigValue: <Value value={data.collateral} decimals={2} compact />,
    },
    {
      title: "debt",
      bigValue: <Value value={data.debt} decimals={2} compact prefix="$" />,
    },
    {
      title: "collateralization",
      bigValue: <Value value={data.collateralization || 0} decimals={2} suffix="%" />,
    },
    {
      title: "liquidation price",
      bigValue: data.liquidation_price ? (
        <Value value={data.liquidation_price} decimals={2} prefix="$" />
      ) : (
        "-"
      ),
    },
    {
      title: "protection score",
      normalValue: (
        <div className="d-flex align-items-center">
          <span className="flex-grow-1">
            {badgeMap[data.protection_score] ? (
              <Badge color={badgeMap[data.protection_score]} className="mr-1">
                {data.protection_score} risk
              </Badge>
            ) : (
              "-"
            )}
          </span>
          {data.protection_service ? (
            <CryptoIcon
              name={data.protection_service}
              alt={data.protection_service}
              size="2rem"
            />
          ) : null}
        </div>
      ),
    },
  ];

  return <StatsBar stats={stats} />;
}

export default withErrorBoundary(VaultProfileCard);
