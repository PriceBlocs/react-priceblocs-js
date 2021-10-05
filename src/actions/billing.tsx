import { IBillingActionProps, IBillingProps } from 'src/types'
import { Stripe } from '@stripe/stripe-js'
import { createBilling } from '../request'
import { getBillingData } from '../request/data'

export default (configProps: IBillingActionProps) => {
  const { api_key, isSubmitting, setIsSubmitting, setError } = configProps

  return async (callProps: IBillingProps, stripe?: Stripe) => {
    if (!stripe) {
      console.error(
        'Stripe not present - ensure you have passed a valid API key within initialization or have passed your own Stripe instance to this call.'
      )
      return
    }
    if (isSubmitting) {
      console.warn('Billing request in progress')
      return
    }

    const billingData = getBillingData(configProps, callProps)

    if (!billingData.customer) {
      console.error(
        'A valid customer id is required to start a billing portal session'
      )
      return
    }

    setIsSubmitting(true)
    try {
      const billingSession = await createBilling(api_key, billingData)
      if (billingSession) {
        if (billingSession.statusCode === 400) {
          setError(billingSession)
        } else if (billingSession.url) {
          window.location.href = billingSession.url
        }
      }
    } catch (err) {
      setError({ message: err.message })
    }

    setIsSubmitting(false)
  }
}
