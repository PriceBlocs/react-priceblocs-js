import {
  usePriceBlocsContext,
  getGoodStandingSubscriptions
} from "@priceblocs/react-priceblocs-js";
import xor from "lodash/xor";

/**
 * Want to conditionally enable / disable checkout updates
 * If subscription present - will preview then update
 * Else will create a new one
 */
export const useCartCheckout = ({ price, product, checkout }) => {
  const {
    values: {
      customer,
      form: {
        checkout: { items }
      }
    }
  } = usePriceBlocsContext();

  /**
   * Prices use hierarchy
   * - provided via props
   * - form checkout cart
   */
  const checkoutPrices = items.map(({ price: { id } }) => id);
  const prices = checkout && checkout.prices ? checkout.prices : checkoutPrices;
  const checkoutResult = {
    prices
  };

  let checkoutDisabled = false;
  const subscription =
    customer && customer.subscriptions
      ? getGoodStandingSubscriptions(customer.subscriptions)[0]
      : null;
  if (subscription) {
    const subPrices = subscription.items.data.map(({ price: { id } }) => id);
    const priceSymDiff = xor(subPrices, prices);
    const allSamePrices = priceSymDiff.length === 0;
    if (allSamePrices) {
      checkoutDisabled = true;
    }
  }

  const action = {};
  const isSubscribed = Boolean(
    price && product && product.subscription && price.subscription
  );
  if (isSubscribed) {
    action.value = "Active";
  } else if (subscription) {
    action.value = "Select";
  }

  const hasPrices = prices.length > 0;

  return {
    action,
    subscription,
    checkout: checkoutResult,
    disabled: checkoutDisabled || !hasPrices
  };
};
