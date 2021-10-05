import {
  Price,
  Product,
  FormData,
  Feature,
  FeatureGroup,
  FeatureTableGroupColumn,
  ProductConfig,
  ProductsFeatureTable,
  Subscription,
  SubscriptionStatus,
} from '../types'

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

export const getProductFeatures = (
  productId: string,
  featureGroups: FeatureGroup[]
): Feature[] =>
  featureGroups.reduce((memo, featureGroup: FeatureGroup) => {
    featureGroup.features &&
      featureGroup.features.forEach((feature: Feature) => {
        const productConfig =
          feature.product_config &&
          feature.product_config[productId] &&
          feature.product_config[productId].enabled
        if (productConfig) {
          memo.push(feature)
        }
      })

    return memo
  }, [])

export const getProductsFeaturesTable = ({
  products,
  featureGroups,
}: {
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
          ...products.reduce((memo, product) => {
            const productConfig = feature.product_config[product.id]
            memo[product.id] = productConfig || null
            return memo
          }, {} as ProductConfig),
        }
      }),
    })),
  }
}

export const getGoodStandingSubscriptions = (
  subscriptions: Subscription[]
): Subscription[] =>
  subscriptions.filter(
    ({ status }: Subscription) =>
      status === SubscriptionStatus.Active.toString() ||
      status === SubscriptionStatus.Trialing.toString()
  )
