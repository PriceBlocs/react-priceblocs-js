import React from "react";
import Toggle from "../Toggle";
import { usePriceBlocsContext } from "@priceblocs/react-priceblocs-js";

const Loader = () => (
  <div className="max-w-sm w-full mx-auto">
    <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-16 bg-gray-400 rounded w-3/4 mx-auto"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-400 rounded w-2/4 mx-auto"></div>
          <div className="h-4 bg-gray-400 rounded w-1/3 mx-auto"></div>
        </div>
        <div className="space-x-2 flex flex-row items-center mx-auto justify-center">
          <div className="h-8 bg-gray-400 rounded w-1/4"></div>
          <div className="h-8 bg-gray-400 rounded w-8"></div>
          <div className="h-8 bg-gray-400 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  </div>
);

const Content = ({ title, header, subheader, showToggle }) => (
  <div className="flex flex-col text-center space-y-2">
    {title && (
      <div className="text-5xl sm:text-6xl font-semibold tracking-tight">
        {title}
      </div>
    )}
    {header && <div className="text-md sm:text-lg font-semibold">{header}</div>}
    {subheader && <div className="text-md sm:text-lg">{subheader}</div>}
    {showToggle && (
      <div className="flex justify-center pt-2">
        <Toggle />
      </div>
    )}
  </div>
);

const HeaderControls = (props) => {
  const { loading, values } = usePriceBlocsContext();

  return loading ? <Loader /> : values ? <Content {...props} /> : null;
};

export default HeaderControls;
