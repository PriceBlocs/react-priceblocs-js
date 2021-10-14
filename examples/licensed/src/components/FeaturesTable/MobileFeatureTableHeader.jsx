import React from "react";
import Toggle from "@components/Toggle";
import CheckoutButton from "@components/CheckoutButton";
import FormattedPriceHeader from "@components/FormattedPriceHeader";
import Select from "@components/Select";
import { useActiveProductPrice } from "@priceblocs/react-priceblocs-js";

const MobileFeatureTableHeader = ({
  product,
  options,
  emphasisIndex,
  activeIndex,
  setActiveIndex
}) => {
  const price = useActiveProductPrice(product.id);

  const selectProps = {
    options,
    value: {
      id: product.id,
      label: product.title
    },
    disabled: options.length <= 1,
    onChange: (selection) => {
      setActiveIndex(selection.id);
    },
    customClasses: {
      input:
        "border-box input-reset ba b--black-20 pa2 mb0 db w-full pv2 f5 br2"
    }
  };

  return (
    <div className="product-picker-header w-full sticky pv2 pv3-ns bg-white bb bt">
      <div className="f5 w-full ph3 pb-4">
        <Select {...selectProps} />
      </div>
      <div className="flex flex-row w-full items-center justify-center pb-4">
        {price && (
          <div className="flex flex-col pr-2">
            <FormattedPriceHeader
              price={price}
              customClasses={{
                container: "flex flex-row font-bold items-end"
              }}
            />
          </div>
        )}
        <div className="flex items-start pl3">
          {price && price.id && (
            <CheckoutButton checkout={{ prices: [price.id] }} />
          )}
        </div>
      </div>
      <div className="pt2 pt3-ns">
        <Toggle />
      </div>
    </div>
  );
};

export default MobileFeatureTableHeader;
