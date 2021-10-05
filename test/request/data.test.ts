import chai from 'chai'
const { assert } = chai
import {
  prepareCheckoutData,
  getAuthHeaders,
  getCustomerParams,
  prepareFetchConfigData,
  getBillingData,
  getPreviewInvoiceData,
  getUpdateSubscriptionData,
} from '../../src/request/data'
import { STUB_FETCH_QUERY } from '../stubs'

describe('request/data', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://priceblocs.com',
      },
    })
  })

  describe('getAuthHeaders', () => {
    it('prepares auth headers', () => {
      const result = getAuthHeaders('api_key')
      const target = {
        'Content-Type': 'application/json',
        Authorization: `Bearer api_key`,
      }
      assert.deepEqual(result, target)
    })
  })

  describe('getCustomerParams', () => {
    it('returns customer id as customer when present', () => {
      const result = getCustomerParams({
        id: 'cus_123',
      })
      const target = {
        customer: 'cus_123',
      }

      assert.deepEqual(result, target)
    })
    it('returns email as customer_email when present', () => {
      const result = getCustomerParams({
        email: 'customer@email.com',
      })
      const target = {
        customer_email: 'customer@email.com',
      }

      assert.deepEqual(result, target)
    })
  })

  describe('prepareFetchConfigData', () => {
    it('returns customer with data when present when present', () => {
      const result = prepareFetchConfigData({
        customer: 'cus_123',
        email: 'customer@email.com',
        prices: ['p_A_1'],
        query: STUB_FETCH_QUERY,
      })
      const target = {
        customer: 'cus_123',
        prices: ['p_A_1'],
        query: STUB_FETCH_QUERY,
      }

      assert.deepEqual(result, target)
    })
    it('returns customer_email with data when present', () => {
      const result = prepareFetchConfigData({
        customer_email: 'customer@email.com',
        email: 'customer@email.com',
        prices: ['p_A_1'],
        query: STUB_FETCH_QUERY,
      })
      const target = {
        customer_email: 'customer@email.com',
        prices: ['p_A_1'],
        query: STUB_FETCH_QUERY,
      }

      assert.deepEqual(result, target)
    })

    it('returns email with data when present', () => {
      const result = prepareFetchConfigData({
        email: 'customer@email.com',
        prices: ['p_A_1'],
        query: STUB_FETCH_QUERY,
      })
      const target = {
        email: 'customer@email.com',
        prices: ['p_A_1'],
        query: STUB_FETCH_QUERY,
      }

      assert.deepEqual(result, target)
    })
  })

  describe('prepareCheckoutData', () => {
    describe('single price', () => {
      it('prepares data with fallback cancel_url', () => {
        const checkout = 'price_123'
        const props = {
          api_key: 'api_key',
          success_url: 'success_url',
          return_url: 'return_url',
          customer: {
            id: 'cus_123',
          },
        }
        const result = prepareCheckoutData(checkout, props)

        const target = {
          prices: ['price_123'],
          cancel_url: 'http://priceblocs.com',
          success_url: 'success_url',
          return_url: 'return_url',
          customer: 'cus_123',
        }

        assert.deepEqual(result, target)
      })
    })

    describe('checkout config', () => {
      it('prepares data with fallback cancel_url', () => {
        const checkout = {
          prices: ['price_123', 'price_456'],
        }
        const props = {
          api_key: 'api_key',
          success_url: 'success_url',
          return_url: 'return_url',
          customer: {
            id: 'cus_123',
          },
        }
        const result = prepareCheckoutData(checkout, props)

        const target = {
          prices: ['price_123', 'price_456'],
          cancel_url: 'http://priceblocs.com',
          success_url: 'success_url',
          return_url: 'return_url',
          customer: 'cus_123',
        }

        assert.deepEqual(result, target)
      })
    })
  })

  describe('getBillingData', () => {
    it('billing props takes precendece over initial props', () => {
      const configProps = {
        customer: {
          id: 'cus_123',
        },
        return_url: 'props_return_url',
      }
      const callProps = {
        customer: 'cus_456',
        return_url: 'billing_props_return_url',
      }
      const result = getBillingData(configProps, callProps)
      const target = {
        customer: 'cus_456',
        return_url: 'billing_props_return_url',
      }

      assert.deepEqual(result, target)
    })
    it('fallback to initial props', () => {
      const configProps = {
        customer: {
          id: 'cus_123',
        },
        return_url: 'props_return_url',
      }
      const callProps = {}
      const result = getBillingData(configProps, callProps)
      const target = {
        customer: 'cus_123',
        return_url: 'props_return_url',
      }

      assert.deepEqual(result, target)
    })

    it('return url falls back to current location', () => {
      const configProps = {
        customer: {
          id: 'cus_123',
        },
      }
      const callProps = {}
      const result = getBillingData(configProps, callProps)
      const target = {
        customer: 'cus_123',
        return_url: 'http://priceblocs.com',
      }

      assert.deepEqual(result, target)
    })

    it('throws an error when customer is null', () => {
      const configProps = {}
      const callProps = {}
      assert.throws(
        () => getBillingData(configProps, callProps),
        'A valid customer must be provided to this action.'
      )
    })
  })

  describe('getPreviewInvoiceData', () => {
    it('returns provided subscription and items', () => {
      const configProps = {
        customer: {
          id: 'cus_123',
        },
        values: {
          form: {
            checkout: {
              items: [] as string[],
            },
          },
        },
      }
      const callProps = {
        customer: 'cus_456',
        subscription: '123',
        items: [
          {
            price: {
              id: 'p_A_1',
            },
          },
        ],
      }
      const result = getPreviewInvoiceData(configProps, callProps)
      const target = {
        customer: 'cus_456',
        items: [
          {
            price: {
              id: 'p_A_1',
            },
          },
        ],
        subscription: '123',
      }

      assert.deepEqual(result, target)
    })

    it('returns initial props customer and checkout items', () => {
      const configProps = {
        customer: {
          id: 'cus_123',
        },
        values: {
          form: {
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
        },
      }
      const callProps = {
        subscription: '123',
      }
      const result = getPreviewInvoiceData(configProps, callProps)
      const target = {
        customer: 'cus_123',
        items: [
          {
            price: {
              id: 'p_A_1',
            },
          },
        ],
        subscription: '123',
      }

      assert.deepEqual(result, target)
    })
  })

  describe('getUpdateSubscriptionData', () => {
    it('returns subscription update params for provided values', () => {
      const configProps = {
        customer: {
          id: 'cus_123',
        },
      }
      const callProps = {
        id: 'sub_123',
        customer: 'cus_456',
        proration_date: 1234567,
        items: [
          {
            id: 'si_123',
            price: 'p_A_1',
          },
        ],
      }
      const result = getUpdateSubscriptionData(configProps, callProps)

      const target = {
        id: 'sub_123',
        customer: 'cus_456',
        proration_date: 1234567,
        items: [
          {
            id: 'si_123',
            price: 'p_A_1',
          },
        ],
      }

      assert.deepEqual(result, target)
    })

    it('returns subscription update params for initial values', () => {
      const configProps = {
        customer: {
          id: 'cus_123',
        },
      }
      const callProps = {
        id: 'sub_123',
        proration_date: 1234567,
        items: [
          {
            id: 'si_123',
            price: 'p_A_1',
          },
        ],
      }
      const result = getUpdateSubscriptionData(configProps, callProps)

      const target = {
        id: 'sub_123',
        customer: 'cus_123',
        proration_date: 1234567,
        items: [
          {
            id: 'si_123',
            price: 'p_A_1',
          },
        ],
      }

      assert.deepEqual(result, target)
    })
  })
})
