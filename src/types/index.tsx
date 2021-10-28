import * as React from 'react'
import { Stripe } from '@stripe/stripe-js'
import StripeNode from 'stripe'

export enum StripeCustomerAssociation {
  Subscriptions = 'subscriptions',
  Cards = 'cards',
}

export enum StripeCustomerExpand {
  DefaultSource = 'default_source',
  InvoiceSettingsDefaultPaymentMethod = 'invoice_settings.default_payment_method',
}

export enum SubscriptionStatus {
  Active = 'active',
  Trialing = 'trialing',
  Incomplete = 'incomplete',
  IncompleteExpired = 'incomplete_expired',
  PastDue = 'past_due',
  Canceled = 'canceled',
  Unpaid = 'unpaid',
}

export type ValuesCheckoutItems = {
  form: {
    checkout: {
      items?: CheckoutItem[] | string[]
    }
  }
}

export type CheckoutConfigProps = Pick<
  CheckoutActionProps,
  'success_url' | 'cancel_url' | 'return_url' | 'customer' | 'metadata'
>
export type BillingConfigProps = Pick<
  BillingActionProps,
  'customer' | 'return_url'
>
export type ReportUsageConfigProps = Pick<ReportUsageActionProps, 'customer'>
export type FetchUsageConfigProps = Pick<FetchUsageActionProps, 'customer'>
export type PreviewInvoiceConfigProps = {
  customer?: Customer
  values: ValuesCheckoutItems
}
export type UpdateSubscriptionConfigProps = Pick<
  UpdateSubscriptionActionProps,
  'customer'
>

export type CheckoutCallProps = CheckoutProps | string

export type ActionConfigProps =
  | CheckoutConfigProps
  | BillingConfigProps
  | PreviewInvoiceConfigProps
  | UpdateSubscriptionConfigProps
  | ReportUsageConfigProps

export type ActionCallProps =
  | BillingProps
  | PreviewInvoiceProps
  | UpdateSubscriptionProps
  | ReportUsageProps

export interface FetchConfigQueryParams {
  customer?: {
    associations?: StripeCustomerAssociation[]
    expand?: StripeCustomerExpand[]
  }
}

export type CustomerParams = {
  [key: string]: string
  customer?: string
  customer_email?: string
  email?: string
}

export interface FetchConfigData
  extends Pick<CustomerParams, 'customer' | 'customer_email' | 'email'> {
  [key: string]: string | string[] | FetchConfigQueryParams
  prices?: string[]
  id?: string
  session?: string
  query?: FetchConfigQueryParams
}

export interface FetchConfigProps
  extends Pick<CustomerParams, 'customer' | 'customer_email' | 'email'> {
  prices: string[]
  query?: FetchConfigQueryParams
}

export interface FetchConfigResponseData extends Metadata {
  data: Values
}

type CreateSessionResponseData = {
  id: string
}

type CreateBillingResponseData = {
  url: string
}

type ReportUsageResponseData = StripeNode.UsageRecord

type UsageRecordSummary = {
  /**
   * Unique identifier for the object.
   */
  id: string

  /**
   * String representing the object's type. Objects of the same type share the same value.
   */
  object: 'usage_record_summary'

  /**
   * The invoice in which this usage period has been billed for.
   */
  invoice: string | null

  /**
   * Has the value `true` if the object exists in live mode or the value `false` if the object exists in test mode.
   */
  livemode: boolean

  period: {
    label: string | null
    end: number | null
    start: number | null
  }

  /**
   * The ID of the subscription item this summary is describing.
   */
  subscription_item: string

  /**
   * The total usage within this usage period.
   */
  total_usage: number
  /**
   * The total cost for this usage period if aggregate usage is sum
   */
  total_cost: string | null
}

type FetchUsageResponseData = {
  total_usage: number
  total_cost: string | null
  unit_cost: string
  unit_amount: number
  data: UsageRecordSummary[]
}

export type FetchPreviewInvoiceResponseData = Pick<
  PreviewInvoice,
  'preview' | 'invoice'
>

export type UpdateSubscriptionResponseData = Pick<Subscription, 'id' | 'status'>

export type FetchConfigResponse = FetchConfigResponseData | PriceBlocsError
export type CreateSessionResponse = CreateSessionResponseData | PriceBlocsError
export type CreateBillingResponse = CreateBillingResponseData | PriceBlocsError
export type ReportUsageResponse = ReportUsageResponseData | PriceBlocsError
export type FetchUsageResponse = FetchUsageResponseData | PriceBlocsError

export type FetchPreviewInvoiceResponse =
  | FetchPreviewInvoiceResponseData
  | PriceBlocsError
export type UpdateSubscriptionResponse =
  | UpdateSubscriptionResponseData
  | PriceBlocsError

export interface FetchPreviewInvoiceParams
  extends Pick<CustomerParams, 'customer' | 'customer_email' | 'email'> {
  [key: string]: string | string[] | FetchConfigQueryParams
  prices?: string[]
  id?: string
  session?: string
  query?: FetchConfigQueryParams
}

