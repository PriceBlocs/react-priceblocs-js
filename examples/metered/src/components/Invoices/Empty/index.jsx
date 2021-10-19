import { DocumentTextIcon } from "@heroicons/react/outline";

const EmptyInvoices = () => {
  return (
    <div className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center ">
      <div className="text-center flex flex-col items-center">
        <div className="m-auto">
          <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices</h3>
        <p className="mt-1 text-sm text-gray-500">
          All customer invoices will be shown here
        </p>
      </div>
    </div>
  );
};

export default EmptyInvoices;
