// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { withErrorBoundary } from "../../hoc.js";
import styles from "./Changelog.module.scss";

// Split changes by following sections:
//  - "Added" for new features
//  - "Changed" for changes in existing functionality
//  - "Deprecated" for soon-to-be removed features
//  - "Removed" for now removed features
//  - "Fixed" for any bug fixes
//  - "Security" in case of vulnerabilities

function Changelog(props) {
  return (
    <>
      <h1 className="h3 mb-4">Changelog</h1>
      <div className={styles.section}>
        <h3 className={styles.date}>February 2023</h3>
        <h4 className={styles.changeSection}>Added</h4>
        <ul className={styles.changes}>
          <li>
            Improvements to the Total Value Locked (TVL) section on the DeFi page
            <ul>
              <li>
                The TVL chart now includes assets: ETH, WBTC, stETH, rETH, and DAI
              </li>
              <li>
                The TVL chart now includes markets from: Maker, Compound v2, Euler,
                Compound v3, Aave v2, and Aave v3
              </li>
            </ul>
          </li>
          <li>
            Improvements to the Vaults at Risk Simulator on the Vaults at Risk page
            <ul>
              <li>
                Added a “Vaults at Risk” chart to help visualise current ILK debt risks,
                with debt amount on the y-axis and ILKs on the x-axis
              </li>
              <li>
                The chart categorises ILK debt into (i) no risk, (ii) low risk, (iii)
                medium risk, and (iv) high risk
              </li>
              <li>
                Hovering over a particular ILK will provide more detailed information of
                total debt and debt amount at the respective risk levels
              </li>
            </ul>
          </li>
          <li>Added Antalpha under Whales tab</li>
        </ul>
        <h4 className={styles.changeSection}>Changed</h4>
        <ul className={styles.changes}>
          <li>Compound D3M Revenue Calculator Adjustments</li>
          <li>Data pipeline improvement</li>
        </ul>

        <h3 className={styles.date}>January 2023</h3>
        <h4 className={styles.changeSection}>Changed</h4>
        <ul className={styles.changes}>
          <li>Small bug fixes</li>
          <li>Moved D3M to new contract</li>
        </ul>

        <h3 className={styles.date}>November 2022</h3>
        <h4 className={styles.changeSection}>Changed</h4>
        <ul className={styles.changes}>
          <li>Data pipeline improvements</li>
          <li>Small improvements and bug fixes</li>
        </ul>

        <h3 className={styles.date}>October 2022</h3>
        <h4 className={styles.changeSection}>Added</h4>
        <ul className={styles.changes}>
          <li>
            Added new things to the PSM pages
            <ul>
              <li>total amounts at the top of the PSMs page</li>
              <li>showing diff from 1|7|30 days ago on the PSMs page</li>
              <li>
                showing total amount of generate and payback events in graph form for
                1|7|30 days ago on the PSM page
              </li>
              <li>
                showing total DAI supply in a graph form for historical 7|30|90 days on
                the PSM page
              </li>
              <li>
                showing combined total DAI supply in a graph form for historical 7|30|90
                days on the PSMs page
              </li>
              <li>
                showing combined total amount of generate and payback events in graph
                form for 7|30|90 days ago on the PSMs page
              </li>
              <li>showing fee in (tin) and fee out (tout) on PSMs</li>
            </ul>
          </li>
          <li>
            Added new whales (YEARN Treasury, MANA Treasury, MATIC Treasury, YEARN
            Strategies)
          </li>
          <li>Added links to Etherscan, Debank and Zapper on pages where needed</li>
          <li>Added wallet view for showing all vaults from the same owner</li>
          <li>Linking owner addresses to their ENS</li>
          <li>New changelog page for tracking notable changes to this project</li>
        </ul>
        <h4 className={styles.changeSection}>Changed</h4>
        <ul className={styles.changes}>
          <li>
            Imporoved the logic for linking a vault to it's owner when they are using ds
            proxy
          </li>
        </ul>
      </div>
    </>
  );
}

export default withErrorBoundary(Changelog);
