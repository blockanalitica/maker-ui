// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";

import PropTypes from "prop-types";

function EtherscanWallet(props) {
  const { name, address } = props;
  return (
    <a
      href={`https://etherscan.io/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {name ? name : address}
    </a>
  );
}

EtherscanWallet.propTypes = {
  name: PropTypes.string,
  address: PropTypes.string.isRequired,
};

export default EtherscanWallet;
