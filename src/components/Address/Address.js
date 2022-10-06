// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import PropTypes from "prop-types";

function Address(props) {
  const { value } = props;
  const address = value.slice(0, 5) + "..." + value.slice(-5);
  return <>{address}</>;
}

Address.propTypes = {
  value: PropTypes.string.isRequired,
};

export default Address;
