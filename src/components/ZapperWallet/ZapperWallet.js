// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import PropTypes from "prop-types";
import CryptoIcon from "../CryptoIcon/CryptoIcon.js";

function ZapperWallet(props) {
  const { name, address, iconOnly, ...rest } = props;
  return (
    <a
      href={`https://zapper.fi/account/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {iconOnly ? <CryptoIcon name="zapper" /> : <>{name ? name : address}</>}
    </a>
  );
}

ZapperWallet.propTypes = {
  name: PropTypes.string,
  address: PropTypes.string,
  iconOnly: PropTypes.bool.isRequired,
};

ZapperWallet.defaultProps = {
  iconOnly: true,
};

export default ZapperWallet;
