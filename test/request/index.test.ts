import chai from 'chai'
const { assert } = chai
import { prepareCheckoutData } from '../../src/request'

describe('request', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://priceblocs.com',
      },
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
})
