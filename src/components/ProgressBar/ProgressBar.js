// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import PropTypes from "prop-types";
import React from "react";
import classnames from "classnames";
import { Progress } from "reactstrap";
import styles from "./ProgressBar.module.scss";

function ProgressBar(props) {
  const { className, children, ...rest } = props;

  return (
    <Progress className={classnames(className, styles.progressBar)} {...rest}>
      <small
        className={classnames(
          styles.value,
          "justify-content-center align-items-center d-flex position-absolute w-100"
        )}
      >
        {children}
      </small>
    </Progress>
  );
}

ProgressBar.propTypes = {
  className: PropTypes.any,
  children: PropTypes.any,
};

export default ProgressBar;
