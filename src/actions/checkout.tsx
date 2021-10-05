import { CheckoutProps, CheckoutActionProps } from 'src/types'
import { Stripe } from '@stripe/stripe-js'
import { createSession } from 'src/request'
import { getCheckoutData } from '../request/data'

export default (configProps: CheckoutActionProps) => {
  const { api_key, isSubmitting, setIsSubmitting, setError } = configProps

  return async (callProps: CheckoutProps, stripe?: Stripe) => {
    if (!stripe) {
      console.error(
        'Stripe not present - ensure you have passed a valid API key within initialization or have passed your own Stripe instance to this call.'
      )
      return
    }
    if (isSubmitting) {
      console.warn('Checkout request in progress')
      return
    }

    const data = getCheckoutData(callProps, configProps)

    setIsSubmitting(true)
    try {
      const response = await createSession(api_key, data)

      stripe.redirectToCheckout({
        sessionId: response.id,
      })
    } catch (err) {
      setError({ message: err.message, statusCode: err.statusCode })
    }
    setIsSubmitting(false)
  }
}
