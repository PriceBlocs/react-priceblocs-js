import {
  FetchConfigData,
  FetchConfigResponse,
  CreateSessionResponse,
  CreateBillingResponse,
  CheckoutData,
  BillingData,
  ReportUsageData,
  PreviewInvoiceData,
  UpdateSubscriptionProps,
  UpdateSubscriptionResponse,
  FetchPreviewInvoiceResponse,
  ReportUsageResponse,
  FetchUsageData,
  FetchUsageResponse,
} from '../types'
import { URLS, METHODS } from '../constants'
import { stringify } from 'qs'
import { getAuthHeaders } from './data'

export const fetchConfig = async (
  apiKey: string,
  data: FetchConfigData
): Promise<FetchConfigResponse> => {
  const url = `${URLS.PRICING}?${stringify(data)}`
  const response = await fetch(url, {
    method: METHODS.GET,
    headers: getAuthHeaders(apiKey),
  })

  const result: FetchConfigResponse = await response.json()
  if ('statusCode' in result && result.statusCode !== 200) {
    throw result
  }

  return result
}

export const createSession = async (
  apiKey: string,
  data: CheckoutData
): Promise<CreateSessionResponse> => {
  const response = await fetch(URLS.CHECKOUT, {
    method: METHODS.POST,
    headers: getAuthHeaders(apiKey),
    body: JSON.stringify(data),
  })

  const result: CreateSessionResponse = await response.json()
  if ('statusCode' in result && result.statusCode !== 200) {
    throw result
  }

  return result
}

export const createBilling = async (
  apiKey: string,
  data: BillingData
): Promise<CreateBillingResponse> => {
  const response = await fetch(URLS.BILLING, {
    method: METHODS.POST,
    headers: getAuthHeaders(apiKey),
    body: JSON.stringify(data),
  })
  const result: CreateBillingResponse = await response.json()
  if ('statusCode' in result && result.statusCode !== 200) {
    throw result
  }

  return result
}

export const fetchPreviewInvoice = async (
  apiKey: string,
  data: PreviewInvoiceData
): Promise<FetchPreviewInvoiceResponse> => {
  const url = `${URLS.INVOICE_PREVIEW}?${stringify(data)}`

  const response = await fetch(url, {
    method: METHODS.GET,
    headers: getAuthHeaders(apiKey),
  })

  const result: FetchPreviewInvoiceResponse = await response.json()
  if ('statusCode' in result && result.statusCode !== 200) {
    throw result
  }

  return result
}

export const updateSubscription = async (
  apiKey: string,
  id: string,
  data: Pick<UpdateSubscriptionProps, 'items' | 'customer' | 'proration_date'>
): Promise<UpdateSubscriptionResponse> => {
  const response = await fetch(`${URLS.SUBSCRIPTIONS}/${id}`, {
    method: METHODS.PUT,
    headers: getAuthHeaders(apiKey),
    body: JSON.stringify(data),
  })

  const result: UpdateSubscriptionResponse = await response.json()
  if ('statusCode' in result && result.statusCode !== 200) {
    throw result
  }

  return result
}

export const reportUsage = async (
  apiKey: string,
  data: ReportUsageData
): Promise<ReportUsageResponse> => {
  const response = await fetch(URLS.USAGE, {
    method: METHODS.POST,
    headers: getAuthHeaders(apiKey),
    body: JSON.stringify(data),
  })
  const result: ReportUsageResponse = await response.json()
  if ('statusCode' in result && result.statusCode !== 200) {
    throw result
  }

  return result
}

export const fetchUsage = async (
  apiKey: string,
  data: FetchUsageData
): Promise<FetchUsageResponse> => {
  const url = `${URLS.USAGE}?${stringify(data)}`
  const response = await fetch(url, {
    method: METHODS.GET,
    headers: getAuthHeaders(apiKey),
  })
  const result: FetchUsageResponse = await response.json()
  if ('statusCode' in result && result.statusCode !== 200) {
    throw result
  }

  return result
}
