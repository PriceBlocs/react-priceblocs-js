import { CheckoutProps, CheckoutActionProps } from 'src/types'
import { Stripe } from '@stripe/stripe-js'
import { createSession } from 'src/request'
import { getCheckoutData } from 'src/request/data'

export default (configProps: CheckoutActionProps) => {
  const {
    api_key,
    isSubmitting,
    setIsSubmitting,
    setError,
    stripe: configStripe,
  } = configProps

  return async (callProps: CheckoutProps, stripe?: Stripe) => {
    const ctxStripe = stripe || configStripe

    if (!ctxStripe) {
      console.error(
        'Stripe not present - ensure you have passed a valid API key within initialization or have passed your own Stripe instance to this call.'
      )
      return
    }
    if (isSubmitting) {
      console.warn('Checkout request in progress')
      return
    }

    const data = getCheckoutData(configProps, callProps)

    setIsSubmitting(true)
    try {
      const response = await createSession(api_key, data)
      if ('id' in response) {
        ctxStripe.redirectToCheckout({
          sessionId: response.id,
        })
      }
    } catch (err) {
      setError(err)
    }
    setIsSubmitting(false)
  }
}
