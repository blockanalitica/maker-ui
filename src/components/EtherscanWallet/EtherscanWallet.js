// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import PropTypes from "prop-types";
import CryptoIcon from "../CryptoIcon/CryptoIcon.js";

function EtherscanWallet(props) {
  const { name, address, iconOnly, ...rest } = props;
  return (
    <a
      href={`https://etherscan.io/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {iconOnly ? <CryptoIcon name="etherscan" /> : <>{name ? name : address}</>}
    </a>
  );
}

EtherscanWallet.propTypes = {
  name: PropTypes.string,
  address: PropTypes.string,
  iconOnly: PropTypes.bool.isRequired,
};

EtherscanWallet.defaultProps = {
  iconOnly: true,
};

export default EtherscanWallet;
