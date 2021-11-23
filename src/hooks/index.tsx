import { useEffect, useState, useMemo, useCallback } from 'react'
import { usePriceBlocsContext } from 'src'
import {
  getActiveProductPrice,
  getGoodStandingSubscriptions,
  getSubscriptionItemForPrice,
} from 'src/utils'
import {
  UseCheckoutCart,
  UseCheckoutCartProps,
  UsePreviewInvoiceProps,
} from 'src/types'
import { getCheckoutDisabled } from 'src/utils/helpers'

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

export const useGoodStandingSubscriptions = () => {
  const { values } = usePriceBlocsContext()

  return values && values.customer && values.customer.subscriptions
    ? getGoodStandingSubscriptions(values.customer.subscriptions)
    : []
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

/**
 * - Usually we only want to allow a customer to subscribe to one price at a time
 * - To prevent subscription to duplicate prices we can check if all of the prices
 *  within current checkout cart are present in any of the active subscriptions
 * - If all checkout cart prices are also present in an active subscription then
 * Want to conditionally enable / disable checkout updates
 * If subscription present - will preview then update
 * Else will create a new one
 */
export const useCheckoutCart = (props?: UseCheckoutCartProps) => {
  const result = {
    previewable: false,
    subscriptions: [],
    checkout: { prices: [] },
    disabled: true,
  } as UseCheckoutCart

  const { values } = usePriceBlocsContext()
  const customer = values && values.customer && values.customer
  const items =
    values && values.form && values.form.checkout && values.form.checkout.items

  /**
   * Price usage hierarchy
   * 1. prices provided via checkout props
   * 2. prices within context i.e. values.form.checkout.items
   */
  const checkoutPrices = items ? items.map(({ price: { id } }) => id) : []
  const prices = props && props.prices ? props.prices : checkoutPrices
  result.checkout = {
    prices,
  }

  /**
   * Disable checkout if all prices are the same:
   * - price id count is same price ids in the cart are the same as the sub
   * If all of the current checkout cart prices are already subscribed to
   * then we disable checkout
   */
  let checkoutDisabled = false
  const subscriptions =
    customer && customer.subscriptions && getGoodStandingSubscriptions
      ? getGoodStandingSubscriptions(customer.subscriptions)
      : []
  result.subscriptions = subscriptions
  const subsCount = result.subscriptions.length
  const hasActiveSubs = subsCount > 0
  result.previewable = hasActiveSubs
  if (hasActiveSubs) {
    checkoutDisabled = getCheckoutDisabled({
      subscriptions,
      prices,
    })
  }

  const hasPrices = prices.length > 0
  if (subsCount > 1) {
    console.warn('Multiple good standing subscriptions available for preview.')
  }
  result.disabled = checkoutDisabled || !hasPrices

  return result
}

export const usePreviewInvoice = (props: UsePreviewInvoiceProps) => {
  const { subscription, prices } = props
  const { previewInvoice, values } = usePriceBlocsContext()
  const [data, setData] = useState(null)
  const [previewed, setPreviewed] = useState(null)
  const [loading, setLoading] = useState(false)
  const items =
    values && values.form && values.form.checkout && values.form.checkout.items

  const itemPrices = useMemo(
    () => (Array.isArray(items) ? items.map(({ price: { id } }) => id) : []),
    [items]
  )
  const previewItems = useMemo(
    () => (Array.isArray(prices) && prices.length > 0 ? prices : itemPrices),
    [prices, itemPrices]
  )

  const getPreview = useCallback(async () => {
    setLoading(true)
    if (!previewed) {
      setPreviewed(true)
    }
    const previewData = await previewInvoice({
      items: previewItems,
      subscription,
    })
    setData(previewData)
    setLoading(false)
  }, [previewItems, subscription, previewInvoice])

  useEffect(() => {
    if (!data && !loading && !previewed) {
      getPreview()
    }
  }, [data, loading, previewItems, subscription, getPreview, previewed])

  return {
    getPreview,
    data,
    loading,
    setLoading,
  }
}
