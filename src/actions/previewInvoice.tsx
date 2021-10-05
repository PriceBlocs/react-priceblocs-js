import { PreviewInvoiceProps, PreviewInvoiceActionProps } from 'src/types'
import { fetchPreviewInvoice } from 'src/request'
import { getPreviewInvoiceData } from '../request/data'

// TODO: remame to config props
export default (configProps: PreviewInvoiceActionProps) => {
  const { api_key, isSubmitting, setIsSubmitting, setError } = configProps

  return async (callProps: PreviewInvoiceProps) => {
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
      setError({ message: err.message, statusCode: err.statusCode })
    }

    setIsSubmitting(false)
  }
}
