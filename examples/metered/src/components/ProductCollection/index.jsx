import React, { useState, useMemo } from 'react'
import { usePriceBlocsContext } from '@priceblocs/react-priceblocs-js'
import CheckoutButton from '@components/CheckoutButton'
import Loader from './Loader'
import MeteredPriceShow from '@components/MeteredPriceShow'
import MeteredProductCard from '@components/MeteredProductCard'

const Wrapper = ({ children }) => (
  <div className="w-full max-w-7xl mx-auto py-8 px-4 lg:px-8 ">{children}</div>
)
const BILLING_SCHEME_TIERED = 'tiered'
const RECURRING_USAGE_METERED = 'metered'
const Content = () => {
  const [activePriceId, setActivePriceId] = useState(null)
  const {
    values: { products },
  } = usePriceBlocsContext()

  const { metered, activePrice } = useMemo(
    () =>
      products.reduce(
        (memo, product) => {
          for (let priceIx = 0; priceIx < product.prices.length; priceIx++) {
            const price = product.prices[priceIx]
            if (price.id === activePriceId) {
              memo.activePrice = price
            }
            if (price.billing_scheme === BILLING_SCHEME_TIERED) {
              memo.tiered.push(product)
              break
            } else if (
              price.recurring &&
              price.recurring.usage_type === RECURRING_USAGE_METERED
            ) {
              memo.metered.push(product)
              break
            } else {
              memo.licensed.push(product)
              break
            }
          }

          return memo
        },
        { metered: [], tiered: [], licensed: [], activePrice: null }
      ),
    [products, activePriceId]
  )

  return activePrice ? (
    <MeteredPriceShow price={activePrice} setActivePriceId={setActivePriceId} />
  ) : (
    <div className="w-full">
      <div className="rounded-tr rounded-tl bg-gray-200 overflow-hidden divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px shadow">
        {metered.map((product, productIdx) => (
          <MeteredProductCard
            key={product.id}
            index={productIdx}
            product={product}
            setActivePriceId={setActivePriceId}
          />
        ))}
      </div>
      <div className="rounded-bl rounded-br bg-white p-4 border border-gray-200 shadow">
        <div className="sm:flex sm:items-center sm:justify-between">
          <p className="mv-4 pb-4 sm:pb-0 sm:mb-0 text-center text-sm text-gray-500 sm:mt-0 sm:text-left">
            Select your API's
          </p>
          <div>
            <CheckoutButton copy={{ value: 'Enable APIs' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

const ProductCollection = () => {
  const { loading, values } = usePriceBlocsContext()

  return loading ? (
    <Wrapper>
      <Loader />
    </Wrapper>
  ) : values ? (
    <Wrapper>
      <Content />
    </Wrapper>
  ) : null
}

export default ProductCollection
