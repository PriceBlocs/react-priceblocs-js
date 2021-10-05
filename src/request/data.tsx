import {
  IAuthHeaders,
  ICheckoutData,
  CheckoutConfigProps,
  IBillingData,
  ICustomerParams,
  ICustomer,
  IBillingProps,
  IPreviewInvoiceProps,
  IPreviewInvoiceData,
  IUpdateSubscriptionProps,
  IUpdateSubscriptionData,
  IFetchConfigData,
  FetchConfigProps,
  BillingConfigProps,
  PreviewInvoiceConfigProps,
  UpdateSubscriptionConfigProps,
  ActionConfigProps,
  ActionCallProps,
  CheckoutCallProps,
} from '../types'

export const getAuthHeaders = (apiKey: string): IAuthHeaders => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${apiKey}`,
})

export const getCustomerParams = (customer: ICustomer): ICustomerParams => {
  const result = {} as ICustomerParams
  if (customer.id) {
    result.customer = customer.id
  } else if (customer.email) {
    result.customer_email = customer.email
  }

  return result
}

export const getFetchConfigData = (
  configProps: FetchConfigProps
): IFetchConfigData => {
  const result = {} as IFetchConfigData

  if (configProps.customer) {
    result.customer = configProps.customer
  } else if (configProps.customer_email) {
    result.customer_email = configProps.customer_email
  } else if (configProps.email) {
    result.email = configProps.email
  }
  if (configProps.prices && configProps.prices.length > 0) {
    result.prices = configProps.prices
  }
  if (configProps.query) {
    result.query = configProps.query
  }

  return result
}

export const getCheckoutData = (
  callProps: CheckoutCallProps,
  configProps: CheckoutConfigProps
): ICheckoutData => {
  const currentUrl = window.location.href
  if (typeof callProps === 'string') {
    const result = {
      prices: [callProps],
      cancel_url: currentUrl,
    } as ICheckoutData

    if (configProps.success_url) {
      result.success_url = configProps.success_url
    }
    if (configProps.cancel_url) {
      result.cancel_url = configProps.cancel_url
    }
    const returnUrl = configProps.return_url || currentUrl
    if (returnUrl) {
      result.return_url = returnUrl
    }

    const customer = getCustomerParams(configProps.customer)
    for (const key in customer) {
      result[key] = customer[key]
    }

    return result
  } else {
    const result = {
      prices: typeof callProps === 'string' ? [callProps] : callProps.prices,
      cancel_url: currentUrl,
    } as ICheckoutData

    if (configProps.metadata && configProps.metadata.id) {
      result.id = configProps.metadata.id
    }

    const successUrl = callProps.success_url || configProps.success_url
    if (successUrl) {
      result.success_url = successUrl
    }

    const cancelUrl = callProps.cancel_url || configProps.cancel_url
    if (cancelUrl) {
      result.cancel_url = cancelUrl
    }

    const returnUrl =
      callProps.return_url || configProps.return_url || currentUrl
    if (returnUrl) {
      result.return_url = returnUrl
    }

    const customer = getCustomerParams(
      callProps.customer || configProps.customer
    )
    for (const key in customer) {
      result[key] = customer[key]
    }

    return result
  }
}

const getCallOrConfigCustomer = (
  callProps: ActionCallProps,
  configProps: ActionConfigProps
) => {
  let customer
  if (callProps && callProps.customer) {
    customer = callProps.customer
  } else if (configProps.customer && configProps.customer.id) {
    customer = configProps.customer.id
  }
  if (!customer) {
    throw new Error('A valid customer must be provided to this action.')
  }

  return customer
}

export const getBillingData = (
  configProps: BillingConfigProps,
  callProps: IBillingProps
): IBillingData => {
  const customer = getCallOrConfigCustomer(callProps, configProps)

  return {
    customer,
    return_url:
      callProps && callProps.return_url
        ? callProps.return_url
        : configProps.return_url || window.location.href,
  }
}

export const getPreviewInvoiceData = (
  configProps: PreviewInvoiceConfigProps,
  callProps: IPreviewInvoiceProps
): IPreviewInvoiceData => {
  const customer = getCallOrConfigCustomer(callProps, configProps)

  if (!callProps.subscription) {
    throw new Error(
      'A valid subscription must be provided to preview an invoice.'
    )
  }

  return {
    customer,
    subscription: callProps.subscription,
    items: callProps.items || configProps.values.form.checkout.items || [],
  }
}

export const getUpdateSubscriptionData = (
  configProps: UpdateSubscriptionConfigProps,
  callProps: IUpdateSubscriptionProps
): IUpdateSubscriptionData => {
  const customer = getCallOrConfigCustomer(callProps, configProps)

  if (!callProps.id) {
    throw new Error('A valid subscription must be provided to update.')
  }

  if (!callProps.items || !callProps.items.length) {
    throw new Error('Subscription items must be provided to update.')
  }

  const result = {
    id: callProps.id,
    customer,
    items: callProps.items,
  } as IUpdateSubscriptionData

  if (callProps.proration_date) {
    result.proration_date = callProps.proration_date
  }

  return result
}
