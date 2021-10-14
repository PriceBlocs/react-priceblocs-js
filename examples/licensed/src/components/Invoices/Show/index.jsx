import React from "react";
import { formatAmount } from "@utils/currency";
import { formatUTCTime, timeSinceComputation } from "@utils/date";
import upperFirst from "lodash/upperFirst";
import Summary from "../Summary";
import { DocumentDownloadIcon, ExternalLinkIcon } from "@heroicons/react/solid";
import { prepareInvoice } from "@utils/invoice";

const Show = ({ invoice }) => {
  if (!invoice) {
    return null;
  }
  const paidAt =
    invoice && invoice.status_transitions && invoice.status_transitions.paid_at;
  const paidAtNode = paidAt ? (
    <div className="flex flex-row">
      <p className="mt-1 max-w-2xl text-xs sm:text-sm text-gray-500">{`Paid ${timeSinceComputation(
        paidAt
      )}`}</p>
    </div>
  ) : null;

  return (
    <div className="bg-white overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex flex-row space-x-1 items-baseline">
          <h3 className="text-md sm:text-lg leading-6 font-bold text-gray-900">
            {invoice.number}
          </h3>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm text-gray-500">for</p>
          <p className="mt-1 max-w-2xl text-sm sm:text-md text-gray-900">
            {formatAmount({
              currency: invoice.currency,
              amount: invoice.total,
              presentation: "accounting"
            })}
          </p>
          <p className="px-2 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded bg-green-100 text-green-600">
            {upperFirst(invoice.status)}
          </p>
          {paidAtNode}
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Currency</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {invoice.currency.toUpperCase()}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Customer email
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {invoice.customer_email}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">PDF Download</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <a href={invoice.invoice_pdf} target="_blank" rel="noreferrer">
                <DocumentDownloadIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 hover:text-gray-600" />
              </a>
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Hosted invoice
            </dt>
            <dd
              className="mt-1 text-sm text-gray-900"
              href={invoice.hosted_invoice_url}
            >
              <a
                href={invoice.hosted_invoice_url}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLinkIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 hover:text-gray-600" />
              </a>
            </dd>
          </div>
          {invoice.period_start && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Period start
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatUTCTime(invoice.period_start)}
              </dd>
            </div>
          )}
          {invoice.period_end && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Period end</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatUTCTime(invoice.period_end)}
              </dd>
            </div>
          )}
          <div className="sm:col-span-2">
            <dd className="mt-1 text-sm text-gray-900 pt-3">
              <Summary {...prepareInvoice({ invoice })} />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Show;
