import chai from 'chai'
import Stripe from 'stripe'
import { Entitlement } from '../../src/types'
import {
  getActiveProductPrice,
  getProductFeatures,
  getProductsFeaturesTable,
  getGoodStandingSubscriptions,
} from '../../src/utils'
import {
  STUB_FEATURE_GROUPS,
  STUB_PRODUCTS,
  STUB_ENTITLEMENTS_CONFIG,
} from '../stubs'

const { assert } = chai

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
      ] as Stripe.Subscription[]
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
    it('get all enabled features for a product', () => {
      const result = getProductFeatures(
        'p_A',
        STUB_FEATURE_GROUPS,
        STUB_ENTITLEMENTS_CONFIG
      )

      const target = [
        {
          title: 'Billing plans',
          tooltip: 'Customizable',
          description: 'description',
          uid: 'billing-plans',
        },
      ]
      assert.deepEqual(result, target)
    })
  })

  describe('getProductsFeaturesTable', () => {
    it('prepares features table', () => {
      const result = getProductsFeaturesTable({
        entitlementsConfig: STUB_ENTITLEMENTS_CONFIG,
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
                  description: null,
                  limit: null,
                  value: 'value',
                } as Entitlement,
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
                  enabled: false,
                  description: null,
                  limit: null,
                  value: 'value',
                } as Entitlement,
              },
            ],
          },
        ],
      }
      assert.deepEqual(result, target)
    })
  })
})
