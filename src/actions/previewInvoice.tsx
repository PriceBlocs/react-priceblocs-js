import { IPreviewInvoiceProps, IPreviewInvoiceActionProps } from 'src/types'
import { fetchPreviewInvoice } from 'src/request'
import { preparePreviewInvoiceData } from '../request/data'

export default (props: IPreviewInvoiceActionProps) => {
  const { api_key, isSubmitting, setIsSubmitting, setError } = props

  return async (previewInvoiceProps: IPreviewInvoiceProps) => {
    if (isSubmitting) {
      console.warn('Preview invoice in progress')
      return
    }

    const previewInvoiceData = preparePreviewInvoiceData({
      props,
      previewInvoiceProps,
    })

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
