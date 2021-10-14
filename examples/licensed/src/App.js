import React from "react";
import { PriceBlocs } from "@priceblocs/react-priceblocs-js";
import PageControls from "@components/PageControls";
import HeaderControls from "@components/HeaderControls";
import PricingTable from "@components/PricingTable";
import FeatureComparison from "@components/FeatureComparison";
import Billing from "@components/Billing";

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
    // ============================
    // Pro
    // prod_I3GcIOstTtpggz
    "price_1HTA4xCawd0otcqG5ZY78hTo", // (156 per year)
    "price_1HTA4xCawd0otcqGiqiO8qU6", // (15 per month)
    // ============================
    // Plus
    // prod_I3GcUdbgzML1E8
    "price_1HTA8MCawd0otcqGTf0xGwXg", // (420 per year)
    "price_1HTA8MCawd0otcqG4HL9zLeb", // (39 per month)
    // Scale
    // prod_I3GcPAmsM5snJt
    "price_1HTA4xCawd0otcqGncZpeyra", // (1068 per year)
    "price_1HTA5YCawd0otcqGghgiGvu9" // (99 per month)
  ],
  customer: "cus_KE8BRZ5EBnbzni",
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
          <PricingTable />
          <FeatureComparison />
          <Billing />
        </div>
        )}
      </PriceBlocs>
    </div>
  );
}

export default App;
