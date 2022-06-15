export const URLS = {
  PRICING: `${process.env.API_ROOT}/v1/config/pricing`,
  CHECKOUT: `${process.env.API_ROOT}/v1/config/checkout`,
  INVOICE_PREVIEW: `${process.env.API_ROOT}/v1/config/invoice/preview`,
  SUBSCRIPTIONS: `${process.env.API_ROOT}/v1/config/subscriptions`,
  BILLING: `${process.env.API_ROOT}/v1/config/billing`,
  USAGE: `${process.env.API_ROOT}/v1/config/usage`,
}

const POST = 'POST'
const GET = 'GET'
const PUT = 'PUT'
const DELETE = 'DELETE'

export const METHODS = {
  POST,
  GET,
  PUT,
  DELETE,
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

export const SESSION_FIELDS = [
  'shipping_worldwide',
  'success_url',
  'cancel_url',
  'payment_method_types',
  'discounts',
  'allow_promotion_codes',
  'billing_address_collection',
  'shipping_address_collection',
  'submit_type',
  'consent_collection',
  'after_expiration',
  'expires_at',
  'adjustable_quantity',
  'tax_rates',
  'dynamic_tax_rates',
  'automatic_tax',
  'client_reference_id',
  'tax_id_collection',
  'shipping_options',
  'payment_intent_data',
  'trial_period_days',
  'trial_end',
  'metadata',
]

export const CONFIG_FIELDS = [
  'id',
  'prices',
  'sessions',
  'query',
  'presentation',
  'entitlements',
  'features',
  'contactless',
  /**
   * TODO: Should spread SESSION_INPUT
   */
  'shipping_worldwide',
  'success_url',
  'cancel_url',
  'payment_method_types',
  'discounts',
  'allow_promotion_codes',
  'billing_address_collection',
  'shipping_address_collection',
  'submit_type',
  'consent_collection',
  'after_expiration',
  'expires_at',
  'adjustable_quantity',
  'tax_rates',
  'dynamic_tax_rates',
  'automatic_tax',
  'client_reference_id',
  'tax_id_collection',
  'shipping_options',
  'payment_intent_data',
  'trial_period_days',
  'trial_end',
  'metadata',
]

export const CONFIG_DEFAULTS = {
  debug: false,
  fetch: {
    on_mount: true,
    on_customer_change: true,
  },
}
