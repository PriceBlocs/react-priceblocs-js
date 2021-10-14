import utcToZonedTime from "date-fns-tz/utcToZonedTime";
import formatDistance from "date-fns/formatDistance";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import compareAsc from "date-fns/compareAsc";
import compareDesc from "date-fns/compareDesc";

export const TS_FORMAT = {
  MDY: "MMM do, yyyy",
  FULL: "MMMM d, yyyy h:mm aa zz",
  YMDMS: "MMM do, yyyy"
};

const ORDER_BY_OPTIONS = {
  DESC: "desc",
  ASC: "asc"
};

const ORDER_BY_FIELDS = {
  CREATED_AT: "created_at"
};
// If value is a seconds decimal we convert to an integer
export const formatMilliseconds = (value) => {
  const ts = typeof value === "number" ? Number.parseInt(value, 10) : value;
  return `${ts}`.length === 10 ? Math.floor(ts * 1000) : ts;
};

export const getTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

export const toZonedTime = (timestamp) => {
  if (timestamp) {
    return utcToZonedTime(formatMilliseconds(timestamp), getTimezone());
  } else {
    return "";
  }
};

export const timeSinceComputation = (computedAt) => {
  if (computedAt) {
    const zoned = toZonedTime(computedAt, getTimezone());
    const options = {
      includeSeconds: true
    };
    const formatted = formatDistance(new Date(), zoned, options);
    return `${formatted} ago`;
  } else {
    return "";
  }
};

export const formatUTCTime = (timestamp, tsFormat = TS_FORMAT.MDY) => {
  if (timestamp) {
    const zoned = toZonedTime(timestamp);
    return format(zoned, tsFormat);
  } else {
    return "";
  }
};

export const formatTime = (timestamp, tsFormat = TS_FORMAT.MDY) => {
  return format(parseISO(timestamp), tsFormat);
};

export const orderByDate = (
  models,
  field = ORDER_BY_FIELDS.CREATED_AT,
  order = ORDER_BY_OPTIONS.DESC
) => {
  const dates = models.map((model) => ({
    ...model,
    ts: parseISO(model[field])
  }));
  const sorted = dates.sort((a, b) =>
    order === ORDER_BY_OPTIONS.DESC
      ? compareDesc(a.ts, b.ts)
      : compareAsc(a.ts, b.ts)
  );

  return sorted.map(({ ts, ...rest }) => rest);
};
