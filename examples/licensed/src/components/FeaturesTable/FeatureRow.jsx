import React from "react";
import Tooltip from "@components/Tooltip";
import classNames from "@utils/classNames";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { usePriceBlocsContext } from "@priceblocs/react-priceblocs-js";

const FeatureRow = ({ row, groupIndex, rowIndex }) => {
  const rowKeys = Object.keys(row);
  const titleKey = rowKeys[0];
  const cellKeys = rowKeys.slice(1);

  const {
    values: {
      form: { theme }
    }
  } = usePriceBlocsContext();
  const primaryColor = theme.colors.primary;

  const hasTooltip = row[titleKey] && row[titleKey].tooltip;
  const titleContent = hasTooltip ? (
    <Tooltip id={`${groupIndex}.${rowIndex}`} tooltip={row[titleKey].tooltip}>
      {row[titleKey].value}
    </Tooltip>
  ) : (
    row[titleKey].value
  );

  return (
    <tr>
      <th className="py-5 px-6 text-sm font-normal text-gray-500 dark:text-gray-300 text-left">
        <div className="flex flex-row items-center w-full justify-between">
          <div
            className={classNames("f5 dib pv3 pl3 user-select-n", {
              dotted__underline: hasTooltip
            })}
          >
            {titleContent}
          </div>
        </div>
      </th>
      {cellKeys.map((key, keyIx) => {
        const config = row[key];
        let content = "";
        if (config) {
          if (config.enabled) {
            const value = config.value || (
              <CheckCircleIcon className={`h-6 w-7 text-${primaryColor}-600`} />
            );
            const tipId = `${groupIndex}.${rowIndex}.${keyIx}`;

            content = config.tooltip ? (
              <Tooltip
                id={tipId}
                tooltip={config.tooltip}
                customClasses={{
                  tooltip: "bg-black-90 white dib"
                }}
              >
                {value}
              </Tooltip>
            ) : (
              value
            );
          }
        }

        return (
          <td key={keyIx} className="py-5 px-6">
            <div className="f5 dib">
              <div className="pa2 flex items-center justify-center">
                {content}
              </div>
            </div>
          </td>
        );
      })}
    </tr>
  );
};

export default FeatureRow;
