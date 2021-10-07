import {
  FetchUsageProps,
  FetchUsageActionProps,
  FetchUsageResponse,
} from '../types'
import { fetchUsage } from '../request'
import { getFetchUsageData } from '../request/data'

export default (configProps: FetchUsageActionProps) => {
  const { api_key, isSubmitting, setIsSubmitting, setError } = configProps

  return async (
    callProps: FetchUsageProps
  ): Promise<FetchUsageResponse | void> => {
    if (isSubmitting) {
      console.warn('Usage report in progress')
      return
    }

    const data = getFetchUsageData(configProps, callProps)

    setIsSubmitting(true)
    try {
      const usageSummary = await fetchUsage(api_key, data)
      setIsSubmitting(false)
      return usageSummary
    } catch (err) {
      setError(err)
    }
    setIsSubmitting(false)
  }
}
