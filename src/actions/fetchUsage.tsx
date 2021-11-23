import {
  FetchUsageProps,
  FetchUsageActionProps,
  FetchUsageResponse,
} from 'src/types'
import { fetchUsage } from 'src/request'
import { getFetchUsageData } from 'src/request/data'

export default (configProps: FetchUsageActionProps) => {
  const { api_key, isSubmitting, setIsSubmitting, setError } = configProps

  return async (
    callProps: FetchUsageProps
  ): Promise<FetchUsageResponse | void> => {
    if (isSubmitting) {
      console.warn('Fetch usage in progress')
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
