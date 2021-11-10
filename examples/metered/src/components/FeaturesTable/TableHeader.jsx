import React from 'react'
import Toggle from '@components/Toggle'
import FormattedPriceHeader from '@components/FormattedPriceHeader'
import CheckoutButton from '@components/CheckoutButton'
import classNames from '@utils/classNames'
import {
  usePriceBlocsContext,
  getActiveProductPrice,
} from '@priceblocs/react-priceblocs-js'
import { getPriceCheckoutButtonProps } from '../../utils/checkout'

const TableHeader = ({ header }) => {
  const {
    values: {
      products,
      form: { currency, interval, highlight },
    },
  } = usePriceBlocsContext()

  const headerCount = header.length
  const commonWidth = `w-1/${headerCount}`

  return (
    <thead>
      <tr className="ph3 bg-white">
        <th className={`${commonWidth}`}>
          <Toggle
            customClasses={{
              container: 'flex flex-col items-center justify-center space-y-2',
            }}
          />
        </th>
        {header &&
          header.map(({ title, id }, headerIx) => {
            const product = products.find((product) => product.id === id)
            const price = getActiveProductPrice(product, {
              currency,
              interval,
            })

            const isEmphasized = highlight.product === id

            const checkoutProps = getPriceCheckoutButtonProps({
              checkout: { prices: [price.id] },
              product,
              price,
            })

            return (
              <th
                key={headerIx}
                className={classNames(
                  `${commonWidth} pb-4 px-6 text-lg leading-6 font-medium text-gray-900 dark:text-gray-200 text-left`,
                  {
                    'bg-white': !isEmphasized,
                  }
                )}
              >
                <span>{title}</span>
                <FormattedPriceHeader price={price} />
                {price && price.id && (
                  <div className="py-2">
                    <CheckoutButton {...checkoutProps} />
                  </div>
                )}
              </th>
            )
          })}
      </tr>
    </thead>
  )
}

export default TableHeader
