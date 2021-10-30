import {
  Entitlement,
  EntitlementsConfig,
  StripeCustomerAssociation,
} from '../../src/types'

export const STUB_FETCH_QUERY = {
  customer: {
    associations: ['subscriptions'] as StripeCustomerAssociation[],
  },
}

export const STUB_PRODUCTS = [
  {
    name: 'Product A',
    id: 'p_A',
    prices: [
      {
        id: 'p_A_1',
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
      },
      {
        id: 'p_A_2',
        currency: 'usd',
        recurring: {
          interval: 'year',
        },
      },
      {
        id: 'p_A_3',
        currency: 'gbp',
        recurring: {
          interval: 'year',
        },
      },
    ],
  },
]

const FEATURE_BILLING_PLANS = {
  title: 'Billing plans',
  tooltip: 'Customizable',
  description: 'description',
  uid: 'billing-plans',
}

const FEATURE_SSO = {
  title: 'SSO',
  uid: 'sso',
  description: 'description',
  tooltip: 'Google auth',
}

export const STUB_FEATURE_GROUPS = [
  {
    title: 'Payments infrastructure',
    features: [FEATURE_BILLING_PLANS],
  },
  {
    title: 'Security',
    features: [FEATURE_SSO],
  },
]

export const STUB_ENTITLEMENTS_CONFIG = {
  [FEATURE_BILLING_PLANS.uid]: {
    p_A: {
      enabled: true,
      value: 'value',
      description: null,
      limit: null,
    } as Entitlement,
  },
  [FEATURE_SSO.uid]: {
    p_A: {
      enabled: true,
      value: 'value',
      description: null,
      limit: null,
    } as Entitlement,
  },
} as EntitlementsConfig

export const STUB_USER_ENTITLEMENTS = {
  sso: {
    enabled: true,
  },
}

export const STUB_VALUES = {
  admin: {
    clientKey: 'clientKey',
  },
  customer: {
    id: 'cus_123',
  },
  products: [
    {
      id: 'p_A',
      name: 'Product A',
    },
  ],
  entitlements: STUB_USER_ENTITLEMENTS,
  config: {
    entitlements: STUB_ENTITLEMENTS_CONFIG,
  },
  featureGroups: STUB_FEATURE_GROUPS,
  form: {
    currencies: ['usd'],
    currency: 'usd',
    intervals: ['month'],
    interval: 'month',
    highlight: {},
    theme: {},
    presentation: {},
    checkout: {
      items: [
        {
          price: {
            id: 'p_A_1',
          },
        },
      ],
    },
  },
}
