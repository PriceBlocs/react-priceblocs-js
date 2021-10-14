import React from "react";
import { INTERVAL_LABELS_MAP } from "@priceblocs/react-priceblocs-js";
import classNames from "../../utils/classNames";

const BillingLabel = ({ price }) => {
  const priceInterval = price && price.recurring && price.recurring.interval;

  return (
    <div
      className={classNames(`text-sm text-gray-700 py-2`, {
        invisible: !priceInterval || !price.unit_amount
        // 'pb-2': !hasFeatures
      })}
    >
      {`Billed ${INTERVAL_LABELS_MAP[priceInterval]}` || "_"}
    </div>
  );
};

export default BillingLabel;
