import {
  Values,
  CheckoutItem,
  SetCheckoutProps,
  CheckoutAddData,
} from 'src/types'
import { clone, set } from 'lodash'

export const checkoutAdd = (props: SetCheckoutProps) => {
  return (data: CheckoutAddData) => {
    const updatedValues = clone(props.values)
    const priceId = typeof data === 'string' ? data : data.price.id

    const checkoutItems = updatedValues.form.checkout.items
    const priceIndex = updatedValues.form.checkout.items.findIndex(
      ({ price: { id } }: CheckoutItem) => id === priceId
    )

    if (priceIndex === -1) {
      /**
       * Add the price to checkout items
       * - Handle single string price id being passed
       * - Else add full CheckoutItem data shape
       */
      checkoutItems.push(
        typeof data === 'string'
          ? ({ price: { id: data } } as CheckoutItem)
          : (data as CheckoutItem)
      )
      /**
       * Update the checkout items
       */
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
      ({ price: { id } }: CheckoutItem) => id === priceId
    )

    if (priceIndex >= 0) {
      /**
       * Remove the price from checkout items
       */
      checkoutItems.splice(priceIndex, 1)
      /**
       * Update the form checkout items
       */
      set(updatedValues as Values, 'form.checkout.items', checkoutItems)
      props.setValues(updatedValues)
    } else {
      console.warn('Not present in checkout')
    }

    return updatedValues
  }
}
