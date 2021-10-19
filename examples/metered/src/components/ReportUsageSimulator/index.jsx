import React, { useState } from "react";
import { usePriceBlocsContext } from "@priceblocs/react-priceblocs-js";
import ActionButton from "@components/ActionButton";
import { integerTransformer } from "@utils/form";

const ReportUsageSimulator = ({ subscriptionItem, updateUsage }) => {
  const [usage, setUsage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { reportUsage } = usePriceBlocsContext();

  const simulateReportUsage = async () => {
    setLoading(true);
    const usageReport = await reportUsage({
      subscription_item: subscriptionItem,
      quantity: usage
    });
    if (usageReport && usageReport.id && updateUsage) {
      updateUsage(usageReport);
    }

    setLoading(false);
  };
  const error = usage > 100;

  return (
    <div className="bg-white border border-gray-200 rounded">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap sm:flex-nowrap p-4">
        <div className="pb-3 sm:pb-0">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Report usage
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Simulate API usage tracking by clicking on the button here. (100 max
            for demo purposes)
          </p>
        </div>
        <div className="flex-shrink-0 flex flex-col w-full sm:w-auto">
          <div className="relative flex flex-row">
            <input
              value={usage}
              onChange={(evt) =>
                setUsage(integerTransformer(evt.currentTarget.value))
              }
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 relative block w-full rounded-none rounded-l-md rounded-r-none bg-transparent focus:z-10 sm:text-sm border-gray-300"
              placeholder="1"
            />
            <ActionButton
              loading={loading}
              disabled={!usage || error}
              copy={{ value: "Report" }}
              onClick={simulateReportUsage}
              customClasses={{
                button:
                  "relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md rounded-l-none text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportUsageSimulator;
