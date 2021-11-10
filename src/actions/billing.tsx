import { BillingActionProps, BillingProps } from 'src/types'
import { createBilling } from '../request'
import { getBillingData } from '../request/data'

export default (configProps: BillingActionProps) => {
  const { api_key, isSubmitting, setIsSubmitting, setError } = configProps

  return async (callProps: BillingProps) => {
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
      if ('url' in billingSession) {
        window.location.href = billingSession.url
      }
    } catch (err) {
      setError(err)
    }

    setIsSubmitting(false)
  }
}
