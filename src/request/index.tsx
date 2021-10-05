import {
  IFetchConfigData,
  ICheckoutData,
  IBillingData,
  IPreviewInvoiceData,
  ISubscriptionUpdateProps,
} from '../types'
import { URLS, METHODS } from '../constants'
import { stringify } from 'qs'
import { getAuthHeaders } from './data'

export const fetchConfig = async (apiKey: string, params: IFetchConfigData) => {
  const queryString = stringify(params)

  const url = queryString ? `${URLS.PRICING}?${queryString}` : URLS.PRICING

  const response = await fetch(url, {
    method: METHODS.GET,
    headers: getAuthHeaders(apiKey),
  })

  return response.json()
}

export const createSession = async (apiKey: string, data: ICheckoutData) => {
  const response = await fetch(URLS.CHECKOUT, {
    method: METHODS.POST,
    headers: getAuthHeaders(apiKey),
    body: stringify(data),
  })

  return response.json()
}

export const createBilling = async (apiKey: string, data: IBillingData) => {
  const response = await fetch(URLS.BILLING, {
    method: METHODS.POST,
    headers: getAuthHeaders(apiKey),
    body: stringify(data),
  })

  return response.json()
}

export const fetchPreviewInvoice = async (
  apiKey: string,
  data: IPreviewInvoiceData
) => {
  const queryString = stringify(data)

  const url = queryString
    ? `${URLS.INVOICE_PREVIEW}?${queryString}`
    : URLS.INVOICE_PREVIEW

  const response = await fetch(url, {
    method: METHODS.GET,
    headers: getAuthHeaders(apiKey),
  })

  return response.json()
}

export const updateSubscription = async (
  apiKey: string,
  id: string,
  data: Pick<ISubscriptionUpdateProps, 'items' | 'customer' | 'proration_date'>
) => {
  const response = await fetch(`${URLS.SUBSCRIPTIONS}/${id}`, {
    method: METHODS.PUT,
    headers: getAuthHeaders(apiKey),
    body: JSON.stringify(data),
  })

  return response.json()
}
