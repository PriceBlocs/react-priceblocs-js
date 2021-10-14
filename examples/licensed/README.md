# Licensed - React PriceBlocs JS

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fhello-world)
[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://githubbox.com/dferber90/githubbox)

- This is a full example of a licensed billing plan page powered by PriceBlocs.
- We provide a set of payments building blocks to help you add pricing, billing and more to your applications.

## Local development

Install and run to get started with the local development server

```
npm i && npm run start
```

## Quick start

This demo app is setup using the functional component exported from `@priceblocs/react-priceblocs-js`. This component

1. Fetches your declared Stripe resources
2. Stores and shares the response via context

You can learn more about the `@priceblocs/react-priceblocs-js` API [here](https://github.com/PriceBlocs/react-priceblocs-js#quick-start).

### How it works

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
        const { name, name, prices } = products[0]
        const { id } = prices[0]
        return <button onClick={() => checkout(id)}>{`Buy ${name}`}</button>
      }}
    </PriceBlocs>
  )
}
```

## Use your own Stripe resources

- Replace the sandbox `api_key` within this example with your own PriceBlocs API key.
- You can sign up for PriceBlocs [here](https://priceblocs.com/signup) to get a set of API keys.
- Your PriceBlocs account will have both live and test API key sets
- Only public keys should be used for client side requests
- Only `livemode: true` keys can initiate live Stripe checkout charges
- Use your `PB_pk_live_*` API key for **live** Stripe resources
- Use your `PB_pk_test_*` API key for **test** Stripe resources

| Key name       | Livemode | Audience |
| -------------- | -------- | -------- |
| `PB_pk_live_*` | true     | Public   |
| `PB_pk_test_*` | false    | Public   |

- You can then pass the appropriate references for the API key you're using.
- e.g. only pass test price ids when using the `PB_pk_test_*` key and live price ids when using `PB_pk_live_*`