export interface FetchDataActionProps
  extends Pick<CustomerParams, 'customer' | 'customer_email' | 'email'> {
  api_key: string
  loading: boolean
  setLoading: (loading: boolean) => void
  setValues: (values: Values) => void
  setMetadata: (values: Metadata) => void
  setError: (error: PriceBlocsError | Error) => void
  prices: string[]
  query?: FetchConfigQueryParams
}

export type CheckoutActionProps = {
  api_key: string
  success_url?: string
  cancel_url?: string
  return_url?: string
  customer?: Customer
  metadata?: Metadata
  isSubmitting: boolean
  setIsSubmitting: (isSubmiting: boolean) => void
  setError: (error: PriceBlocsError | Error) => void
}

export type PreviewInvoiceActionProps = {
  api_key: string
  values: Values
  customer?: Customer
  isSubmitting: boolean
  setIsSubmitting: (isSubmiting: boolean) => void
  setError: (error: PriceBlocsError | Error) => void
}

export type BillingActionProps = {
  api_key: string
  customer?: Customer
  return_url?: string
  isSubmitting: boolean
  setIsSubmitting: (isSubmiting: boolean) => void
  setError: (error: PriceBlocsError | Error) => void
}

export type ReportUsageActionProps = {
  api_key: string
  customer?: Customer
  isSubmitting: boolean
  setIsSubmitting: (isSubmiting: boolean) => void
  setError: (error: PriceBlocsError | Error) => void
}

export type FetchUsageActionProps = {
  api_key: string
  customer?: Customer
  isSubmitting: boolean
  setIsSubmitting: (isSubmiting: boolean) => void
  setError: (error: PriceBlocsError | Error) => void
}

export interface BillingProps extends Pick<CustomerParams, 'customer'> {
  return_url?: string
}

export type UsageAction = 'set' | 'increment'

export interface ReportUsageProps extends Pick<CustomerParams, 'customer'> {
  subscription_item: string
  quantity?: number
  timestamp?: number
  action?: UsageAction
}

export interface FetchUsageProps extends Pick<CustomerParams, 'customer'> {
  subscription_item: string
  timestamp?: number
}

export type BillingData = {
  customer: string
  return_url: string
}

export type ReportUsageData = {
  customer: string
  subscription_item: string
  quantity?: number
  timestamp?: number
  action?: UsageAction
}

/**
 * What query args are here?
 */
export type FetchUsageData = {
  customer: string
  subscription_item: string
}

export type Metadata = {
  id: string
}

export interface CheckoutData
  extends Pick<CustomerParams, 'customer' | 'customer_email'> {
  [key: string]: string | string[]
  prices: string[]
  cancel_url: string
  success_url?: string
  return_url?: string
  id?: string
  session?: string
}

export type CheckoutProps = {
  prices: string[]
  cancel_url?: string
  success_url?: string
  return_url?: string
  id?: string
  customer?: Customer
  session?: string
  metadata?: Metadata
}

export type Admin = {
  clientKey: string
}

export type Recurring = {
  interval: string
}

export type Price = {
  id: string
  currency?: string
  recurring?: Recurring | null
}

export type Product = {
  id: string
  name: string
  description?: string
  prices?: Price[]
}

export type Highlight = {
  price?: string
  product?: string
  label?: string
  style?: string
}

export type Presentation = {
  interval?: string
  license?: string
}

export type Colors = {
  primary?: string
}

export type Theme = {
  colors?: Colors
  license?: string
}

export type CheckoutItem = {
  price: Price
  quantity?: number
  subscription?: string
}

export type CheckoutAddData = string | CheckoutItem

export type CheckoutAddProps = {
  values?: Values
  setValues: (values: Values) => void
}

export type Checkout = {
  items: CheckoutItem[]
  preview?: any
}

export type FormData = {
  currencies: string[]
  currency: string
  checkout: Checkout
  intervals: string[]
  interval: string
  highlight: Highlight
  theme: Theme
  presentation: Presentation
}

export type Customer = {
  id?: string
  email?: string
  subscriptions?: StripeNode.Subscription[]
  invoices?: StripeNode.Invoice[]
  cards?: StripeNode.Card[]
}

type Upgrade = {
  product: string
  price: string
}

export type Entitlement = {
  enabled: boolean
  subscription?: string
  subscriptionItem?: string
  upgrade?: Upgrade
}

type Entitlements = {
  [key: string]: Entitlement
}

export type Values = {
  admin: Admin
  customer: Customer
  form: FormData
  products: Product[]
  entitlements: Entitlements
  featureGroups: FeatureGroup[]
}

export type Error = {
  statusCode: number
  message: string
}

export type StripeElementContextProps = {
  setReady: (ready: boolean) => void
  ready: boolean
  clientKey: string
  children: React.ReactNode
  providerValue: PriceBlocsProviderValue
  Provider: PriceBlocsProvider
}

