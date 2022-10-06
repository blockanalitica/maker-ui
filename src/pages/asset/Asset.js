// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CryptoIcon from "../../components/CryptoIcon/CryptoIcon.js";
import TimeSwitch from "../../components/TimeSwitch/TimeSwitch.js";
import { withErrorBoundary } from "../../hoc.js";
import { usePageTitle } from "../../hooks";
import styles from "./Asset.module.scss";
import AssetPrices from "./components/AssetPrices.js";
import CEXActivityCard from "./components/CEXActivityCard.js";
import DEXActivityCard from "./components/DEXActivityCard.js";
import DrawdownsCard from "./components/DrawdownsCard.js";
import SlippageCard from "./components/SlippageCard.js";

function Asset(props) {
  const { symbol } = useParams();
  usePageTitle(symbol);

  const [timePeriod, setTimePeriod] = useState(1);

  return (
    <>
      <div className="d-flex mb-4 justify-content-space-between align-items-center">
        <div className="mb-2 flex-grow-1">
          <div className={styles.title}>
            <CryptoIcon name={symbol} size="3rem" />
            <h3 className="m-0">{symbol}</h3>
          </div>
        </div>
        <TimeSwitch activeOption={timePeriod} label={""} onChange={setTimePeriod} />
      </div>
      <AssetPrices symbol={symbol} timePeriod={timePeriod} />
      <SlippageCard symbol={symbol} />
      <CEXActivityCard symbol={symbol} />
      <DEXActivityCard symbol={symbol} />
      <DrawdownsCard symbol={symbol} />
    </>
  );
}

export default withErrorBoundary(Asset);
