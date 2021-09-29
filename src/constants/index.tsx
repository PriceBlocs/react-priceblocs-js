export const URLS = {
  PRICING: `${process.env.API_ROOT}/v1/config/pricing`,
  CHECKOUT: `${process.env.API_ROOT}/v1/config/checkout`,
  BILLING: `${process.env.API_ROOT}/v1/config/billing`,
}

const POST = 'POST'
const GET = 'GET'

export const METHODS = {
  POST,
  GET,
}

const DAY = 'day'
const WEEK = 'week'
const MONTH = 'month'
const YEAR = 'year'

export const RECURRING_INTERVALS = {
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

export const INTERVAL_LABELS_MAP = {
  one_time: 'once',
  [RECURRING_INTERVALS.DAY]: 'daily',
  [RECURRING_INTERVALS.WEEK]: 'weekly',
  [RECURRING_INTERVALS.MONTH]: 'monthly',
  [RECURRING_INTERVALS.YEAR]: 'yearly',
}

export const INTERVAL_SHORTHAND_MAP = {
  [RECURRING_INTERVALS.DAY]: 'day',
  [RECURRING_INTERVALS.WEEK]: 'wk',
  [RECURRING_INTERVALS.MONTH]: 'mo',
  [RECURRING_INTERVALS.YEAR]: 'mo',
}
