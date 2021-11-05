import { usePriceBlocsContext } from 'src'
import {
  getActiveProductPrice,
  getGoodStandingSubscriptions,
  getSubscriptionItemForPrice,
} from 'src/utils'

export const useActiveProductPrice = (productId: string) => {
  const { values } = usePriceBlocsContext()
  const product = values && values.products.find(({ id }) => id === productId)

  return (
    product &&
    getActiveProductPrice(product, {
      currency: values.form.currency,
      interval: values.form.interval,
    })
  )
}

export const useSubscriptionItemForPrice = (price: string) => {
  const { values } = usePriceBlocsContext()

  const subscription =
    values && values.customer && values.customer.subscriptions
      ? getGoodStandingSubscriptions(values.customer.subscriptions)[0]
      : null

  return subscription ? getSubscriptionItemForPrice(price, subscription) : null
}

export const useEntitlement = (featureUid: string) => {
  const { values } = usePriceBlocsContext()

  return values && values.entitlements && values.entitlements[featureUid]
    ? values.entitlements[featureUid]
    : { enabled: false }
}

export const useFeature = (featureUid: string) => {
  const { values } = usePriceBlocsContext()
  let feature
  if (values && values.featureGroups) {
    for (
      let featureGroupIx = 0;
      featureGroupIx < values.featureGroups.length;
      featureGroupIx++
    ) {
      const group = values.featureGroups[featureGroupIx]
      feature = group.features.find(({ uid }) => uid === featureUid)
      if (feature) {
        break
      }
    }
  }

  return feature
}
