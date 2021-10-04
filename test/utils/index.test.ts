import chai from 'chai'
import { ISubscription } from '../../src/types'
const { assert } = chai
import {
  getGoodStandingSubscriptions,
  getProductsFeaturesTable,
  getProductFeatures,
  getActiveProductPrice,
} from '../../src/utils'

const STUB_PRODUCTS = [
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
const STUB_FEATURE_GROUPS = [
  {
    title: 'Payments infrastructure',
    features: [
      {
        title: 'Billing plans',
        tooltip: 'Customizable',
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

describe('utils', () => {
  describe('getGoodStandingSubscriptions', () => {
    it('prepares data with fallback cancel_url', () => {
      const goodStandingSubs = [
        {
          id: 'sub_123',
          status: 'active',
        },
        {
          id: 'sub_456',
          status: 'trialing',
        },
      ]
      const subscriptions = [
        ...goodStandingSubs,
        {
          id: '789',
          status: 'incomplete',
        },
      ] as ISubscription[]
      const result = getGoodStandingSubscriptions(subscriptions)

      assert.deepEqual(result, goodStandingSubs)
    })
  })

  describe('getActiveProductPrice', () => {
    it('get active price based on query input', () => {
      const result = getActiveProductPrice(STUB_PRODUCTS[0], {
        currency: 'usd',
        interval: 'year',
      })

      const target = {
        id: 'p_A_2',
        currency: 'usd',
        recurring: {
          interval: 'year',
        },
      }

      assert.deepEqual(result, target)
    })
  })

  describe('getProductFeatures', () => {
    it('get all products included in a feature', () => {
      const result = getProductFeatures('p_A', STUB_FEATURE_GROUPS)

      const target = [
        {
          title: 'Billing plans',
          tooltip: 'Customizable',
          product_config: {
            p_A: {
              enabled: true,
            },
          },
        },
        {
          title: 'SSO',
          tooltip: 'Google auth',
          product_config: {
            p_A: {
              enabled: true,
            },
          },
        },
      ]
      assert.deepEqual(result, target)
    })
  })

  describe('getProductsFeaturesTable', () => {
    it('prepares features table', () => {
      const result = getProductsFeaturesTable({
        products: STUB_PRODUCTS,
        featureGroups: STUB_FEATURE_GROUPS,
      })

      const target = {
        header: [
          {
            id: 'p_A',
            title: 'Product A',
          },
        ],
        groups: [
          {
            columns: [
              {
                header: 'Payments infrastructure',
                accessor: 'title',
              },
              {
                accessor: 'p_A',
              },
            ],
            rows: [
              {
                title: {
                  value: 'Billing plans',
                  tooltip: 'Customizable',
                },
                p_A: {
                  enabled: true,
                },
              },
            ],
          },
          {
            columns: [
              {
                header: 'Security',
                accessor: 'title',
              },
              {
                accessor: 'p_A',
              },
            ],
            rows: [
              {
                title: {
                  value: 'SSO',
                  tooltip: 'Google auth',
                },
                p_A: {
                  enabled: true,
                },
              },
            ],
          },
        ],
      }
      assert.deepEqual(result, target)
    })
  })
})
