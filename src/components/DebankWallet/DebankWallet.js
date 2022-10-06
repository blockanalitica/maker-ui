// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";

function DebankWallet(props) {
  const { name, address } = props;
  return (
    <a
      href={`https://debank.com/profile/${address}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {name ? name : address}
    </a>
  );
}

export default DebankWallet;
