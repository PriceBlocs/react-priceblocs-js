import {
  ISubscriptionUpdateProps,
  ISubscriptionUpdateActionProps,
} from 'src/types'
import { updateSubscription } from 'src/request'
import { prepareSubscriptionUpdateData } from '../request/data'

export default (props: ISubscriptionUpdateActionProps) => {
  const { api_key, isSubmitting, setIsSubmitting, setError } = props

  return async (subscriptionUpdateProps: ISubscriptionUpdateProps) => {
    if (isSubmitting) {
      console.warn('Preview invoice in progress')
      return
    }

    const { id, ...data } = prepareSubscriptionUpdateData({
      props,
      subscriptionUpdateProps,
    })

    setIsSubmitting(true)
    try {
      const subscriptionUpdate = await updateSubscription(api_key, id, data)
      setIsSubmitting(false)

      return subscriptionUpdate
    } catch (err) {
      setError({ message: err.message })
    }

    setIsSubmitting(false)
  }
}
