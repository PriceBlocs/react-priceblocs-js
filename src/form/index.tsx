import {
  Values,
  CheckoutItem,
  SetCheckoutProps,
  CheckoutAddData,
  Price,
} from 'src/types'
import { clone, set } from 'lodash'

export const checkoutAdd = (props: SetCheckoutProps) => {
  return (data: CheckoutAddData) => {
    const updatedValues = clone(props.values)
    const priceId = typeof data === 'string' ? data : data.price.id

    const checkoutItems = updatedValues.form.checkout.items
    const priceIndex = updatedValues.form.checkout.items.findIndex(
      ({ price: { id } }: { price: Price }) => id === priceId
    )

    if (priceIndex === -1) {
      checkoutItems.push(
        typeof data === 'string'
          ? ({ price: { id: data } } as CheckoutItem)
          : (data as CheckoutItem)
      )
      set(updatedValues as Values, 'form.checkout.items', checkoutItems)
      props.setValues(updatedValues)
    } else {
      console.warn('Already present in checkout')
    }

    return updatedValues
  }
}

export const checkoutRemove = (props: SetCheckoutProps) => {
  return (priceId: string) => {
    const updatedValues = clone(props.values)
    const checkoutItems = updatedValues.form.checkout.items
    const priceIndex = updatedValues.form.checkout.items.findIndex(
      ({ price: { id } }: { price: Price }) => id === priceId
    )

    if (priceIndex >= 0) {
      checkoutItems.splice(priceIndex, 1)

      set(updatedValues as Values, 'form.checkout.items', checkoutItems)
      props.setValues(updatedValues)
    } else {
      console.warn('Not present in checkout')
    }

    return updatedValues
  }
}
