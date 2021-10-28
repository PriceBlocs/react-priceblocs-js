import { StripeCustomerAssociation } from '../../src/types'

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

export const STUB_FEATURE_GROUPS = [
  {
    title: 'Payments infrastructure',
    features: [
      {
        title: 'Billing plans',
        tooltip: 'Customizable',
        description: 'description',
        uid: 'billing-plans',
        product_config: {
          p_A: {
            enabled: true,
          },
        },
      },
    ],
  },
  {
    title: 'Security',
    features: [
      {
        title: 'SSO',
        uid: 'sso',
        description: 'description',
        tooltip: 'Google auth',
        product_config: {
          p_A: {
            enabled: true,
          },
        },
      },
    ],
  },
]

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
  entitlements: {
    sso: {
      enabled: true,
    },
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
