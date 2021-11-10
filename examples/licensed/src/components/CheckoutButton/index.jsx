import React, { Fragment, useState } from 'react'
import {
  usePriceBlocsContext,
  useCheckoutCart,
} from '@priceblocs/react-priceblocs-js'
import Spinner from '@components/Spinner'
import Overlay from '@components/Overlay'
import PreviewInvoice from '@components/PreviewInvoice'
import classNames from '@utils/classNames'

const DEFAULT_COPY = {
  value: 'Buy now',
  loading: 'Loading...',
}

const PREVIEW_INVOICE = 'preview_invoice'
const OVERLAY_TYPE = {
  PREVIEW_INVOICE,
}

const OVERLAY_TITLE_MAP = {
  [OVERLAY_TYPE.PREVIEW_INVOICE]: 'Update subscription',
}

const CheckoutButton = ({ checkout: checkoutInput, copy: copyProps }) => {
  const [overlay, setOverlay] = useState(null)

  const {
    checkout: cartCheckout,
    previewable,
    subscriptions,
    disabled,
  } = useCheckoutCart({
    checkout: checkoutInput,
  })
  const showOverlay = Boolean(overlay)

  const {
    refetch,
    checkout,
    values: {
      form: { theme },
    },
  } = usePriceBlocsContext()
  const copy = { ...DEFAULT_COPY, ...copyProps }

  const primaryColor = theme.colors.primary
  const [loading, setLoading] = useState(false)
  const buttonCopy = loading ? copy.loading : copy.value

  const buttonClasses = classNames(
    `flex shadow-md justify-center items-center text-center mt-auto text-white bg-${primaryColor}-500 border-0 py-2 px-4 w-full focus:outline-none rounded-md transition duration-150 ease-in-out font-medium disabled:opacity-20`,
    !disabled ? `hover:bg-${primaryColor}-600` : '',
    disabled ? 'cursor-not-allowed' : ''
  )

  const buttonProps = {
    type: 'button',
    disabled: loading || disabled,
    className: buttonClasses,
  }

  const trigger = previewable ? (
    <button
      {...buttonProps}
      onClick={() => setOverlay(OVERLAY_TYPE.PREVIEW_INVOICE)}
    >
      {buttonCopy}
    </button>
  ) : (
    <button
      {...buttonProps}
      onClick={async () => {
        setLoading(true)
        await checkout(cartCheckout)
        setLoading(false)
      }}
    >
      {loading && <Spinner />}
      {buttonCopy}
    </button>
  )

  return (
    <Fragment>
      {trigger}
      {previewable && (
        <Overlay open={showOverlay} setOpen={setOverlay}>
          <PreviewInvoice
            title={OVERLAY_TITLE_MAP[overlay]}
            setOpen={setOverlay}
            subscription={subscriptions[0]}
            prices={cartCheckout.prices}
            afterConfirm={() => {
              setOverlay(null)
              refetch()
            }}
          />
        </Overlay>
      )}
    </Fragment>
  )
}

export default CheckoutButton
