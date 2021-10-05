import { IBillingActionProps, IBillingProps } from 'src/types'
import { Stripe } from '@stripe/stripe-js'
import { createBilling } from '../request'
import { prepareBillingData } from '../request/data'

export default (props: IBillingActionProps) => {
  const { api_key, isSubmitting, setIsSubmitting, setError } = props

  return async (billingProps: IBillingProps, stripe: Stripe) => {
    if (!stripe) {
      console.error(
        'Stripe is not initialized - ensure you have passed a valid API key'
      )
      return
    }
    if (isSubmitting) {
      console.warn('Billing in progress')
      return
    }

    const billingData = prepareBillingData({
      props,
      billingProps,
    })

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
