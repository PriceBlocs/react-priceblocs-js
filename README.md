# PriceBlocs [beta]

PriceBlocs makes it easy for developers to get started with in-app payments and billing through a set of functional components.

In just a few lines of code you'll be able to:

- Show products and prices
- Initiate checkouts
- Enable billing managment

Everything you need to get started with in-app payments, with less server side code.

- [Getting Started](#getting-started)
- [Workflow](#workflow)
- [API](#api)

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
2. Attach the `checkout` function to any click handler
3. Pass any price id to the `checkout` call

```javascript
import { PriceBlocs } from '@priceblocs/react-priceblocs-js'

export default () => (
  <PriceBlocs api_key="PB_pk_live_123" prices={['price_123']}>
    {({ loading, values, checkout }) => {
      if (loading) {
        return null
      }
      const { products } = values
      const { name, name, prices } = products[0]
      const { id } = prices[0]
      return <button onClick={() => checkout(id)}>{`Buy ${name}`}</button>
    }}
  </PriceBlocs>
)
```

## Workflow

There are 3 steps to adding prices and checkout to your app:

- [Setup](#setup)
  - Wrap any part of your app with an authenticated PriceBlocs component
  - Pass an `api_key` and a set of `prices`
    - Additional checkout and customer [configuration options](#props) can also be passed
- [Present](#present)
  - Access your fetched data via context hooks and use it to present product options to your customers
- [Checkout](#checkout)
  - Attach the `checkout` function to any of your price CTA actions to initiate a new checkout session

### Setup

- Import `PriceBlocs` and initialize it with both:
  - `api_key`: your PriceBlocs publishable API key
    - Use your `PB_pk_live_*` API key for live Stripe resources and checkout
    - Use your `PB_pk_test_*` API key for test Stripe resources and checkout
  - `prices`: set of prices you want to show to customers (live)
- You can also pass additional checkout configuration options like a customer id / email

##### API keys

- Your PriceBlocs account can have both live and test API key sets
- Each set of API keys has both a public and secret key
- Only public keys should be used for client side requests - they can perform read but not write operations to Stripe
- Only `livemode: true` keys can initiate live Stripe checkout charges
- Your connected Stripe account must have `charges_enabled` in order to initiate a checkout session
  - To achieve this, you will need to go throught the Stripe onboarding prompts within the app

| Key name       | Livemode | Audience |
| -------------- | -------- | -------- |
| `PB_sk_live_*` | true     | Secret   |
| `PB_pk_live_*` | true     | Public   |
| `PB_sk_test_*` | false    | Secret   |
| `PB_pk_test_*` | false    | Public   |

```javascript
import { PriceBlocs } from '@priceblocs/react-priceblocs-js'

export default () => {
  const props = {
    api_key: 'PB_pk_test_oYQN',
    prices: ['p_123', 'p_456'],
  }

  return (
    <PriceBlocs {...props}>
      {({ loading, values }) => {
        if (loading) {
          return <Loader />
        } else if (values && values.products && values.products.length > 0) {
          return <PricingTable />
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
| prices                | Yes      | Array  | Array of Stripe price ids to fetch                                                                                                                                             | ['p_123', 'p_456']                                                  |
| success_url           | No       | String | Redirect location after a successful checkout                                                                                                                                  | https://your-site.com/success                                       |
| cancel_url            | No       | String | Redirect location if a user cancels their current checkout session                                                                                                             | https://your-site.com/cancel                                        |
| customer              | No       | String | Stripe customer id                                                                                                                                                             | cu_123                                                              |
| email                 | No       | String | Email for your customer customer. If there is a matching customer within you Stripe account, we will use this to initiate the checkout session in the context of that customer | some.one@email.com                                                  |
| presentation          | No       | Object | Control the presentation of the response                                                                                                                                       | {order: 'desc'}                                                     |
| [query](#query-props) | No       | Object | Fetch associations or expand responses                                                                                                                                         | {customer: {expand: ['default_source'], associations: ['invoices']} |

##### Query props

- An optional query object can be passed to fetch associated collections and expand responses
- For example if you wanted to fetch all of a customers invoices, you could pass that parameter within the customer associations array like below.
- To expand part of the customer response itself, you can pass parameters which align to Stripe's customer expand parameters. Read more [here](https://stripe.com/docs/api/expanding_objects) about expanding Stripe responses.

```javascript
{
  api_key: 'PB_pk_test_oYQN',
  prices: ['p_123', 'p_456'],
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

### Present

- Once initialized, you will be able to access your fetched data via the `usePriceBlocsContext` context hook
- There are a variety of fields to help you present, update and initiate checkout

| Key                             | Type     | Description                                                 |
| ------------------------------- | -------- | ----------------------------------------------------------- |
| [values](#values-api)           | Object   | Core pricing resources like products and featureGroups etc. |
| [checkout](#checkout)           | Function | Start a checkout session                                    |
| [billing](#billing)             | Function | Start a billing portal session for the provided customer    |
| [setFieldValue](#setfieldvalue) | Function | Update any of the context values                            |

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

### Checkout

- Use the `checkout` function from context to start a checkout session
- `checkout` accepts wither a single price or a collection or resources as an argument

```javascript
const { checkout } = usePriceBlocsContext()

// Single price
<button onClick={() => checkout(price.id)}>Buy Now</button>
// Price collection
<button onClick={() => checkout({prices: [price.id]})}>Buy Now</button>
```

### Billing

- Use the `billing` function from context to start a new Stripe billing portal session
- A valid customer id is required to start a new session
- By default, we will use the customer in context if you have initiated PriceBlocs with a valid customer
  - Otherwise you can pass a specific customer id parameter into the billing call

```javascript
const { billing } = usePriceBlocsContext()

// Use default customer if present
<button onClick={billing}>Manage billing</button>
// Provide a customer to the billing call
<button onClick={() => billing({ customer: 'cus_123' })}>Manage billing</button>
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

## API

### Context & Hooks

| Key                  | Type     | Description       |
| -------------------- | -------- | ----------------- |
| PriceBlocs           | HOC      | Context container |
| usePriceBlocsContext | Function | Context hook      |

### Utils

| Key                      | Type     | Description                                                                      |
| ------------------------ | -------- | -------------------------------------------------------------------------------- |
| getActiveProductPrice    | Function | Get the product price based on the current form values for interval and currency |
| getProductFeatures       | Function | Get all features for the provided product                                        |
| getProductsFeaturesTable | Function | Generate a feature table representation for products in context                  |

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

| Key                  | Description                |
| -------------------- | -------------------------- |
| name                 | Name of the product        |
| description          | Description of the product |
| [prices](#price-api) | Array of Stripe prices     |

##### Price API

- This shape is closely aligned to the [Stripe prices API](https://stripe.com/docs/api/pricess/object)

| Key                                | Description                                  |
| ---------------------------------- | -------------------------------------------- |
| id                                 | Stripe price id                              |
| unit_amount                        | Unit amount for the price                    |
| currency                           | Stripe price id                              |
| product                            | Stripe product id which the price belongs to |
| [formatted](#price-formatting-api) | Formatted price values                       |
| symbol                             | Currency symbol for this price               |

###### Price formatting API

- We format the unit_amount of each price so you don't have to.
- This also includes formatting them for a variery of different intervals (day, week, month, year)
- Each formatted interval is accessible under the `intervals` key

| Key         | Description                                                                                                        | Example                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| unit_amount | Formatted version of the unit amount                                                                               | 12000 -> $120.00                                                 |
| intervals   | Price formatted for different intervals [day, week, month, year]. e.g a yearly price presented as a per month cost | { day: "$0.33", week: "$2.31", month: "$10.00", year: "$120.00"} |

#### Customer API

This shape is closely aligned to the [Stripe customers API](https://stripe.com/docs/api/customer/object)
This object will be extended with any additional expanded attributes or associations requested via the initial [query props](#query-props)

| Key           | Present       | Required                                      |
| ------------- | ------------- | --------------------------------------------- |
| id            | always        | ID of the Customer                            |
| email         | always        | Email of the Customer                         |
| invoices      | conditionally | Array of this Customer's Stripe invoices      |
| subscriptions | conditionally | Array of this Customer's Stripe subscriptions |
| cards         | conditionally | Array of this Customer's Stripe cards         |

#### Form API

| Key                                    | Description                                             | Example             |
| -------------------------------------- | ------------------------------------------------------- | ------------------- |
| interval                               | The default interval based on prices in config response | 'month'             |
| intervals                              | Set of intervals for prices in response                 | ['month', 'year']   |
| currency                               | The default currency based on prices in config response | 'usd'               |
| currencies                             | Set of intervals for prices in response                 | ['usd','eur']       |
| [presentation](#form-presentation-api) | Presentation values for form                            | {interval: "month"} |

#### Form presentation API

| Key      | Description                                                                                                                                                                 | Example |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| interval | The interval presentation interval. For example 'month' will present all amounts in terms of per month pricing, so a $120 per year price will be presented as $10 per month | 'month' |

#### Feature Groups API

| Key                       | Present       | Required                                        | Example                              |
| ------------------------- | ------------- | ----------------------------------------------- | ------------------------------------ |
| uuid                      | always        | UUID for the feature group                      | 847169d9-05bf-485f-8d01-637189e9c9a1 |
| title                     | always        | Title for the feature group                     | Analytics & Reports                  |
| [features](#features-api) | conditionally | Array of Features included in the feature group |                                      |

##### Feature API

| Key                                   | Required                                                                      | Example                              |
| ------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------ |
| uuid                                  | UUID of the feature group                                                     | f0ecdee3-579f-4a9f-aeba-92ff9dbaa767 |
| title                                 | Report generator                                                              | Analytics & Reports                  |
| description                           | Generate monthly financial reports                                            | Analytics & Reports                  |
| [product_config](#product-config-api) | Definition of what products are enabled for this feature, keyed by product id | { product_123: { enabled: true } }   |

##### Product Config API

| Key     | Type    | Required                     | Example                   |
| ------- | ------- | ---------------------------- | ------------------------- |
| enabled | boolean | UUID of the feature group    | true                      |
| value   | string  | Value for the config         | Limit 100 runs a month    |
| tooltip | string  | Optional tooltip for feature | Custom scheduling allowed |
