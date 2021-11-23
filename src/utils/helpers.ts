import StripeNode from 'stripe'

/**
 * Disable checkout
 * - If the count of subscribed prices is the same as the prices provided
 * - Then check if all prices have an active subscription
 * - Else set disabled false
 */
export const getCheckoutDisabled = ({
  subscriptions,
  prices,
}: {
  subscriptions: StripeNode.Subscription[]
  prices: string[]
}): boolean => {
  let disabled = true

  let subscribedPriceCount = 0
  const activeSubPriceMap = subscriptions.reduce((memo, subscription) => {
    subscription.items.data.forEach(({ price: { id } }) => {
      if (!memo[id]) {
        subscribedPriceCount += 1
        memo[id] = true
      }
    })
    return memo
  }, {} as { [key: string]: boolean })

  if (subscribedPriceCount === prices.length) {
    for (let priceIx = 0; priceIx < prices.length; priceIx++) {
      const alreadySubscribedToPrice = activeSubPriceMap[prices[priceIx]]
      if (!alreadySubscribedToPrice) {
        disabled = false
        break
      }
    }
  } else {
    disabled = false
  }

  return disabled
}
