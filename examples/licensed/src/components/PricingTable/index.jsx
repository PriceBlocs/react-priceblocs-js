import React from "react";
import ProductTier from "./ProductTier";
import { usePriceBlocsContext } from "@priceblocs/react-priceblocs-js";

const Wrapper = ({ children }) => (
  <div className="container max-w-4xl px-4 lg:px-0 py-8 md:py-8 mx-auto flex flex-col justify-center">
    <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-4 w-full">
      {children}
    </div>
  </div>
);

const Loader = ({ count = 3 }) => (
  <Wrapper>
    {new Array(count).fill("").map((_, productIx) => (
      <div
        key={productIx}
        className={`h-full p-4 shadow-xl flex flex-col relative bg-white rounded-lg xl:w-1/${count} md:w-1/${count} w-full shrink-0`}
      >
        <div className="animate-pulse">
          <div className="flex flex-col space-x-4">
            <div className="flex-1 space-y-2 py-1">
              <div className="h-8 bg-gray-400 rounded w-3/4"></div>
              <div className="h-2 bg-gray-400 rounded w-2/4 pb-6"></div>
              <div className="space-y-2 py-5">
                <div className="space-x-2 flex flex-row items-end">
                  <div className="h-8 bg-gray-400 rounded w-2/4"></div>
                  <div className="h-4 bg-gray-400 rounded w-6"></div>
                </div>
                <div className="h-4 bg-gray-400 rounded w-1/4"></div>
              </div>
              {new Array(4).fill("").map((_, featureIx) => (
                <div
                  key={featureIx}
                  className="space-x-2 flex flex-row items-center"
                >
                  <div className="h-4 bg-gray-400 w-4 rounded-full"></div>
                  <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-12 bg-gray-400 rounded w-full mt-4"></div>
        </div>
      </div>
    ))}
  </Wrapper>
);

const Content = () => {
  const {
    values: { products }
  } = usePriceBlocsContext();

  return (
    <Wrapper>
      {products.map((product, productIx) => (
        <ProductTier key={productIx} {...product} />
      ))}
    </Wrapper>
  );
};

const PricingTable = () => {
  const { loading, values } = usePriceBlocsContext();

  return loading ? <Loader /> : values ? <Content /> : null;
};

export default PricingTable;
