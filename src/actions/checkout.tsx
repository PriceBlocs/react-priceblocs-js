import { ICheckoutProps, ICheckoutActionProps } from 'src/types'
import { Stripe } from '@stripe/stripe-js'
import { createSession } from 'src/request'
import { prepareCheckoutData } from '../request/data'

export default (props: ICheckoutActionProps) => {
  const { api_key, isSubmitting, setIsSubmitting, setError } = props

  return async (checkout: ICheckoutProps, stripe: Stripe) => {
    if (!stripe) {
      console.error(
        'Stripe is not initialized - ensure you have passed a valid API key'
      )
      return
    }
    if (isSubmitting) {
      console.warn('Checkout in progress')
      return
    }

    const checkoutData = prepareCheckoutData(checkout, props)

    setIsSubmitting(true)
    try {
      const response = await createSession(api_key, checkoutData)

      stripe.redirectToCheckout({
        sessionId: response.id,
      })
    } catch (err) {
      setError({ message: err.message })
    }
    setIsSubmitting(false)
  }
}
