import React, { useEffect, useState } from "react";
import { usePriceBlocsContext } from "@priceblocs/react-priceblocs-js";
import Summary from "../Invoices/Summary";
import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import Loader from "./Loader";
import classNames from "../../utils/classNames";

const PreviewInvoice = ({
  prices,
  subscription,
  afterConfirm,
  title,
  setOpen
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    previewInvoice,
    updateSubscription,
    values: {
      form: {
        theme: {
          colors: { primary: primaryColor }
        },
        checkout: { items }
      }
    }
  } = usePriceBlocsContext();

  const getPreview = async () => {
    const itemPrices = items.map(({ price: { id } }) => id);
    const inputItems =
      Array.isArray(prices) && prices.length > 0 ? prices : itemPrices;
    setLoading(true);
    const previewData = await previewInvoice({
      items: inputItems,
      subscription: subscription.id
    });
    setData(previewData);
    setLoading(false);
  };

  const confirm = async () => {
    setLoading(true);
    const updateInput = {
      id: subscription.id,
      ...data.preview.confirm
    };
    const updatedSub = await updateSubscription(updateInput);
    if (updatedSub && updatedSub.statusCode !== 400) {
      setLoading(false);
      afterConfirm();
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPreview();
  });

  let content;
  const disabled = Boolean(loading);
  if (loading) {
    content = <Loader />;
  } else if (
    data &&
    data.preview &&
    data.preview.lineItems &&
    data.preview.amountItems
  ) {
    const { lineItems, amountItems } = data.preview;
    content = <Summary lineItems={lineItems} amountItems={amountItems} />;
  }

  return (
    <div className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl">
      <div className="min-h-0 flex-1 flex flex-col py-6 overflow-y-scroll">
        <div className="px-4 sm:px-6">
          <div className="flex items-start justify-between">
            {title && (
              <Dialog.Title className="text-lg font-medium text-gray-900">
                {title}
              </Dialog.Title>
            )}
            <div className="ml-3 h-7 flex items-center">
              <button
                type="button"
                className={`bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500`}
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close panel</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 relative flex-1 px-4 sm:px-6">
          <div className="py-6">{content}</div>
        </div>
      </div>
      <div className="flex-shrink-0 px-4 py-4 flex justify-end">
        <button
          type="button"
          className={`bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${primaryColor}-500`}
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={disabled}
          onClick={confirm}
          className={classNames(
            `ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-${primaryColor}-600 hover:bg-${primaryColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${primaryColor}-500 disabled:opacity-50`,
            !disabled ? `hover:bg-${primaryColor}-600` : ""
          )}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default PreviewInvoice;
