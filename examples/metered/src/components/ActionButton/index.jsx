import React, { useState } from 'react'
import { usePriceBlocsContext } from '@priceblocs/react-priceblocs-js'
import Spinner from '@components/Spinner'
import toast from 'react-hot-toast'
import classNames from '@utils/classNames'

const DEFAULT_COPY = {
  value: 'Submit',
  loading: 'Loading...',
}

const DEFAULT_CLASSES = {
  button:
    'flex shadow-md justify-center items-center text-center mt-auto text-white border-0 py-2 px-4 focus:outline-none rounded-md transition duration-150 ease-in-out font-medium disabled:opacity-50',
}

const ActionButton = ({
  onClick,
  copy: copyProps,
  customClasses,
  disabled,
  loading: initLoading,
}) => {
  const classes = {
    ...DEFAULT_CLASSES,
    ...customClasses,
  }
  const copy = { ...DEFAULT_COPY, ...copyProps }
  const {
    values: {
      form: { theme },
    },
  } = usePriceBlocsContext()

  const primaryColor = theme.colors.primary
  const [loading, setLoading] = useState(Boolean(initLoading || false))

  return (
    <button
      disabled={loading || disabled}
      onClick={async () => {
        setLoading(true)
        try {
          await onClick()
        } catch (error) {
          toast.error(error.message)
        }
        setLoading(false)
      }}
      className={classNames(
        `${classes.button} bg-${primaryColor}-500`,
        !disabled && `hover:bg-${primaryColor}-600`
      )}
    >
      {loading && <Spinner />}
      {loading ? copy.loading : copy.value}
    </button>
  )
}

export default ActionButton
