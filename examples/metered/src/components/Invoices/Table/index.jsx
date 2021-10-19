import React, { Fragment } from "react";
import { usePriceBlocsContext } from "@priceblocs/react-priceblocs-js";
import { getCursors, PAGINATION_STEP } from "@utils/ui";
import { formatAmount } from "@utils/currency";
import { formatUTCTime } from "@utils/date";
import { ChevronRightIcon } from "@heroicons/react/solid";
import Pagination from "@components/Pagination";
import upperFirst from "lodash/upperFirst";

const Table = ({ setActiveId, setPage, page }) => {
  const {
    values: {
      customer: { invoices }
    }
  } = usePriceBlocsContext();
  const total = invoices.length;

  const { start, end } = getCursors(page, total, PAGINATION_STEP);
  const invoicesSubset = invoices.slice(start, end);

  return (
    <Fragment>
      <div className="hidden sm:block flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg border-t ">
              <table className="min-w-full divide-y divide-gray-200 table-auto border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    ></th>
                    <th
                      scope="col"
                      className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    ></th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Invoice Number
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th scope="col" className="relative py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoicesSubset.map((invoice) => (
                    <tr
                      className="cursor-pointer hover:bg-gray-50"
                      key={invoice.id}
                      onClick={() => setActiveId(invoice.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 hover:text-gray-900">
                        {formatAmount({
                          currency: invoice.currency,
                          amount: invoice.total,
                          presentation: "accounting"
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.currency.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-600">
                            {upperFirst(invoice.status)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.number}
                      </td>
                      <td
                        onClick={() => setActiveId(invoice.id)}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {invoice.status_transitions.paid_at &&
                          formatUTCTime(invoice.status_transitions.paid_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end">
                        <ChevronRightIcon
                          className="h-5 w-5 text-gray-600 hover:text-gray-900"
                          aria-hidden="true"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                setPage={setPage}
                page={page}
                total={invoices.length}
              />
            </div>
          </div>
        </div>
      </div>
      <ul className="sm:hidden divide-y divide-gray-200">
        {invoicesSubset.map((invoice) => {
          return (
            <li key={invoice.id} onClick={() => setActiveId(invoice.id)}>
              <div className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {invoice.number}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-600">
                        {upperFirst(invoice.status)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {`${formatAmount({
                          currency: invoice.currency,
                          amount: invoice.total,
                          presentation: "accounting"
                        })} ${invoice.currency.toUpperCase()}`}
                      </p>
                      {invoice.status_transitions &&
                        invoice.status_transitions.paid_at && (
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            {formatUTCTime(invoice.status_transitions.paid_at)}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
        <Pagination setPage={setPage} page={page} total={invoices.length} />
      </ul>
    </Fragment>
  );
};

export default Table;
