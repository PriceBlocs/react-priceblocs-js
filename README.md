# React PriceBlocs JS [beta]

[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label=Get%20support%20on)](https://discord.gg/PhFdFD2HvU)

PriceBlocs makes it easy for developers to get started with in-app payments and billing through a set of functional components.

In just a few lines of code you'll be able to:

- Show products and prices
- Initiate checkouts
- Enable billing managment

Everything you need to get started with in-app payments, with less server side code.

- [Getting Started](#getting-started)
- [Workflow](#workflow)
- [API](#api)
- [Examples](examples/index.md)

## Getting started

- API Keys - Sign up for [PriceBlocs](https://priceblocs.com) and get your publishable API keys.
- Test mode - Enable test mode from within the app to use test Stripe resources for local development.
- [Install](#install) - Add `@priceblocs/react-priceblocs-js` to your project

Our first set of components and hooks are compatible with React, examples of which you can see below.

### Install

- @priceblocs/react-priceblocs-js is available via npm

```
npm i --save @priceblocs/react-priceblocs-js
```

## Quick start

The quickest way to get started is to:

1. Wrap any content with an authenticated PriceBlocs component
   1. Production: use a live api key and Stripe prices where livemode is true
   2. Development: use a test api key and Stripe prices where livemode is false
2. Attach the `checkout` function to any click handler
3. Pass any price id to the `checkout` call

```javascript
import { PriceBlocs } from '@priceblocs/react-priceblocs-js'

export default () => {
  const props =
    process.env.NODE_ENV === 'production'
      ? {
          api_key: 'PB_pk_live_*',
          prices: ['price_123'],
        }
      : {
          api_key: 'PB_pk_test_*',
          prices: ['price_456'],
        }

  return (
    <PriceBlocs {...props}>
      {({ loading, values, checkout }) => {
        if (loading || !values) {
          return null
        }
        const { products } = values
        const { name, prices } = products[0]
        const { id } = prices[0]
        return <button onClick={() => checkout(id)}>{`Buy ${name}`}</button>
      }}
    </PriceBlocs>
  )
}
```

## Workflow

There are 3 steps to adding prices and checkout to your app:

- [Setup](#setup)
  - Wrap any part of your app with an authenticated PriceBlocs component
  - Pass an `api_key` and a set of `prices`
    - Additional checkout and customer [configuration options](#props) can also be passed
- [Presentation](#presetnation)
  - Access your fetched data via context hooks and use it to present product options to your customers
- [Checkout](#checkout)
  - Attach the `checkout` function to any of your price CTA actions to initiate a new checkout session

### Setup

- Import `PriceBlocs` and initialize it with both:
  - `api_key`: your PriceBlocs publishable API key
    - Use your `PB_pk_live_*` API key for live Stripe resources and checkout
    - Use your `PB_pk_test_*` API key for test Stripe resources and checkout
  - `prices`: set of prices you want to show to customers
- You can also pass additional checkout configuration options like a customer id / email

##### API keys

- Your PriceBlocs account can have both live and test API key sets
- Each set of API keys has both a public and secret key
- Only public keys should be used for client side requests
- Only `livemode: true` keys can initiate live Stripe checkout charges

| Key name       | Livemode | Audience |
| -------------- | -------- | -------- |
| `PB_sk_live_*` | true     | Secret   |
| `PB_pk_live_*` | true     | Public   |
| `PB_sk_test_*` | false    | Secret   |
| `PB_pk_test_*` | false    | Public   |

- Your connected Stripe account must have `charges_enabled` in order to initiate a checkout session
  - To achieve this, you will need to complete Stripe's business verification onboarding process

```javascript
import { PriceBlocs } from '@priceblocs/react-priceblocs-js'

export default () => {
  const props =
    process.env.NODE_ENV === 'production'
      ? {
          api_key: 'PB_pk_live_*',
          prices: ['price_123'],
        }
      : {
          api_key: 'PB_pk_test_*',
          prices: ['price_456'],
        }

  return (
    <PriceBlocs {...props}>
      {({ loading, values }) => {
        if (loading) {
          return <YourLoader />
        } else if (values && values.products && values.products.length > 0) {
          return <YourPricingTable />
        }
        return null
      }}
    </PriceBlocs>
  )
}
```

#### Props

| Key                   | Required | Type   | Description                                                                                                                                                                    | Example                                                             |
| --------------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| api_key               | Yes      | String | One of your PriceBlocs publishable API key                                                                                                                                     | PB_pk_test_sRADszm...                                               |
| prices                | Yes      | Array  | Array of Stripe price ids to fetch                                                                                                                                             | ['price_123', 'price_456']                                          |
| success_url           | No       | String | Redirect location after a successful checkout                                                                                                                                  | https://your-site.com/success                                       |
| cancel_url            | No       | String | Redirect location if a user cancels their current checkout session                                                                                                             | https://your-site.com/cancel                                        |
| customer              | No       | String | Stripe customer id                                                                                                                                                             | cu_123                                                              |
| email                 | No       | String | Email for your customer customer. If there is a matching customer within you Stripe account, we will use this to initiate the checkout session in the context of that customer | some.one@email.com                                                  |
| presentation          | No       | Object | Control the presentation of the response                                                                                                                                       | {order: 'desc'}                                                     |
| [query](#query-props) | No       | Object | Fetch associations or expand responses                                                                                                                                         | {customer: {expand: ['default_source'], associations: ['invoices']} |
| [values](#values-api) | No       | Object | Values to initialize context with and prevent fetch on mount                                                                                                                   | {products: [...], ...}                                              |

##### Query props

- An optional query object can be passed to fetch associated collections and expand responses
- For example if you wanted to fetch all of a customers invoices, you could pass that parameter within the customer associations array like below.
- To expand part of the customer response itself, you can pass parameters which align to Stripe's customer expand parameters. Read more [here](https://stripe.com/docs/api/expanding_objects) about expanding Stripe responses.

```javascript
{
  api_key: 'PB_pk_test_oYQN',
  prices: ['price_123', 'price_456'],
  customer: 'cus_123',
  query: {
    customer: {
      expand: [
        'default_source',
        'invoice_settings.default_payment_method'
      ],
      associations: [
        'invoices',
        'subscriptions',
        'cards'
      ]
    }
  }
}
```

- You can then access the associations and expanded properties on the related resource within the context values
- For example, customer associations and expansions are then available on the customer object

```javascript
const {
  values: {
    customer: { default_source, subscriptions, invoices, cards },
  },
} = usePriceBlocsContext()
```

### Presentation

- Once initialized, you will be able to access your fetched data via the `usePriceBlocsContext` context hook
- There are a variety of fields to help you:
  - present price options
  - update context values
  - initiate checkout and billing sessions
  - preview and confirm subscription updates
  - manage checkout cart and more

| Key                                       | Type     | Description                                                                         |
| ----------------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| [values](#values-api)                     | Object   | Core pricing resources like products and featureGroups etc.                         |
| [refetch](#refetch)                       | Function | Function to refetch values from API using initial props                             |
| [checkout](#checkout)                     | Function | Start a checkout session                                                            |
| [billing](#billing)                       | Function | Start a billing portal session for the provided customer                            |
| [checkoutAdd](#checkoutAdd)               | Function | Add a price to the form checkout items                                              |
| [checkoutRemove](#checkoutRemove)         | Function | Remove a price from the form checkout items                                         |
| [previewInvoice](#previewInvoice)         | Function | Request a preview of the next invoice for the subscription                          |
| [fetchUsage](#fetchUsage)                 | Function | Fetch usage summary for a subscription line item                                    |
| [reportUsage](#reportUsage)               | Function | Report usage summary for a subscription line item                                   |
| [updateSubscription](#updateSubscription) | Function | Update a subscription with the a collection of updated subscription items           |
| [setFieldValue](#setfieldvalue)           | Function | Update any of the context values                                                    |
| [setValues](#setvalues)                   | Function | Update all of the context values                                                    |
| ready                                     | Boolean  | True when Stripe has been initialized and consumer can initialize checkout sessions |
| loading                                   | Boolean  | True when fetching                                                                  |
| isSubmitting                              | Boolean  | True when submitting                                                                |
| stripe                                    | Object   | Stripe instance initialized and available for use in context                        |
| error                                     | Error    | Any errors in local state                                                           |
| [setError](#seterror)                     | Error    | Set error in local state                                                            |

```javascript
import {
  usePriceBlocsContext,
  getActiveProductPrice,
} from '@priceblocs/react-priceblocs-js'

const PricingTable = () => {
  const {
    values: { products },
    form: { currency, interval },
    checkout,
  } = usePriceBlocsContext()

  return (
    <div>
      <ul>
        {products.map((product, productIx) => {
          const price = getActiveProductPrice(product, { currency, interval })
          return (
            <li key={product.id}>
              <div>
                <div>{product.name}</div>
                <div>{product.description}</div>
              </div>
              <button onClick={() => checkout({ prices: [price.id] })}>
                Buy Now
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

### refetch

- Use the `refetch` function to refetch values from the API

```javascript
const { refetch } = usePriceBlocsContext()

// Single price
<button onClick={() => refetch()}>Refetch</button>
```

### checkout

- Use the `checkout` function from context to start a checkout session
- `checkout` accepts either a single price or a collection or resources as an argument

```javascript
const { checkout } = usePriceBlocsContext()

// Single price
<button onClick={() => checkout(price.id)}>Buy Now</button>
// Price collection
<button onClick={() => checkout({prices: [price.id]})}>Buy Now</button>
```

### billing

- Use the `billing` function from context to start a new Stripe billing portal session for one of your customers
- A valid customer id is required to start a new session
- By default, we will use the customer in context if you have initiated PriceBlocs with a valid customer
  - Otherwise you can pass a specific customer id parameter into the billing call
- Your Stripe billing portal can be confiugred within Stripe [here](https://dashboard.stripe.com/settings/billing/portal)

```javascript
const { billing } = usePriceBlocsContext()

// Use default customer if present
<button onClick={billing}>Manage billing</button>
// Provide a customer to the billing call
<button onClick={() => billing({ customer: 'cus_123' })}>Manage billing</button>
```

### previewInvoice

- Use the `previewInvoice` function from context to preview what an upcoming invoice for a subscription will look like based on the items passed in the request
- To preview changes against a specific subscription, pass its `id` as well as a collection of `items` to preview

```javascript
const previewData = await previewInvoice({
  subscription: 'sub-123',
  items: [
    {
      price: 'p_123',
    },
  ],
})
```

- The preview response will include an itemized preview for the upcoming invoice and the raw invoice itself.

| Key                                                      | Description                                             |
| -------------------------------------------------------- | ------------------------------------------------------- |
| [preview](#invoice-preview)                              | Itemized invoice preview including confirmation payload |
| [invoice](https://stripe.com/docs/api/invoices/upcoming) | The raw Stripe invoice which is being previewed         |

#### Invoice preview

- The preview response includes `lineItems`, `amountItems` which describe the invoices details as well as a `confirm` object which can be passed in a subsequent `updateSubscription` request to update the associated subscription.

| Key         | Description                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------- |
| lineItems   | A collection which describing the elements of the invoice                                     |
| amountItems | A collection which describes the total amounts due / credited / paid etc.                     |
| confirm     | A payload which can be passed in a subscription update request to apply the previewed changes |

### updateSubscription

- Use the `updateSubscription` function from context to update a customers subscription with the options passed.

```javascript
const previewData = await updateSubscription({
  id: 'sub-123',
  items: [
    {
      id: "si_123",
      deleted: true,
      clear_usage: true,
    },
    {
      id: "si_456",
      price: "p_B_1"
    },
    {
      price: "p_A_3"
    }
  ]
  proration_data: 12345678
})
```

- For convenience you can pick the `confirm` object from the `invoicePreview` response and use it when calling `updateSubscription`.
- A `proration_date` timestamp is included in the preview response so that it too is available to be passed along in the request.

```javascript
const response = await previewInvoice({
  subscription: 'sub-123',
  items: [
    {
      price: 'p_123',
    },
  ],
})
await updateSubscription(response.preview.confirm)
```

### fetchUsage

- Use the `fetchUsage` function from context to fetch all of the usage summaries for a subscription item
- Each summary represents multiple usage records over a subscription billing period (e.g., 15 usage records in the month of September).

```javascript
const previewData = await fetchUsage({
  subscription_item: 'sub-item-123',
})
```

- The response will include a collection of summary records as well as some aggregate totals.

| Key                 | Description                                   |
| ------------------- | --------------------------------------------- |
| total_usage         | Sum total of all the summary records          |
| total_cost          | Total usage multiplied by the cost per unit   |
| unit_amount         | Unit amount for the subscription item         |
| unit_cost           | Formatted cost amount for a unit amount value |
| [data](#usage-data) | Collection of usage summaries                 |

#### Usage data

- Each usage summary record describes the amount of usage between the priod start and end date

| Key               | Description                                       |
| ----------------- | ------------------------------------------------- |
| id                | Summary usage record id                           |
| invoice           | Id of the invoice the summary belongs to          |
| livemode          | Whether its a live or test Stripe record          |
| [period](#period) | Timestamp info for the summary                    |
| subscription_item | Subscription item id the usage summary belongs to |
| total_usage       | Sum count of the total usage for that period      |

##### Period

- Describes the timeframe for the usage summary

| Key   | Description                        |
| ----- | ---------------------------------- |
| label | Formatted timestamp for the period |
| start | Unix timestamp for period start    |
| end   | Unix timestamp for period end      |

### reportUsage

- Use the `reportUsage` function from context to report usage for a particular `subscription_item`
- e.g. this could be used for counting restricted API calls
- You can specify additional fields like `quantity`, `timestamp`, and `action`

```javascript
const previewData = await fetchUsage({
  subscription_item: 'sub-item-123',
})
```

- Each additional field has default values if not specified

| Key       | Description                                    | Default               |
| --------- | ---------------------------------------------- | --------------------- |
| quantity  | Formatted timestamp for the period             | 1                     |
| timestamp | Unix timestamp usage recording                 | Now as unix timestamp |
| action    | Usage action type, can be 'increment' or 'set' | increment             |

### setValues

- You can use the `setValues` function to replace the entire values object in context
- This function is used internally on `refetch`
- Avoid using this function unless necessary. Calling `refetch` is better for most use cases.

```javascript
const {
  setValues,
} = usePriceBlocsContext()

<button onClick={() => setValues({...})}>Set all values</button>
```

### setFieldValue

- You can use the `setFieldValue` function to update any of the state in context
- This can be useful for updating values such as the `interval` or `currency` within the `form` state to assist with presentation logic
- You can pass a dot path to target nested fields for updates

```javascript
const {
  setFieldValue,
} = usePriceBlocsContext()

<button onClick={() => setFieldValue('form.interval', 'month')}>Show monthly prices</button>
```

### setError

- You can use the `setError` function to set the local error object

```javascript
const {
  setError,
} = usePriceBlocsContext()

<button onClick={() => setError(new Error('Custom error'))}>Set error</button>
```

## API

### Context & Hooks

| Key                  | Type     | Description       |
| -------------------- | -------- | ----------------- |
| PriceBlocs           | HOC      | Context container |
| usePriceBlocsContext | Function | Context hook      |

### Utils

| Key                          | Type     | Description                                                                      |                 |
| ---------------------------- | -------- | -------------------------------------------------------------------------------- | --------------- |
| getActiveProductPrice        | Function | Get the product price based on the current form values for interval and currency |                 |
| getProductFeatures           | Function | Get all features for the provided product                                        |                 |
| getProductsFeaturesTable     | Function | Generate a feature table representation for products in context                  |                 |
| getGoodStandingSubscriptions | Function | Filter subscriptions in context to ones with either an active                    | trialing status |

### Constants

| Key                    | Type   | Description                                  | Example   |
| ---------------------- | ------ | -------------------------------------------- | --------- |
| RECURRING_INTERVALS    | Object | A mapping of the 4 recurring intervals       | 'month'   |
| INTERVAL_LABELS_MAP    | Object | A mapping of each interval to it's label     | 'monthly' |
| INTERVAL_SHORTHAND_MAP | Object | A mapping of each interval to it's shorthand | 'mo'      |

### Schema

#### Values API

| Key                                  | Type   | Description                                                               |
| ------------------------------------ | ------ | ------------------------------------------------------------------------- |
| [products](#product-api)             | Array  | An array of products                                                      |
| [customer](#customer-api)            | Object | A Stripe customer                                                         |
| [form](#form-api)                    | Object | Form state values like currencies and intervals to help with presentation |
| [featureGroups](#feature-groups-api) | Array  | An array of feature groups                                                |

#### Product API

This shape is closely aligned to the [Stripe products API](https://stripe.com/docs/api/products/object)

| Key                       | Description                                   |
| ------------------------- | --------------------------------------------- |
| name                      | Name of the product                           |
| description               | Description of the product                    |
| [prices](#price-api)      | Array of Stripe prices                        |
| [features](#features-api) | Array of features associated with the product |

##### Price API

This shape is closely aligned to the [Stripe prices API](https://stripe.com/docs/api/pricess/object)

| Key                                | Description                                  |
| ---------------------------------- | -------------------------------------------- |
| id                                 | Stripe price id                              |
| unit_amount                        | Unit amount for the price                    |
| currency                           | Stripe price id                              |
| product                            | Stripe product id which the price belongs to |
| [formatted](#price-formatting-api) | Formatted price values                       |
| symbol                             | Currency symbol for this price               |

###### Price formatting API

- We format the `unit_amount` of each price so you don't have to.
- This also includes formatting them for a variery of different intervals `day | week | month | year`
- Each formatted interval is accessible under the `intervals` key

| Key         | Description                                                                                                        | Example                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| unit_amount | Formatted version of the unit amount                                                                               | 12000 -> $120.00                                                 |
| intervals   | Price formatted for different intervals [day, week, month, year]. e.g a yearly price presented as a per month cost | { day: "$0.33", week: "$2.31", month: "$10.00", year: "$120.00"} |

#### Customer API

This shape is closely aligned to the [Stripe customers API](https://stripe.com/docs/api/customer/object)
This object will be extended with any additional expanded attributes or associations requested via the initial [query props](#query-props)

| Key           | Present       | Required                                      | ation |
| ------------- | ------------- | --------------------------------------------- | ----- |
| id            | always        | ID of the Customer                            |
| email         | always        | Email of the Customer                         |
| invoices      | conditionally | Array of this Customer's Stripe invoices      |
| subscriptions | conditionally | Array of this Customer's Stripe subscriptions |
| cards         | conditionally | Array of this Customer's Stripe cards         |

#### Form API

| Key                                    | Description                                             | Example                               |
| -------------------------------------- | ------------------------------------------------------- | ------------------------------------- |
| interval                               | The default interval based on prices in config response | 'month'                               |
| intervals                              | Set of intervals for prices in response                 | ['month', 'year']                     |
| currency                               | The default currency based on prices in config response | 'usd'                                 |
| currencies                             | Set of intervals for prices in response                 | ['usd','eur']                         |
| usage_types                            | Set of usage_types for prices in response               | ['licensed']                          |
| [checkout](#form-checkout-api)         | The checkout object which contains purchasable prices   | {items: [{price: {id: 'price_123'}}]} |
| [presentation](#form-presentation-api) | Presentation values for ationform                       | {interval: "month"}                   |

##### Form checkout API

- Object which can be used to store checkout related options like items for purchase.
- These items can be passed along in any `checkout` call
- These items will also be used as the default collection of prices for an preview invoice request

| Key                              | Description             |
| -------------------------------- | ----------------------- |
| [items](#form-checkout-item-api) | Array of checkout items |

##### Form checkout item API

- Closely aligned to the [Stripe SubscriptionItem API](https://stripe.com/docs/api/subscription_items/object)

| Key      | Required | Description          |
| -------- | -------- | -------------------- |
| price    | yes      | Object with price id |
| quantity | no       | Quantity of price    |

#### Form presentation API

| Key      | Description                                                                                                                                                                 | Example |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| interval | The interval presentation interval. For example 'month' will present all amounts in terms of per month pricing, so a $120 per year price will be presented as $10 per month | 'month' |

#### Feature Groups API

| Key                       | Present       | Description                                     | Example                              |
| ------------------------- | ------------- | ----------------------------------------------- | ------------------------------------ |
| uuid                      | always        | UUID for the feature group                      | 847169d9-05bf-485f-8d01-637189e9c9a1 |
| title                     | always        | Title for the feature group                     | Analytics & Reports                  |
| [features](#features-api) | conditionally | Array of Features included in the feature group |                                      |

##### Feature API

| Key         | Description                        | Example                              |
| ----------- | ---------------------------------- | ------------------------------------ |
| uuid        | UUID of the feature group          | f0ecdee3-579f-4a9f-aeba-92ff9dbaa767 |
| title       | Report generator                   | Analytics & Reports                  |
| description | Generate monthly financial reports | Analytics & Reports                  |

##### Product Config API

| Key     | Type    | Description                  | Example                   |
| ------- | ------- | ---------------------------- | ------------------------- |
| enabled | boolean | UUID of the feature group    | true                      |
| value   | string  | Value for the config         | Limit 100 runs a month    |
| tooltip | string  | Optional tooltip for feature | Custom scheduling allowed |
