import {
  IValues,
  ICheckoutItem,
  ICheckoutAddProps,
  ICheckoutAddData,
} from '../types'
import { clone, set } from 'lodash'

export const checkoutAdd = (props: ICheckoutAddProps) => {
  return (data: ICheckoutAddData) => {
    const updatedValues = clone(props.values)
    const priceId = typeof data === 'string' ? data : data.price.id

    const checkoutItems = updatedValues.form.checkout.items
    const priceIndex = updatedValues.form.checkout.items.findIndex(
      ({ price: { id } }) => id === priceId
    )

    if (priceIndex === -1) {
      checkoutItems.push(
        typeof data === 'string'
          ? ({ price: { id: data } } as ICheckoutItem)
          : (data as ICheckoutItem)
      )
      set(updatedValues as IValues, 'form.checkout.items', checkoutItems)
      props.setValues(updatedValues)
    } else {
      console.warn('Already present in checkout')
    }

    return updatedValues
  }
}

export const checkoutRemove = (props: ICheckoutAddProps) => {
  return (priceId: string) => {
    const updatedValues = clone(props.values)
    const checkoutItems = updatedValues.form.checkout.items
    const priceIndex = updatedValues.form.checkout.items.findIndex(
      ({ price: { id } }) => id === priceId
    )

    if (priceIndex >= 0) {
      checkoutItems.splice(priceIndex, 1)

      set(updatedValues as IValues, 'form.checkout.items', checkoutItems)
      props.setValues(updatedValues)
    } else {
      console.warn('Not present in checkout')
    }

    return updatedValues
  }
}
