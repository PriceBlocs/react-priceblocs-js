import {
  FetchConfigData,
  CheckoutData,
  BillingData,
  PreviewInvoiceData,
  UpdateSubscriptionProps,
} from '../types'
import { URLS, METHODS } from '../constants'
import { stringify } from 'qs'
import { getAuthHeaders } from './data'

export const fetchConfig = async (apiKey: string, data: FetchConfigData) => {
  const url = `${URLS.PRICING}?${stringify(data)}`
  const response = await fetch(url, {
    method: METHODS.GET,
    headers: getAuthHeaders(apiKey),
  })

  return response.json()
}

export const createSession = async (apiKey: string, data: CheckoutData) => {
  const response = await fetch(URLS.CHECKOUT, {
    method: METHODS.POST,
    headers: getAuthHeaders(apiKey),
    body: stringify(data),
  })

  return response.json()
}

export const createBilling = async (apiKey: string, data: BillingData) => {
  const response = await fetch(URLS.BILLING, {
    method: METHODS.POST,
    headers: getAuthHeaders(apiKey),
    body: stringify(data),
  })

  return response.json()
}

export const fetchPreviewInvoice = async (
  apiKey: string,
  data: PreviewInvoiceData
) => {
  const url = `${URLS.INVOICE_PREVIEW}?${stringify(data)}`

  const response = await fetch(url, {
    method: METHODS.GET,
    headers: getAuthHeaders(apiKey),
  })

  return response.json()
}

export const updateSubscription = async (
  apiKey: string,
  id: string,
  data: Pick<UpdateSubscriptionProps, 'items' | 'customer' | 'proration_date'>
) => {
  const response = await fetch(`${URLS.SUBSCRIPTIONS}/${id}`, {
    method: METHODS.PUT,
    headers: getAuthHeaders(apiKey),
    body: JSON.stringify(data),
  })

  return response.json()
}
