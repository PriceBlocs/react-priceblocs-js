export const getPriceCheckoutButtonProps = ({ price, product }) => {
  const isSubscribed = Boolean(
    price && product && product.subscription && price.subscription
  )
  return {
    checkout: { prices: [price.id] },
    copy: {
      value: isSubscribed ? 'Active' : 'Select',
    },
  }
}
