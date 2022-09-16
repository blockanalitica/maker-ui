import { DateTime } from "luxon";

export const parseUTCDateTimestamp = (timestamp) => {
  return DateTime.fromSeconds(timestamp);
};

export const parseUTCDateTime = (date) => {
  return DateTime.fromISO(date);
};
