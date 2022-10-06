// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React from "react";

function InfoIcon(props) {
  const { size, ...rest } = props;
  return (
    <span {...rest}>
      <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: size }} />
    </span>
  );
}

InfoIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

InfoIcon.defaultProps = {
  size: "inherit",
};

export default InfoIcon;
