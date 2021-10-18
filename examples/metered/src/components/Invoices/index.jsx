import React, { useState } from "react";
import { usePriceBlocsContext } from "@priceblocs/react-priceblocs-js";
import Show from "./Show";
import Table from "./Table";
import classNames from "@utils/classNames";
import Breadcrumbs from "@components/Breadcrumbs";
import Empty from "./Empty";

const InvoicesSection = () => {
  const [activeId, setActiveId] = useState(null);
  const [page, setPage] = useState(0);
  const {
    values: {
      customer: { invoices }
    }
  } = usePriceBlocsContext();
  const hasInvoices = invoices && invoices.length > 0;
  if (!hasInvoices) {
    return <Empty />;
  }

  const activeInvoice = invoices.find(({ id }) => id === activeId);

  return (
    <div
      className={classNames(
        activeId ? "border-t border-gray-200" : "",
        "bg-white shadow overflow-hidden sm:rounded-md"
      )}
      key={activeId}
    >
      {activeId ? (
        <div className="pt-4 px-4">
          <Breadcrumbs
            onClickRoot={() => setActiveId(null)}
            steps={[
              {
                name: activeInvoice.number
              }
            ]}
          />
        </div>
      ) : null}
      {activeInvoice ? (
        <Show invoice={activeInvoice} />
      ) : (
        <Table setActiveId={setActiveId} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default InvoicesSection;
