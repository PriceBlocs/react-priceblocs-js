import {
  ReportUsageProps,
  ReportUsageActionProps,
  ReportUsageResponse,
} from 'src/types'
import { reportUsage } from 'src/request'
import { getReportUsageData } from 'src/request/data'

export default (configProps: ReportUsageActionProps) => {
  const { api_key, isSubmitting, setIsSubmitting, setError } = configProps

  return async (
    callProps: ReportUsageProps
  ): Promise<ReportUsageResponse | void> => {
    if (isSubmitting) {
      console.warn('Report usage in progress')
      return
    }

    const data = getReportUsageData(configProps, callProps)

    setIsSubmitting(true)
    try {
      const usageRecord = await reportUsage(api_key, data)
      setIsSubmitting(false)
      return usageRecord
    } catch (err) {
      setError(err)
    }
    setIsSubmitting(false)
  }
}
