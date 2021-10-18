import React from 'react'
import {
  ChatIcon,
  MailIcon,
  VideoCameraIcon,
  MicrophoneIcon,
} from '@heroicons/react/outline'
import {
  getActiveProductPrice,
  usePriceBlocsContext,
} from '@priceblocs/react-priceblocs-js'
import { Switch } from '@headlessui/react'
import FormattedPriceHeader from '@components/FormattedPriceHeader'
import { classNames } from '@utils/ui'

const Toggle = ({ enabled, onChange }) => {
  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      className="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <span className="sr-only">Enable API</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bg-white w-full h-full rounded-md"
      />
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'bg-blue-600' : 'bg-gray-200',
          'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200'
        )}
      />
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200'
        )}
      />
    </Switch>
  )
}

const PRODUCT_ICON_MAP = {
  Video: {
    icon: VideoCameraIcon,
    iconForeground: 'text-red-700',
    iconBackground: 'bg-red-50',
  },
  Messaging: {
    icon: ChatIcon,
    iconForeground: 'text-purple-700',
    iconBackground: 'bg-purple-50',
  },
  Voice: {
    icon: MicrophoneIcon,
    iconForeground: 'text-yellow-700',
    iconBackground: 'bg-yellow-50',
  },
  Conversations: {
    icon: MailIcon,
    iconForeground: 'text-blue-700',
    iconBackground: 'bg-blue-50',
  },
  // Add-ons
  Email: {
    icon: MailIcon,
    iconForeground: 'text-blue-700',
    iconBackground: 'bg-blue-50',
  },
}

const MeteredProductCard = ({ product, setActivePriceId }) => {
  const {
    values: {
      form: {
        currency,
        checkout: { items },
      },
    },
    checkoutAdd,
    checkoutRemove,
  } = usePriceBlocsContext()

  const price = getActiveProductPrice(product, { currency })
  const priceId = price && price.id
  const { index, name, description } = product
  const inCheckout = Boolean(items.find((item) => item.price.id === priceId))

  const first = index === 0
  const second = index === 1
  const iconConfig = PRODUCT_ICON_MAP[name]

  const isSubscribed = Boolean(price.subscription && product.subscription)

  const toggleProps = {
    enabled: inCheckout,
    onChange: () => {
      inCheckout ? checkoutRemove(priceId) : checkoutAdd(priceId)
    },
  }

  const showUsage = isSubscribed ? () => setActivePriceId(priceId) : () => {}

  return (
    <div
      className={classNames(
        first ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
        second ? 'sm:rounded-tr-lg' : '',
        'relative group bg-white p-6'
      )}
    >
      <div className="flex justify-between">
        {iconConfig && iconConfig.icon && (
          <span
            className={classNames(
              iconConfig.iconBackground,
              iconConfig.iconForeground,
              'rounded-lg inline-flex p-3 ring-4 ring-white'
            )}
          >
            <iconConfig.icon className="h-6 w-6" aria-hidden="true" />
          </span>
        )}
        <div className="flex items-center">
          <Toggle {...toggleProps} />
        </div>
      </div>
      <div
        className={classNames(
          'mt-4 space-y-2',
          isSubscribed ? 'cursor-pointer' : ''
        )}
        onClick={showUsage}
      >
        <div className="flex flex-col sm:flex-row justify-between">
          <h3 className="text-2xl font-bold pb-2 sm:pb-0">
            <span className="focus:outline-none">{name}</span>
          </h3>
          <FormattedPriceHeader
            price={price}
            customClasses={{
              container: 'flex flex-row font-medium pb2 items-end space-x-1',
              price: 'text-xl sm:text-2xl',
            }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
        {isSubscribed && (
          <div className="flex justify-between rounded-md text-xs font-medium text-blue-500 hover:text-blue-600 cursor-pointer">
            <div>See usage details</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MeteredProductCard
