// SPDX-FileCopyrightText: © 2022 Dai Foundation <www.daifoundation.org>
//
// SPDX-License-Identifier: Apache-2.0

import { DateTime } from "luxon";

export const parseUTCDateTimestamp = (timestamp) => {
  return DateTime.fromSeconds(timestamp);
};

export const parseUTCDateTime = (date) => {
  return DateTime.fromISO(date);
};
