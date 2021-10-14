import React from "react";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { usePriceBlocsContext } from "@priceblocs/react-priceblocs-js";

const FeatureGroupRow = ({ productUID, rows, header }) => {
  const {
    values: {
      form: { theme }
    }
  } = usePriceBlocsContext();
  const primaryColor = theme.colors.primary;

  return (
    <div className="w-full flex-col space-y-2">
      <div className="bg-gray-50 dark:bg-gray-800 py-3 pl-3 text-sm font-medium text-gray-900 dark:text-gray-200 text-left">
        <div className="text-md font-semibold text-black-500 dark:text-gray-300 text-left">
          {header.header}
        </div>
      </div>
      <div className="w-full block space-y-2">
        {rows.map((row, rowIx) => {
          const config = row[productUID];
          const content = config
            ? config.enabled
              ? config.value || (
                  <CheckCircleIcon
                    className={`h-5 w-5 text-${primaryColor}-600`}
                  />
                )
              : ""
            : "";
          return (
            <div className="w-full flex flex-row py-2" key={rowIx}>
              <div className="w-1/2 br pa3">
                <div className="f5 dib user-select-n word-break-all lh-copy pl-3 text-sm">
                  {row.title.value}
                </div>
              </div>
              <div className="w-1/2 fl flex items-center justify-center shrink-0">
                <div className="f5 dib lh-title">{content}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureGroupRow;
