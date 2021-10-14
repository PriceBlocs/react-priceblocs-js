import React from "react";
import classNames from "@utils/classNames";

const Summary = ({ lineItems, amountItems }) => {
  return (
    <div className="flex flex-col">
      <div className="sm:hidden">
        <div className="">
          <dl className="sm:divide-y sm:divide-gray-200 space-y-4">
            <dt className="text-md font-bold text-gray-500 pb-4 mb-4 border-b border-gray-200 uppercase">
              Items
            </dt>
            {lineItems.map((row) => {
              return (
                <div
                  key={row.uuid}
                  className="py-1 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 flex justify-between"
                >
                  <div className="flex flex-col items-start">
                    <div className="text-sm font-medium text-gray-900 pr-4">
                      {row.description}
                    </div>
                    {row.quantity > 0 && (
                      <div className="text-sm text-gray-500 sm:mt-0 sm:col-span-2">{`Qty: ${row.quantity}`}</div>
                    )}
                  </div>
                  {row.amount && (
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-500 sm:mt-0 sm:col-span-2">
                        {row.amount}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="border-t border-gray-200 pt-3 mt-3">
              {amountItems.map((row) => {
                return (
                  <div
                    key={row.uuid}
                    className="py-1 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 flex justify-between"
                  >
                    <div className="flex flex-col items-start">
                      <div className="text-sm font-medium text-gray-500 pr-4">
                        {row.label}
                      </div>
                    </div>
                    {row.amount && (
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-500 sm:mt-0 sm:col-span-2">
                          {row.amount}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </dl>
        </div>
      </div>
      <div className="hidden sm:block -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3  text-xs font-medium text-gray-500 uppercase text-right"
                  >
                    Qty
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3  text-xs font-medium text-gray-500 uppercase text-right"
                  >
                    Unit Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3  text-xs font-medium text-gray-500 uppercase text-right"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lineItems.map((row) => (
                  <tr key={row.uuid}>
                    <td
                      className={classNames(
                        row.amount
                          ? "text-gray-900 font-medium"
                          : "text-gray-500",
                        "py-3 whitespace-nowrap text-sm"
                      )}
                    >
                      {row.description}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                      {row.quantity}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                      {row.unitAmount}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                      {row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tbody className="bg-white">
                {amountItems.map((row) => (
                  <tr key={row.uuid}>
                    <td
                      className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right"
                      colSpan={3}
                    >
                      {row.label}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                      {row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
