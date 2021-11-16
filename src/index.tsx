import * as React from 'react'
import { clone, set } from 'lodash'
import { Elements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import {
  Metadata,
  PriceBlocsContextProps,
  Values,
  PriceBlocsError,
  PriceBlocsProviderValue,
  PriceBlocsProvider,
  StripeElementContextProps,
  WithStripeContextProps,
  PriceBlocsContextType,
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
  setStripe,
  ready,
}: WithStripeContextProps) => {
  /**
   * Once Stripe is initialized cache the instance
   */
  const stripe = useStripe()
  React.useEffect(() => {
    if (stripe && !ready) {
      setStripe(stripe)
    }
  }, [stripe, ready])

  return <Provider value={providerValue}>{children}</Provider>
}

const StripeElementContainer = (props: StripeElementContextProps) => {
  const promise = React.useMemo(() => loadStripe(props.clientKey), [])

  return (
    <Elements stripe={promise}>
      <WithStripeContext
        setStripe={props.setStripe}
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
        values: initialValues,
        success_url,
        cancel_url,
        return_url,
        config: initialConfig,
        ...fetchConfigProps
      } = contextProps

      const config = Utils.getConfig(initialConfig)

      const [metadata, setMetadata] = React.useState<Metadata | undefined>()
      const [values, setValues] = React.useState<Values | undefined>(
        initialValues
      )
      const [loading, setLoading] = React.useState(false)
      const [initialFetch, setInitialFetch] = React.useState(false)
      const [stripe, setStripe] = React.useState(null)
      const ready = Boolean(stripe)
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
        setLoading,
        setValues,
        setMetadata,
        setError,
        api_key,
        customer: customerId,
        customer_email: customerEmail,
        email: email,
        loading,
        success_url,
        cancel_url,
        ...fetchConfigProps,
      })

      /**
       * Fetch values on mount if
       * - no values
       * - not loading
       * - no error
       * - initial fetch has not happened
       * - initial_fetch
       */
      React.useEffect(() => {
        const preventRequest = Boolean(loading || error)
        const makeInitialFetch =
          !values && !preventRequest && !initialFetch && config.fetch.onMount

        if (makeInitialFetch) {
          setInitialFetch(true)
          refetch()
        }
      }, [values, loading, error, initialFetch, config.fetch.onMount])

      /**
       * Auto-refetch if
       * - any of the customer references have changed
       * - at least one is present
       * - no errors
       */
      React.useEffect(() => {
        const hasCustomerRef = Boolean(customerId || customerEmail || email)
        const makeOnCustomerChangeFetch =
          hasCustomerRef && !error && config.fetch.onCustomerChange
        if (makeOnCustomerChangeFetch) {
          refetch({ force: true })
        }
      }, [customerId, customerEmail, email, config.fetch.onCustomerChange])

      const commonProps = {
        api_key,
        customer,
        isSubmitting,
        setIsSubmitting,
        setError,
      }

      const providerValue: PriceBlocsProviderValue = {
        ready,
        stripe,
        loading,
        isSubmitting,
        setValues,
        setFieldValue,
        setError,
        refetch: refetch,
        checkout: checkout({
          ...commonProps,
          stripe,
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
          setStripe={setStripe}
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
export const useCheckoutCart = Hooks.useCheckoutCart
export const useGoodStandingSubscriptions = Hooks.useGoodStandingSubscriptions
export const usePreviewInvoice = Hooks.usePreviewInvoice

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
