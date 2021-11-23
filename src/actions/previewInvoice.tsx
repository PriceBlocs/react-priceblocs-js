import {
  PreviewInvoiceProps,
  PreviewInvoiceActionProps,
  FetchPreviewInvoiceResponse,
} from 'src/types'
import { fetchPreviewInvoice } from 'src/request'
import { getPreviewInvoiceData } from 'src/request/data'

export default (configProps: PreviewInvoiceActionProps) => {
  const { api_key, isSubmitting, setIsSubmitting, setError } = configProps

  return async (
    callProps: PreviewInvoiceProps
  ): Promise<FetchPreviewInvoiceResponse | void> => {
    if (isSubmitting) {
      console.warn('Preview invoice in progress')
      return
    }

    const previewInvoiceData = getPreviewInvoiceData(configProps, callProps)

    setIsSubmitting(true)
    try {
      const previewInvoice = await fetchPreviewInvoice(
        api_key,
        previewInvoiceData
      )
      setIsSubmitting(false)

      return previewInvoice
    } catch (err) {
      setError(err)
    }

    setIsSubmitting(false)
  }
}
