import {
  IAuthHeaders,
  ICheckoutData,
  ICheckoutProps,
  IBillingData,
  ICheckoutActionProps,
  ICustomerParams,
  ICustomer,
  IBillingProps,
  IBillingActionProps,
  IPreparePreviewInvoiceDataProps,
  IPreviewInvoiceData,
  IPrepareSubscriptionUpdateDataProps,
  ISubscriptionUpdateData,
  IFetchConfigData,
  IPrepareFetchConfigDataProps,
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

type BillingConfigProps = Pick<IBillingActionProps, 'customer' | 'return_url'>
type CallProps = IBillingProps
type ConfigProps = BillingConfigProps

const getCallOrConfigCustomer = (
  callProps: CallProps,
  configProps: ConfigProps
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

export const prepareBillingData = (
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

export const preparePreviewInvoiceData = ({
  props,
  previewInvoiceProps,
}: IPreparePreviewInvoiceDataProps): IPreviewInvoiceData => {
  let customer
  if (previewInvoiceProps && previewInvoiceProps.customer) {
    customer = previewInvoiceProps.customer
  } else if (props.customer && props.customer.id) {
    customer = props.customer.id
  }
  if (!customer) {
    throw new Error('A valid customer must be provided to preview an invoice.')
  }

  if (!previewInvoiceProps.subscription) {
    throw new Error(
      'A valid subscription must be provided to preview an invoice.'
    )
  }

  return {
    customer,
    subscription: previewInvoiceProps.subscription,
    items: previewInvoiceProps.items || props.values.form.checkout.items || [],
  }
}

export const prepareSubscriptionUpdateData = ({
  props,
  subscriptionUpdateProps,
}: IPrepareSubscriptionUpdateDataProps): ISubscriptionUpdateData => {
  let customer
  if (subscriptionUpdateProps && subscriptionUpdateProps.customer) {
    customer = subscriptionUpdateProps.customer
  } else if (props.customer && props.customer.id) {
    customer = props.customer.id
  }
  if (!customer) {
    throw new Error(
      'A valid customer must be provided to update a subscription.'
    )
  }

  if (!subscriptionUpdateProps.id) {
    throw new Error('A valid subscription must be provided to update.')
  }

  if (!subscriptionUpdateProps.items || !subscriptionUpdateProps.items.length) {
    throw new Error('Subscription items must be provided to update.')
  }

  const result = {
    id: subscriptionUpdateProps.id,
    customer,
    items: subscriptionUpdateProps.items,
  } as ISubscriptionUpdateData

  if (subscriptionUpdateProps.proration_date) {
    result.proration_date = subscriptionUpdateProps.proration_date
  }

  return result
}
