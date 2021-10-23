import { usePriceBlocsContext } from 'src'
import {
  getActiveProductPrice,
  getGoodStandingSubscriptions,
  getSubscriptionItemForPrice,
} from 'src/utils'

export const useActiveProductPrice = (productId: string) => {
  const {
    values: {
      products,
      form: { currency, interval },
    },
  } = usePriceBlocsContext()
  const product = products.find(({ id }) => id === productId)

  return product && getActiveProductPrice(product, { currency, interval })
}

export const useSubscriptionItemForPrice = (price: string) => {
  const {
    values: { customer },
  } = usePriceBlocsContext()

  const subscription =
    customer && customer.subscriptions
      ? getGoodStandingSubscriptions(customer.subscriptions)[0]
      : null

  return subscription ? getSubscriptionItemForPrice(price, subscription) : null
}

export const useEntitlement = (featureUid: string) => {
  const {
    values: { entitlements },
  } = usePriceBlocsContext()
  return entitlements[featureUid]
}

export const useFeature = (featureUid: string) => {
  const {
    values: { featureGroups },
  } = usePriceBlocsContext()
  let feature
  for (
    let featureGroupIx = 0;
    featureGroupIx < featureGroups.length;
    featureGroupIx++
  ) {
    const group = featureGroups[featureGroupIx]
    feature = group.features.find(({ uid }) => uid === featureUid)
    if (feature) {
      break
    }
  }

  return feature
}