export type WithStripeContextProps = {
  setReady: (ready: boolean) => void
  ready: boolean
  children: React.ReactNode
  providerValue: PriceBlocsProviderValue
  Provider: PriceBlocsProvider
}

export type AuthHeaders = {
  [key: string]: string
}

export type ProductConfig = {
  [key: string]: {
    enabled: boolean
  } | null
}

export type Feature = {
  title: string
  uid: string
  description: string
  tooltip: string | null
  product_config: ProductConfig
}

export type FeatureGroup = {
  title: string
  features: Feature[]
}

export type FeatureTableHeader = {
  id: string
  title: string
}

export type FeatureTableGroupColumn = {
  header?: string
  accessor: string
}

export type FeatureTableGroupRowTitle = {
  value: string
  tooltip: string
}

export type FeatureTableGroupRow = {
  [key: string]:
    | ProductConfig
    | null
    | FeatureTableGroupRowTitle
    | boolean
    | { enabled: boolean }
}

export type FeatureTableGroup = {
  columns: FeatureTableGroupColumn[]
  rows: FeatureTableGroupRow[]
}

export type ProductsFeatureTable = {
  header: FeatureTableHeader[]
  groups: FeatureTableGroup[]
}

export type PreviewInvoiceData = {
  customer?: string
  items?: CheckoutItem[] | string[]
  subscription?: string
}

export type PreviewInvoiceProps = {
  customer?: string
  subscription?: string
  items?: CheckoutItem[] | string[]
}

type StripeSubscriptionStatus = 'active'

export type Subscription = {
  id: string
  status: StripeSubscriptionStatus
}

export interface UpdateSubscriptionActionProps {
  api_key: string
  values: Values
  customer?: Customer
  isSubmitting: boolean
  setIsSubmitting: (isSubmiting: boolean) => void
  setError: (error: PriceBlocsError | Error) => void
}

export type StripeSubscriptionItem = {
  id?: string
  clear_usage?: boolean
  price?: string
  quantity?: string
}

export type UpdateStripeSubscriptionItem = {
  id?: string
  clear_usage?: boolean
  price?: string
  quantity?: string
  deleted?: true
}

export type UpdateSubscriptionProps = {
  id: string
  items: UpdateStripeSubscriptionItem[]
  customer?: string
  proration_date?: number
}

export type UpdateSubscriptionData = {
  id: string
  items: StripeSubscriptionItem[]
  customer: string
  proration_date: number
}

export type ItemizedInvoicePreview = {
  lineItems: {
    uuid: string
    description: string
    quantity: number
    unitAmount: string
    amount: string
  }
  amountItems: {
    uuid: string
    label: string
    amount: string
  }
  confirm: {
    id: string
    items: UpdateStripeSubscriptionItem[]
    proration_date: number
  }
}

export type PreviewInvoice = {
  preview: ItemizedInvoicePreview
  invoice: StripeNode.Invoice
}

export interface PriceBlocsProviderValue {
  ready: boolean
  loading: boolean
  isSubmitting: boolean
  values?: Values
  metadata?: Metadata | null
  error?: PriceBlocsError | Error
  setValues: (values: Values) => void
  setFieldValue: (path: string, value: any) => any
  setError: (value: Error) => any
  refetch: () => void
  checkout: ({ prices }: CheckoutProps, stripe: Stripe | null) => void
  billing: (
    { customer, return_url }: BillingProps,
    stripe: Stripe | null
  ) => void
  checkoutAdd: (props: CheckoutAddData) => Values
  checkoutRemove: (priceId: string) => Values
  previewInvoice: (
    props: PreviewInvoiceProps
  ) => Promise<FetchPreviewInvoiceResponse | void>
  updateSubscription: (
    props: UpdateSubscriptionProps
  ) => Promise<UpdateSubscriptionResponse | void>
  reportUsage: (props: ReportUsageProps, stripe: Stripe | null) => void
  fetchUsage: (props: FetchUsageProps, stripe: Stripe | null) => void
}

export interface PriceBlocsError {
  statusCode: number
  error: string
  message: string
  type: string
  headers: {
    [key: string]: string
  }
  payload: {
    [key: string]: any
  }
  url: string
  method: string
  param: string
  docs: string
  chat: string
}

export interface PriceBlocsContextProps
  extends Pick<CustomerParams, 'customer' | 'customer_email' | 'email'> {
  api_key: string
  children: React.ReactNode | ((props: PriceBlocsProviderValue) => any)
  prices?: string[]
  query?: FetchConfigQueryParams
  success_url?: string
  cancel_url?: string
  return_url?: string
}

export interface PriceBlocsContextType {
  Context: React.Context<null>
  ContextProvider: PriceBlocsProvider | React.Provider<null>
  ContextConsumer: React.Consumer<null>
  useContext: () => PriceBlocsProviderValue
}

export interface PriceBlocsProvider
  extends React.FC<{
    value?: PriceBlocsProviderValue
    children?: React.ReactNode
  }> {}
