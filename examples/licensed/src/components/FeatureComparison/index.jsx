import React, { Fragment } from "react";
import FeaturesTable from "@components/FeaturesTable";
import Loader from "./Loader";
import { usePriceBlocsContext } from "@priceblocs/react-priceblocs-js";

const Wrapper = ({ children }) => (
  <div className="w-full max-w-7xl mx-auto py-16 px-4 lg:px-8">{children}</div>
);

const Content = () => {
  return (
    <Fragment>
      <div className="text-4xl font-semibold lg:pt-6 pb-12">
        Compare features
      </div>
      <FeaturesTable />
    </Fragment>
  );
};

const FeatureComparison = () => {
  const { loading, values } = usePriceBlocsContext();

  return loading ? (
    <Wrapper>
      <Loader groups={3} columns={3} rows={2} />
    </Wrapper>
  ) : values ? (
    <Wrapper>
      <Content />
    </Wrapper>
  ) : null;
};

export default FeatureComparison;
