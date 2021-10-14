import React from "react";
import classNames from "../../utils/classNames";
import {
  usePriceBlocsContext,
  getActiveProductPrice,
  getProductFeatures,
  getGoodStandingSubscriptions
} from "@priceblocs/react-priceblocs-js";
import FormattedPriceHeader from "../FormattedPriceHeader";
import CheckoutButton from "../CheckoutButton";
import { CheckCircleIcon } from "@heroicons/react/solid";
import BillingLabel from "../BillingLabel";

const ProductTier = (product) => {
  const {
    values: {
      products,
      customer,
      featureGroups,
      form: { theme, highlight, currency, interval }
    }
  } = usePriceBlocsContext();

  const subscription =
    customer && customer.subscriptions
      ? getGoodStandingSubscriptions(customer.subscriptions)[0]
      : null;

  const primaryColor = theme.colors.primary;
  const features = getProductFeatures(product.id, featureGroups);
  const price = getActiveProductPrice(product, { currency, interval });
  const isSubscribed =
    price && product && product.subscription && price.subscription;

  const highlighted = highlight.product === product.id;
  const showHighlight = highlighted && !subscription;

  const hasFeatures = features && features.length > 0;
  return (
    <div
      className={classNames(
        `h-full p-4 shadow-xl flex flex-col relative bg-white rounded-lg xl:w-1/${products.length} md:w-1/${products.length} w-full shrink-0`,
        {
          [`border-${primaryColor}-600`]: showHighlight
        }
      )}
    >
      <div
        className={classNames(
          "pointer-events-none absolute inset-0 rounded-lg",
          {
            [`border-${primaryColor}-600 border-2`]: showHighlight
          }
        )}
      ></div>
      {showHighlight && highlighted && highlight.label ? (
        <div className="absolute inset-x-0 top-0 transform translate-y-px">
          <div className="flex justify-center transform -translate-y-1/2">
            <span
              className={`inline-flex rounded-full bg-${primaryColor}-600 px-4 py-1 text-sm leading-5 font-semibold tracking-wider uppercase text-white`}
            >
              {highlight.label}
            </span>
          </div>
        </div>
      ) : null}
      <div className="text-2xl text-black font-semibold flex flex-row items-center justify-between">
        <span>{product.name}</span>

        {isSubscribed && (
          <div className="flex items-center">
            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-600">
              Active
            </p>
            <CheckCircleIcon className="h-5 w-6 text-green-600" />
          </div>
        )}
      </div>
      <div
        className={classNames(`text-sm text-gray-500 font-medium`, {
          invisible: !product.description
        })}
      >
        {product.description || "_"}
      </div>
      <FormattedPriceHeader price={price} />
      <BillingLabel price={price} />
      {hasFeatures && (
        <ul className="block space-y-2 pt-4 pb-6">
          {features.map((feature, featureIx) => {
            return (
              <li
                key={featureIx}
                className="flex flex-row text-sm items-center"
              >
                <CheckCircleIcon
                  className={`h-4 w-4 text-${primaryColor}-600`}
                />
                <div className="pl-2">{feature.title}</div>
              </li>
            );
          })}
        </ul>
      )}
      {price && price.id && (
        <CheckoutButton
          checkout={{ prices: [price.id] }}
          price={price}
          product={product}
        />
      )}
    </div>
  );
};

export default ProductTier;
