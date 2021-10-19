import React from "react";
import { PriceBlocs } from "@priceblocs/react-priceblocs-js";
import PageControls from "@components/PageControls";
import HeaderControls from "@components/HeaderControls";
import ProductCollection from "@components/ProductCollection";
import Billing from "@components/Billing";
import { Toaster } from 'react-hot-toast';

const HEADER_PROPS = {
  title: "Licensed",
  header: "Pick the right plan for your team",
  subheader: "Try for free",
  showToggle: true
};

const PRICE_BLOCS_SANDBOX_PROPS = {
  /**
   * The api_key used here is a special sandbox key
   * - it is locked to a demo Stripe account and as such has limited access to the API
   * - it's included here so that you can get to play with PriceBlocs in a limited capacity
   * - When you're ready, head over to https://priceblocs.com/play to get your own API keys so that you can use your own pricing
   */
  api_key:
    "PB_pk_sandbox_HXIxnXgK0Qzl80J6NrdtaqdjxXWv2tnM7QHek6k6WxszsgVRF3XS8d29HI7Pd3r6BF52WrAWmtYcsb5QLaPFewa5157oSbwJoLz4",
  /**
   * We've setup some demo prices so that you can see how a standard licensed billing plan works by example
   * - Just pass in the prices and PriceBlocs will figure out the rest
   * - You can optionally pass a customer reference so that the components are initialized within the context of that customer
   */
   prices: [
    // Voice: prod_KOzma0FGUGnSFR
    // @ $0.013 per unit / month - "unit_amount_decimal": "1.3"
    "price_1JkBmrCawd0otcqGAeSAYcVH",
    // Messaging: prod_KOzmR8xSm7Xxtl @ $0.0075 per unit / month 0.0075 "unit_amount_decimal": "0.75"
    "price_1JkBnECawd0otcqGfvYIxoJM",
    // Video: prod_KOzn6LjrIGcHwa @ $0.0015 per unit / month
    "price_1JkBnUCawd0otcqGJKK23CJm",
    // Conversations: prod_KOznIXeFqpeJIF @ $0.05 per unit month
    "price_1JkBnqCawd0otcqGRmqDnrlc"
  ],
  customer: "cus_KP1Ee43AHj2kVr",
  query: {
    customer: {
      associations: ["invoices"]
    }
  }
};

function App() {
  return (
    <div className="flex flex-col items-start min-h-screen py-2 bg-gradient-to-r from-blue-200 to-purple-100 pt-8 sm:pt-16">
      <PriceBlocs {...PRICE_BLOCS_SANDBOX_PROPS}>
        {() => (
          <div className="w-full pb-28">
          <PageControls />
          <HeaderControls {...HEADER_PROPS} />
          <ProductCollection />
      <Billing />
        </div>
        )}
      </PriceBlocs>
      <Toaster />
    </div>
  );
}

export default App;
