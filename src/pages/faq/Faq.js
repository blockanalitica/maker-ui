// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { withErrorBoundary } from "../../hoc.js";
import styles from "./Faq.module.scss";

function FAQ(props) {
  return (
    <>
      <h1 className="h3 mb-4">faq</h1>
      <h5 className={styles.title}>What do the different terms mean?</h5>
      <ul>
        <li>
          <span className={styles.term}>Capital at risk:</span>
          <span className={styles.explanation}>
            A portfolio-level measurement of risky exposure. Calculated as a 30-day
            rolling average of each vault type’s Risk Premium multiplied by its
            outstanding DAI amount.{" "}
            <a
              href="https://medium.com/block-analitica/maker-capital-at-risk-model-methodology-2423b0c5913c"
              target="_blank"
              rel="noopener noreferrer"
            >
              Model Methodology
            </a>
            .
          </span>
        </li>
        <li>
          <span className={styles.term}>Surplus buffer:</span>
          <span className={styles.explanation}>
            A system-level surplus of DAI received primarily from Stability Fee revenue
            and Liquidation revenue. The Surplus Buffer Parameter ensures that there is
            a set maximum level of DAI that can be generated before a Surplus (FLAP)
            Action is triggered. outstanding DAI amount.{" "}
            <a
              href="https://manual.makerdao.com/parameter-index/core/param-system-surplus-buffer"
              target="_blank"
              rel="noopener noreferrer"
            >
              More information.
            </a>
          </span>
        </li>
        <li>
          <span className={styles.term}>Total debt:</span>
          <span className={styles.explanation}>
            The total amount of dollar-denominated debt generated from borrowing DAI.
          </span>
        </li>
        <li>
          <span className={styles.term}>Total risky debt:</span>
          <span className={styles.explanation}>
            The total amount of risky dollar-denominated debt generated from borrowing
            DAI volatile assets as collateral.
          </span>
        </li>
        <li>
          <span className={styles.term}>Total stable debt:</span>
          <span className={styles.explanation}>
            The total amount of dollar-denominated debt generated from borrowing DAI
            with other stablecoins as collateral.
          </span>
        </li>
        <li>
          <span className={styles.term}>TVL:</span>
          <span className={styles.explanation}>
            Total Value Locked. The number of tokens used as collateral to borrow DAI.
          </span>
        </li>
        <li>
          <span className={styles.term}>Fee:</span>
          <span className={styles.explanation}>
            The Stability Fee Parameter. The annual percentage fee for borrowing DAI
            using Maker vaults. Maker governance manages and adjusts the Stability Fee
            on different vault types.{" "}
            <a
              href="https://manual.makerdao.com/parameter-index/vault-risk/param-stability-fee"
              target="_blank"
              rel="noopener noreferrer"
            >
              More Information.
            </a>
          </span>
        </li>
        <li>
          <span className={styles.term}>LR:</span>
          <span className={styles.explanation}>
            The Liquidation Ratio Parameter. Controls the maximum level of DAI that can
            be borrowed from a vault in proportion to the value of the underlying
            collateral. Once the collateral ratio falls below the liquidation ratio a
            liquidation event is triggered.{" "}
            <a
              href="https://manual.makerdao.com/parameter-index/vault-risk/param-liquidation-ratio"
              target="_blank"
              rel="noopener noreferrer"
            >
              More Information.
            </a>
          </span>
        </li>
        <li>
          <span className={styles.term}>Dust:</span>
          <span className={styles.explanation}>
            The Debt Floor Parameter. Sets the minimum amount of DAI that can be
            borrowed from an individual vault. This is dependent on collateral type.{" "}
            <a
              href="https://makerdao.world/en/learn/governance/param-debt-floor"
              target="_blank"
              rel="noopener noreferrer"
            >
              More Information.
            </a>
          </span>
        </li>
        <li>
          <span className={styles.term}>Risk premium:</span>
          <span className={styles.explanation}>
            The fee required to compensate the Maker Protocol for the risk associated
            with a collateral type. This is used, with other factors, to generate a
            Stability Fee recommendation for different collateral types. The Risk
            Premium metric is derived from the{" "}
            <a
              href="https://maker.blockanalitica.com/simulations/risk-model/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Block Analitica Risk Model.
            </a>
          </span>
        </li>
        <li>
          <span className={styles.term}>Weighted CR:</span>
          <span className={styles.explanation}>
            The average collateral ratio of all vaults of a particular collateral type.
          </span>
        </li>
        <li>
          <span className={styles.term}>Debt ceiling:</span>
          <span className={styles.explanation}>
            {" "}
            Sets the maximum amount of DAI minting for a specific collateral type.{" "}
            <a
              href="https://manual.makerdao.com/parameter-index/vault-risk/param-debt-ceiling"
              target="_blank"
              rel="noopener noreferrer"
            >
              More Information.
            </a>
          </span>
        </li>
        <li>
          <span className={styles.term}>Liquidation hole:</span>
          <span className={styles.explanation}>
            The Liquidation Limit. Limits the total amount of DAI debt in collateral
            auctions, for a particular collateral type, allowed to be used at any one
            time.{" "}
            <a
              href="https://manual.makerdao.com/parameter-index/collateral-auction/param-local-liquidation-limit"
              target="_blank"
              rel="noopener noreferrer"
            >
              More Information.
            </a>
          </span>
        </li>
        <li>
          <span className={styles.term}>Utilization:</span>
          <span className={styles.explanation}>
            The share of DAI debt already minted out of the maximum debt ceiling.
          </span>
        </li>
        <li>
          <span className={styles.term}>Current OSM price:</span>
          <span className={styles.explanation}>
            The price currently issued by the Oracle Security Module price feed.{" "}
            <a
              href="https://docs.makerdao.com/smart-contract-modules/oracle-module/oracle-security-module-osm-detailed-documentation"
              target="_blank"
              rel="noopener noreferrer"
            >
              More Information.
            </a>
          </span>
        </li>
        <li>
          <span className={styles.term}>Next OSM price:</span>
          <span className={styles.explanation}>
            The OSM Price enacts a one-hours delay. It is updated every hour.{" "}
            <a
              href="https://docs.makerdao.com/smart-contract-modules/oracle-module/oracle-security-module-osm-detailed-documentation"
              target="_blank"
              rel="noopener noreferrer"
            >
              More Information.
            </a>
          </span>
        </li>
        <li>
          <span className={styles.term}>Medianizer price:</span>
          <span className={styles.explanation}>
            The Medianizer is the real-time price Oracle. It updates continuously and is
            triggered by a spread (price deviation between Medianizer and market price).{" "}
            <a
              href="https://docs.makerdao.com/smart-contract-modules/oracle-module/median-detailed-documentation"
              target="_blank"
              rel="noopener noreferrer"
            >
              More Information.
            </a>
          </span>
        </li>
        <li>
          <span className={styles.term}>ILK:</span>
          <span className={styles.explanation}>
            The technical name for a given collateral type
          </span>
        </li>
        <li>
          <span className={styles.term}>Vault ID:</span>
          <span className={styles.explanation}>
            A unique number to identify a specific vault
          </span>
        </li>
        <li>
          <span className={styles.term}>Liq. price:</span>
          <span className={styles.explanation}>
            Liquidation Price. The price at which a liquidation event is triggered.
          </span>
        </li>
        <li>
          <span className={styles.term}>CR:</span>
          <span className={styles.explanation}>
            The Collateralization Ratio. Measures the ratio between the value of the
            underlying collateral and the amount of DAI debt generated from a vault. If
            the CR falls below the Liquidation Ratio (LR) a liquidation event will be
            triggered.
          </span>
        </li>
        <li>
          <span className={styles.term}>Debt:</span>
          <span className={styles.explanation}>
            The amount of dollar-denominated debt generated from borrowing DAI.
          </span>
        </li>
        <li>
          <span className={styles.term}>Protection score:</span>
          <span className={styles.explanation}>
            Estimates the probability of vault liquidations in times of major market
            drawdowns.{" "}
            <a
              href="https://forum.makerdao.com/t/vault-protection-score-model-validation/15633"
              target="_blank"
              rel="noopener noreferrer"
            >
              Methodology.
            </a>
          </span>
        </li>
        <li>
          <span className={styles.term}>Total exposure:</span>
          <span className={styles.explanation}>
            The combined total exposure of all D3M integrations.
          </span>
        </li>
        <li>
          <span className={styles.term}>Total debt ceiling:</span>
          <span className={styles.explanation}>
            The combined debt ceiling of all D3M integrations.
          </span>
        </li>
        <li>
          <span className={styles.term}>Exposure / Surplus buffer:</span>
          <span className={styles.explanation}>
            The total exposure from D3M integrations in relation to the size of the
            Surplus Buffer.
          </span>
        </li>
        <li>
          <span className={styles.term}>Current exposure:</span>
          <span className={styles.explanation}>
            The amount of DAI outstanding and exposed to third-party risks.
          </span>
        </li>
        <li>
          <span className={styles.term}>Borrow rate target:</span>
          <span className={styles.explanation}>
            The borrowing rate that the D3M tries to maintain. The target variable
            borrow rate can be changed by Maker Governance.
          </span>
        </li>
        <li>
          <span className={styles.term}>
            Rates for depositing ETH and borrowing DAI:
          </span>
          <span className={styles.explanation}>
            A proxy used to determine and compare the implied effective borrowing cost
            for DAI on different protocols.
          </span>
        </li>
        <li>
          <span className={styles.term}>DAI auctioned:</span>
          <span className={styles.explanation}>
            The total amount of DAI that has been auctioned.
          </span>
        </li>
        <li>
          <span className={styles.term}>Debt repaid:</span>
          <span className={styles.explanation}>
            The total amount of DAI that has been purchased and burned to cover the
            outstanding debt in liquidated vaults.
          </span>
        </li>
        <li>
          <span className={styles.term}>Penalty collected:</span>
          <span className={styles.explanation}>
            Liquidated vault owners pay penalties that accrue to the system Surplus
            Buffer.{" "}
            <a
              href="https://manual.makerdao.com/parameter-index/vault-risk/param-liquidation-penalty#description"
              target="_blank"
              rel="noopener noreferrer"
            >
              More Information.
            </a>
          </span>
        </li>
        <li>
          <span className={styles.term}>Penalty fee:</span>
          <span className={styles.explanation}>
            {" "}
            Liquidated vault owners have to pay penalties to the Maker Protocol. The
            Penalty Fee parameter controls the additional amount of collateral sold at
            auctions.{" "}
            <a
              href="https://manual.makerdao.com/parameter-index/vault-risk/param-liquidation-penalty"
              target="_blank"
              rel="noopener noreferrer"
            >
              More Information.
            </a>
          </span>
        </li>
        <li>
          <span className={styles.term}>Liquidations:</span>
          <span className={styles.explanation}>
            When a vault collateral ratio (CR) falls below the liquidation ratio (CR),
            the underlying collateral is sold to Keepers to buy back and burn the DAI
            generated from the liquidated vault.{" "}
            <a
              href="https://manual.makerdao.com/parameter-index/vault-risk/param-liquidation-penalty"
              target="_blank"
              rel="noopener noreferrer"
            >
              More Information.
            </a>
          </span>
        </li>
        <li>
          <span className={styles.term}>Liquidated collateral:</span>
          <span className={styles.explanation}>
            The collateral which has been sold to Keepers in liquidated vaults.
          </span>
        </li>
        <li>
          <span className={styles.term}>Collateral seized:</span>
          <span className={styles.explanation}>
            The amount of collateral that has been sold to cover the bad debt and
            Liquidation Penalty.
          </span>
        </li>
        <li>
          <span className={styles.term}>Recovered debt:</span>
          <span className={styles.explanation}>
            The amount of DAI generated and burned from selling collateral and from the
            Liquidation Penalty.
          </span>
        </li>
      </ul>
    </>
  );
}

export default withErrorBoundary(FAQ);
