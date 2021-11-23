import chai from 'chai'
import StripeNode from 'stripe'
import { getCheckoutDisabled } from '../../src/utils/helpers'
const { assert } = chai

describe('utils/helpers', () => {
  describe('getCheckoutDisabled', () => {
    it('false - when prices count is different', () => {
      const input = {
        subscriptions: [
          {
            items: {
              data: [
                {
                  price: {
                    id: 'p_A_1',
                  },
                },
              ],
            },
          },
        ] as StripeNode.Subscription[],
        prices: ['p_A_1', 'p_A_2'],
      }

      const result = getCheckoutDisabled(input)
      assert.isFalse(result)
    })

    it('false - when prices count is same but subscribed prices are different', () => {
      const input = {
        subscriptions: [
          {
            items: {
              data: [
                {
                  price: {
                    id: 'p_A_1',
                  },
                },
              ],
            },
          },
        ] as StripeNode.Subscription[],
        prices: ['p_A_2'],
      }

      const result = getCheckoutDisabled(input)
      assert.isFalse(result)
    })

    it('true - when prices count is same and subscribed prices are same', () => {
      const input = {
        subscriptions: [
          {
            items: {
              data: [
                {
                  price: {
                    id: 'p_A_1',
                  },
                },
              ],
            },
          },
        ] as StripeNode.Subscription[],
        prices: ['p_A_1'],
      }

      const result = getCheckoutDisabled(input)
      assert.isTrue(result)
    })
  })
})
