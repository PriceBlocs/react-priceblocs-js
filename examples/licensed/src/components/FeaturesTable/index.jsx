import React, { useMemo } from "react";
import DesktopFeatureTable from "./DesktopFeatureTable";
import {
  usePriceBlocsContext,
  getProductsFeaturesTable
} from "@priceblocs/react-priceblocs-js";
import MobileFeatureTable from "./MobileFeatureTable";

const FeaturesTable = () => {
  const {
    values: {
      products,
      featureGroups,
      form: { highlight }
    }
  } = usePriceBlocsContext();

  const data = useMemo(
    () => getProductsFeaturesTable({ products, featureGroups }),
    [products, featureGroups]
  );

  const emphasisIndex = products.find(({ id }) => id === highlight.product);

  const thWidth = 30;
  const tdWidth = (100 - thWidth) / data.header.length;

  const tableInput = {
    emphasisIndex,
    thWidth,
    tdWidth,
    header: data.header,
    groups: data.groups
  };

  return (
    <div className="w-full bg-white rounded p-4">
      {/* Desktop */}
      <div className="hidden lg:block w-full">
        <DesktopFeatureTable {...tableInput} />
      </div>
      {/* Mobile */}
      <div className="lg:hidden">
        <MobileFeatureTable {...tableInput} />
      </div>
    </div>
  );
};

export default FeaturesTable;
