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
      <h1 className="h3 mb-4">changelog</h1>
      <div className={styles.section}>
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
            </ul>
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
