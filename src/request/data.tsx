import {
  IAuthHeaders,
  ICheckoutData,
  ICheckoutProps,
  IBillingData,
  ICheckoutActionProps,
  ICustomerParams,
  ICustomer,
  IBillingProps,
  IPreviewInvoiceProps,
  IPreviewInvoiceData,
  IUpdateSubscriptionProps,
  IUpdateSubscriptionData,
  IFetchConfigData,
  IPrepareFetchConfigDataProps,
  BillingConfigProps,
  PreviewInvoiceConfigProps,
  UpdateSubscriptionConfigProps,
  ActionConfigProps,
  ActionCallProps,
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

export const prepareFetchConfigData = (
  props: IPrepareFetchConfigDataProps
): IFetchConfigData => {
  const result = {} as IFetchConfigData

  if (props.customer) {
    result.customer = props.customer
  } else if (props.customer_email) {
    result.customer_email = props.customer_email
  } else if (props.email) {
    result.email = props.email
  }
  if (props.prices && props.prices.length > 0) {
    result.prices = props.prices
  }
  if (props.query) {
    result.query = props.query
  }

  return result
}

export const prepareCheckoutData = (
  checkout: ICheckoutProps | string,
  props: Pick<
    ICheckoutActionProps,
    'success_url' | 'cancel_url' | 'return_url' | 'customer' | 'metadata'
  >
): ICheckoutData => {
  const currentUrl = window.location.href
  if (typeof checkout === 'string') {
    const result = {
      prices: [checkout],
      cancel_url: currentUrl,
    } as ICheckoutData

    if (props.success_url) {
      result.success_url = props.success_url
    }
    if (props.cancel_url) {
      result.cancel_url = props.cancel_url
    }
    const returnUrl = props.return_url || currentUrl
    if (returnUrl) {
      result.return_url = returnUrl
    }

    const customer = getCustomerParams(props.customer)
    for (const key in customer) {
      result[key] = customer[key]
    }

    return result
  } else {
    const result = {
      prices: typeof checkout === 'string' ? [checkout] : checkout.prices,
      cancel_url: currentUrl,
    } as ICheckoutData

    if (props.metadata && props.metadata.id) {
      result.id = props.metadata.id
    }

    const successUrl = checkout.success_url || props.success_url
    if (successUrl) {
      result.success_url = successUrl
    }

    const cancelUrl = checkout.cancel_url || props.cancel_url
    if (cancelUrl) {
      result.cancel_url = cancelUrl
    }

    const returnUrl = checkout.return_url || props.return_url || currentUrl
    if (returnUrl) {
      result.return_url = returnUrl
    }

    const customer = getCustomerParams(checkout.customer || props.customer)
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
