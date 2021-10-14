import React from "react";
import { PriceBlocs } from "@priceblocs/react-priceblocs-js";
import PageControls from "@components/PageControls";
import HeaderControls from "@components/HeaderControls";
import PricingTable from "./components/PricingTable";
import FeatureComparison from "./components/FeatureComparison";
import Billing from "./components/Billing";

const HEADER_PROPS = {
  title: "Licensed",
  header: "Pick the right plan for your team",
  subheader: "Try for free",
  showToggle: true
};

const pbProps = {
  api_key:
    "PB_pk_sandbox_HXIxnXgK0Qzl80J6NrdtaqdjxXWv2tnM7QHek6k6WxszsgVRF3XS8d29HI7Pd3r6BF52WrAWmtYcsb5QLaPFewa5157oSbwJoLz4",
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
      associations: ["subscriptions", "cards", "invoices"],
      expand: ["default_source", "invoice_settings.default_payment_method"]
    }
  }
};

function App() {
  return (
    <div className="flex flex-col items-start min-h-screen py-2 bg-gradient-to-r from-blue-200 to-purple-100 pt-8 sm:pt-16">
      <PriceBlocs {...pbProps}>
        {({ loading }) => {
          return loading ? null : (
            <div className="w-full pb-28">
              <PageControls />
              <HeaderControls {...HEADER_PROPS} />
              <PricingTable />
              <FeatureComparison />
              <Billing />
            </div>
          );
        }}
      </PriceBlocs>
    </div>
  );
}

export default App;
