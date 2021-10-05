import { IPreviewInvoiceProps, IPreviewInvoiceActionProps } from 'src/types'
import { fetchPreviewInvoice } from 'src/request'
import { preparePreviewInvoiceData } from '../request/data'

// TODO: remame to config props
export default (configProps: IPreviewInvoiceActionProps) => {
  const { api_key, isSubmitting, setIsSubmitting, setError } = configProps

  return async (callProps: IPreviewInvoiceProps) => {
    if (isSubmitting) {
      console.warn('Preview invoice in progress')
      return
    }

    const previewInvoiceData = preparePreviewInvoiceData(configProps, callProps)

    setIsSubmitting(true)
    try {
      const previewInvoice = await fetchPreviewInvoice(
        api_key,
        previewInvoiceData
      )
      setIsSubmitting(false)

      return previewInvoice
    } catch (err) {
      setError({ message: err.message })
    }

    setIsSubmitting(false)
  }
}
