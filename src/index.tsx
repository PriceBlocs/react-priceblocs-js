import * as React from 'react'
import { clone, set } from 'lodash'
import { Elements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import {
  CheckoutProps,
  Metadata,
  PriceBlocsContextProps,
  Values,
  PriceBlocsError,
  PriceBlocsProviderValue,
  PriceBlocsProvider,
  StripeElementContextProps,
  WithStripeContextProps,
  PriceBlocsContextType,
  BillingProps,
  Error,
} from './types'
import * as Hooks from './hooks'
import * as Utils from './utils'
import * as Constants from './constants'
import {
  checkout,
  previewInvoice,
  updateSubscription,
  reportUsage,
  billing,
  fetchData,
  fetchUsage,
} from './actions'
import { checkoutAdd, checkoutRemove } from './form'

const createUseContext = (
  contextProviderWrapperCreator: (
    provider: PriceBlocsProvider
  ) => PriceBlocsProvider
): PriceBlocsContextType => {
  const Context = React.createContext<null>(null)
  const useContext = () => React.useContext(Context)
  let ContextProvider

  if (typeof contextProviderWrapperCreator === 'function') {
    ContextProvider = contextProviderWrapperCreator(Context.Provider)
  } else {
    ContextProvider = Context.Provider
  }

  return {
    Context,
    ContextProvider,
    ContextConsumer: Context.Consumer,
    useContext,
  }
}

const WithStripeContext = ({
  children,
  Provider,
  providerValue,
  setReady,
  ready,
}: WithStripeContextProps) => {
  const stripe = useStripe()

  /**
   * Once Stripe is initialized set ready: true
   */
  React.useEffect(() => {
    if (stripe && !ready) {
      setReady(true)
    }
  }, [stripe, ready])

  const initialCheckout = providerValue.checkout
  const initialBilling = providerValue.billing

  const value = {
    ...providerValue,
    /**
     * Proxy checkout and billing calls through this function
     * so that the Stripe instance doesn't need to be exposed / managed by the consumer
     */
    checkout: async (props: CheckoutProps) => initialCheckout(props, stripe),
    billing: async (props: BillingProps) => initialBilling(props, stripe),
  }

  return <Provider value={value}>{children}</Provider>
}

const StripeElementContainer = (props: StripeElementContextProps) => {
  const promise = React.useMemo(() => loadStripe(props.clientKey), [])

  return (
    <Elements stripe={promise}>
      <WithStripeContext
        setReady={props.setReady}
        ready={props.ready}
        providerValue={props.providerValue}
        Provider={props.Provider}
      >
        {props.children}
      </WithStripeContext>
    </Elements>
  )
}

export const {
  Context: PriceBlocsContext,
  ContextProvider: PriceBlocs,
  useContext: usePriceBlocsContext,
  /* eslint-disable-next-line react/display-name, react/prop-types */
} = createUseContext(
  (Provider: PriceBlocsProvider) =>
    (contextProps: PriceBlocsContextProps): any => {
      const {
        children,
        api_key,
        success_url,
        cancel_url,
        return_url,
        prices,
        query,
        values: initialValues,
      } = contextProps

      const [metadata, setMetadata] = React.useState<Metadata | undefined>()
      const [values, setValues] = React.useState<Values | undefined>(
        initialValues
      )
      const [loading, setLoading] = React.useState(false)
      const [initialFetch, setInitialFetch] = React.useState(false)
      const [ready, setReady] = React.useState(false)
      const [isSubmitting, setIsSubmitting] = React.useState(false)
      const [error, setError] = React.useState<PriceBlocsError | Error | null>(
        null
      )
      const clientKey = values && values.admin && values.admin.clientKey

      const setFieldValue = (path: string, value: any) => {
        const updatedValues = clone(values)
        set(updatedValues as Values, path, value)
        setValues(updatedValues)
      }
      const customer = values ? values.customer : null
      const customerId = contextProps.customer
      const customerEmail = contextProps.customer_email
      const email = contextProps.email

      const refetch = fetchData({
        api_key,
        customer: customerId,
        customer_email: customerEmail,
        email: email,
        prices,
        query,
        loading,
        setLoading,
        setValues,
        setMetadata,
        setError,
      })

      /**
       * Fetch values on mount if
       * - no values
       * - not loading
       * - no error
       * - initial fetch has not happened
       */
      const preventRequest = Boolean(loading || error)
      React.useEffect(() => {
        if (!values && !preventRequest && !initialFetch) {
          setInitialFetch(true)
          refetch()
        }
      }, [values, loading, error, initialFetch])

      /**
       * Auto-refetch if
       * - any of the customer references have changed
       * - at least one is present
       */
      React.useEffect(() => {
        const hasCustomerRef = Boolean(customerId || customerEmail || email)
        if (hasCustomerRef && !error) {
          refetch()
        }
      }, [customerId, customerEmail, email])

      const commonProps = {
        api_key,
        customer,
        isSubmitting,
        setIsSubmitting,
        setError,
      }

      const providerValue: PriceBlocsProviderValue = {
        ready,
        loading,
        isSubmitting,
        setValues,
        setFieldValue,
        setError,
        refetch: refetch,
        checkout: checkout({
          ...commonProps,
          success_url,
          cancel_url,
          return_url,
          metadata,
        }),
        billing: billing({
          ...commonProps,
          return_url,
        }),
        checkoutAdd: checkoutAdd({ setValues, values }),
        checkoutRemove: checkoutRemove({ setValues, values }),
        previewInvoice: previewInvoice({
          ...commonProps,
          values,
        }),
        updateSubscription: updateSubscription({
          ...commonProps,
          values,
        }),
        reportUsage: reportUsage(commonProps),
        fetchUsage: fetchUsage(commonProps),
      }

      if (values) {
        providerValue.values = values
      }
      if (metadata) {
        providerValue.metadata = metadata
      }
      if (error) {
        providerValue.error = error
      }

      const content =
        typeof children === 'function' ? children(providerValue) : children

      /**
       * Client key is required to initialize the Stripe container
       */
      return clientKey ? (
        <StripeElementContainer
          ready={ready}
          setReady={setReady}
          clientKey={clientKey}
          providerValue={providerValue}
          Provider={Provider}
        >
          {content}
        </StripeElementContainer>
      ) : (
        <Provider value={providerValue}>{content}</Provider>
      )
    }
)

/**
 * Hooks
 */
export const useActiveProductPrice = Hooks.useActiveProductPrice
export const useSubscriptionItemForPrice = Hooks.useSubscriptionItemForPrice
export const useEntitlement = Hooks.useEntitlement
export const useFeature = Hooks.useFeature

/**
 * Utils
 */
export const getGoodStandingSubscriptions = Utils.getGoodStandingSubscriptions
export const getActiveProductPrice = Utils.getActiveProductPrice
export const getProductFeatures = Utils.getProductFeatures
export const getProductsFeaturesTable = Utils.getProductsFeaturesTable

/**
 * Constants
 */
export const RECURRING_INTERVALS = Constants.RECURRING_INTERVALS
export const INTERVAL_LABELS_MAP = Constants.INTERVAL_LABELS_MAP
export const INTERVAL_SHORTHAND_MAP = Constants.INTERVAL_SHORTHAND_MAP
