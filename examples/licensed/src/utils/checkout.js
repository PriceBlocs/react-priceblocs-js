export const getPriceCheckoutButtonProps = ({ price, product }) => {
  const isSubscribed = Boolean(
    price && product && product.subscription && price.subscription
  )
  return {
    checkout: { prices: [price.id] },
    value: isSubscribed ? 'Active' : 'Select',
  }
}
