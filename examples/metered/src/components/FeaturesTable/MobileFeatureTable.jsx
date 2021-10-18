import React, { useState } from "react";
import FeatureGroupRow from "./FeatureGroupRow";
import MobileFeatureTableHeader from "./MobileFeatureTableHeader";

const MobileFeatureTable = ({
  entity,
  afterChange,
  header,
  groups,
  emphasisIndex
}) => {
  // Index should exist within collection of header products else use 0
  const initialIndex = header[emphasisIndex] ? emphasisIndex : 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const product = header[activeIndex];

  const productOptions = header.map((product, productIx) => ({
    label: product.title,
    id: productIx
  }));

  return (
    <div className="w-full relative">
      {product && (
        <div className="pb-6">
          <MobileFeatureTableHeader
            product={product}
            emphasisIndex={emphasisIndex}
            options={productOptions}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            entity={entity}
            afterChange={afterChange}
          />
        </div>
      )}
      <div className="w-full">
        {product &&
          groups.reduce((memo, { columns, rows }, groupIx) => {
            /**
             * Use a 1 based index because the first column is the feature title
             */
            const productUID = columns[activeIndex + 1].accessor;

            memo.push(
              <FeatureGroupRow
                key={groupIx}
                header={columns[0]}
                productUID={productUID}
                rows={rows}
              />
            );
            return memo;
          }, [])}
      </div>
    </div>
  );
};

export default MobileFeatureTable;
