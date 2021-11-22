import {
  Price,
  Product,
  FormData,
  Feature,
  FeatureGroup,
  FeatureTableGroupColumn,
  ProductsFeatureTable,
  SubscriptionStatus,
  EntitlementsConfig,
  Entitlement,
  PriceBlocsConfigProps,
} from '../types'
import Stripe from 'stripe'
import { merge } from 'lodash'
import { CONFIG_DEFAULTS } from '../constants'

type QueryInput = Pick<FormData, 'currency' | 'interval'>

export const getActiveProductPrice = (
  product: Product,
  { currency, interval }: QueryInput
): Price => {
  return product.prices.find((price: Price) => {
    let match = false
    const currencyMatch = price.currency === currency
    const intervalMatch = Boolean(
      price.recurring && price.recurring.interval === interval
    )

    if (currency && interval) {
      match = currencyMatch && intervalMatch
    } else if (currency) {
      match = currencyMatch
    } else if (interval) {
      match = intervalMatch
    }

    return match
  })
}

export const getSubscriptionItemForPrice = (
  price: string,
  subscription: Stripe.Subscription
) => subscription.items.data.find((item) => item.price.id === price)

export const getProductFeatures = (
  productId: string,
  featureGroups: FeatureGroup[],
  entitlementsConfig: EntitlementsConfig
): Feature[] =>
  featureGroups.reduce((memo, featureGroup: FeatureGroup) => {
    featureGroup.features &&
      featureGroup.features.forEach((feature: Feature) => {
        const enabled =
          entitlementsConfig &&
          entitlementsConfig[feature.uid] &&
          entitlementsConfig[feature.uid][productId] &&
          entitlementsConfig[feature.uid][productId].enabled
        if (enabled) {
          memo.push(feature)
        }
      })

    return memo
  }, [])

export const getProductsFeaturesTable = ({
  entitlementsConfig,
  products,
  featureGroups,
}: {
  entitlementsConfig: EntitlementsConfig
  products: Product[]
  featureGroups: FeatureGroup[]
}): ProductsFeatureTable => {
  return {
    header: products.map(({ name, id }) => ({
      id,
      title: name,
    })),
    groups: featureGroups.map((featureGroup) => ({
      columns: products.reduce(
        (memo, product) => {
          memo.push({ accessor: product.id } as FeatureTableGroupColumn)
          return memo
        },
        [
          {
            header: featureGroup.title,
            accessor: 'title',
          },
        ] as FeatureTableGroupColumn[]
      ),
      rows: featureGroup.features.map((feature) => {
        return {
          title: {
            value: feature.title,
            tooltip: feature.tooltip || null,
          },
          ...products.reduce(
            (memo, product) => {
              const entitlement =
                entitlementsConfig &&
                entitlementsConfig[feature.uid] &&
                entitlementsConfig[feature.uid][product.id]
              memo[product.id] = entitlement || null
              return memo
            },
            {} as {
              [key: string]: Entitlement
            }
          ),
        }
      }),
    })),
  }
}

export const getGoodStandingSubscriptions = (
  subscriptions: Stripe.Subscription[]
): Stripe.Subscription[] =>
  subscriptions.filter(
    ({ status }: Stripe.Subscription) =>
      status === SubscriptionStatus.Active.toString() ||
      status === SubscriptionStatus.Trialing.toString()
  )

export const getConfig = (config: PriceBlocsConfigProps) =>
  merge(CONFIG_DEFAULTS, config)
