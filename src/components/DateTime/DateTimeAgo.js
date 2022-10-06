// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import PropTypes from "prop-types";
import { DateTime } from "luxon";
import { UncontrolledTooltip } from "reactstrap";
import _ from "lodash";

function DateTimeAgo(props) {
  let { dateTime, showTime, showDate, format, ...rest } = props;

  if (!format) {
    format = "LLL dd, yyyy HH:mm:ss";
    if (!showTime) {
      format = "LLL dd, yyyy";
    }
    if (!showDate) {
      format = "HH:mm:ss";
    }
  }

  const value = dateTime.toRelative({ locale: "en" });

  const id = _.uniqueId("datetimeago-");
  return (
    <>
      <span id={id} {...rest}>
        {value}
      </span>
      <UncontrolledTooltip placement="bottom" target={id}>
        {dateTime.toFormat(format)}
      </UncontrolledTooltip>
    </>
  );
}

DateTimeAgo.propTypes = {
  dateTime: PropTypes.instanceOf(DateTime),
  showTime: PropTypes.bool.isRequired,
  showDate: PropTypes.bool.isRequired,
  format: PropTypes.string,
};

DateTimeAgo.defaultProps = {
  showTime: true,
  showDate: true,
};

export default DateTimeAgo;
