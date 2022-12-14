// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import PropTypes from "prop-types";
import CryptoIcon from "../CryptoIcon/CryptoIcon.js";

function DebankWallet(props) {
  const { name, address, iconOnly, ...rest } = props;
  return (
    <a
      href={`https://debank.com/profile/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {iconOnly ? <CryptoIcon name="debank" /> : <>{name ? name : address}</>}
    </a>
  );
}

DebankWallet.propTypes = {
  name: PropTypes.string,
  address: PropTypes.string,
  iconOnly: PropTypes.bool.isRequired,
};

DebankWallet.defaultProps = {
  iconOnly: true,
};

export default DebankWallet;
