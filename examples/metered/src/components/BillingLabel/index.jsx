import React from 'react'
import { INTERVAL_LABELS_MAP } from '@priceblocs/react-priceblocs-js'
import classNames from '@utils/classNames'

const BillingLabel = ({ price }) => {
  const priceInterval = price && price.recurring && price.recurring.interval

  return (
    <div
      className={classNames(
        `text-sm text-gray-700 py-2`,
        (!priceInterval || !price.unit_amount) && 'invisible'
      )}
    >
      {`Billed ${INTERVAL_LABELS_MAP[priceInterval]}` || '_'}
    </div>
  )
}

export default BillingLabel
