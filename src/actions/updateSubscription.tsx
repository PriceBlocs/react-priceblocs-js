import {
  IUpdateSubscriptionProps,
  IUpdateSubscriptionActionProps,
} from 'src/types'
import { updateSubscription } from 'src/request'
import { getUpdateSubscriptionData } from '../request/data'

export default (configProps: IUpdateSubscriptionActionProps) => {
  const { api_key, isSubmitting, setIsSubmitting, setError } = configProps

  return async (callProps: IUpdateSubscriptionProps) => {
    if (isSubmitting) {
      console.warn('Preview invoice in progress')
      return
    }

    const { id, ...data } = getUpdateSubscriptionData(configProps, callProps)

    setIsSubmitting(true)
    try {
      const subscription = await updateSubscription(api_key, id, data)
      setIsSubmitting(false)

      return subscription
    } catch (err) {
      setError({ message: err.message })
    }

    setIsSubmitting(false)
  }
}
