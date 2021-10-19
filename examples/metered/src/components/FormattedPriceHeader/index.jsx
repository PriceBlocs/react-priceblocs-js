import React from 'react'
import {
  INTERVAL_SHORTHAND_MAP,
  usePriceBlocsContext,
} from '@priceblocs/react-priceblocs-js'
import { BILLING_PLANS } from '@constants/billingPlan'

const LABELS = {
  PER_UNIT: 'per unit',
}

const DEFAULT_CLASSES = {
  container: 'flex flex-row font-bold pt-5 pb2 items-end',
  price: 'text-2xl lg:text-4xl',
  interval: 'text-sm mb-1',
}

const FormattedPriceHeader = ({ customClasses, price }) => {
  const classes = { ...DEFAULT_CLASSES, ...customClasses }
  const {
    values: {
      form: { presentation },
    },
  } = usePriceBlocsContext()

  const isMetered =
    price &&
    price.recurring &&
    price.recurring.usage_type === BILLING_PLANS.METERED

  const formattedPrice =
    price && price.formatted
      ? isMetered
        ? price.formatted.unit_amount
        : price.formatted.intervals[presentation.interval]
      : price.formatted.intervals[presentation.interval]
  const intervalShorthand = isMetered
    ? LABELS.PER_UNIT
    : INTERVAL_SHORTHAND_MAP[presentation.interval]

  return (
    <div className={classes.container}>
      <span className={classes.price}>{formattedPrice}</span>
      <span className={classes.interval}>{`/ ${intervalShorthand}`}</span>
    </div>
  )
}

export default FormattedPriceHeader
