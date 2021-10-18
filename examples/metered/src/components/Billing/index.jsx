import React, { useState } from "react";
import { usePriceBlocsContext } from "@priceblocs/react-priceblocs-js";
import Select from "@components/Select";
import ActionButton from "@components/ActionButton";
import classNames from "@utils/classNames";
import Invoices from "@components/Invoices";
import upperFirst from "lodash/upperFirst";
import Loader from "./Loader";

const Wrapper = ({ children }) => (
  <div className="w-full max-w-7xl mx-auto py-16 px-4 lg:px-8 ">{children}</div>
);

const INVOICES = "invoices";
const SECTIONS = {
  INVOICES
};

const SECTION_TABS = Object.values(SECTIONS).map((section) => ({
  id: section,
  name: upperFirst(section)
}));

const CONTENT_MAP = {
  [SECTIONS.INVOICES]: Invoices
};

const EmptyComponent = () => {
  return (
    <div className="px-4 py-8 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
    </div>
  );
};

const Layout = () => {
  const { billing, values } = usePriceBlocsContext();
  const [activeSection, setActiveSection] = useState(SECTIONS.INVOICES);
  const value = SECTION_TABS.find(({ id }) => id === activeSection);

  const disabled = !Boolean(values && values.customer && values.customer.id);

  const selectProps = {
    options: SECTION_TABS,
    value,
    disabled: SECTION_TABS.length <= 1,
    onChange: (selection) => {
      setActiveSection(selection.id);
    },
    customClasses: {
      input:
        "border-box input-reset ba b--black-20 pa2 mb0 db w-full pv2 f5 br2"
    }
  };

  const ContentComponent = CONTENT_MAP[activeSection] || EmptyComponent;

  return (
    <div className="border-b border-gray-200 bg-white px-4 pt-6 pb-6 sm:p-8 rounded-md">
      <div className="relative pb-5 sm:pb-0">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-2xl leading-6 font-bold text-gray-900">
            Billing
          </h3>
          <ActionButton
            customClasses={{
              button:
                "ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            }}
            onClick={billing}
            disabled={disabled}
            copy={{ value: "Manage" }}
          />
        </div>
        <div className="mt-4">
          <div className="hidden">
            <Select {...selectProps} />
          </div>
          <div className="hidden sm:block">
            <nav className="-mb-px flex space-x-8">
              {SECTION_TABS.map((tab) => (
                <span
                  key={tab.name}
                  onClick={() => setActiveSection(tab.id)}
                  className={classNames(
                    tab.id === value.id
                      ? "border-gray-500 text-gray-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm cursor-pointer"
                  )}
                  aria-current={tab.id === value.id ? "page" : undefined}
                >
                  {tab.name}
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="pt-4">
        <ContentComponent />
      </div>
    </div>
  );
};

const Billing = () => {
  const { loading, values } = usePriceBlocsContext();

  return loading ? (
    <Wrapper>
      <Loader groups={1} rows={10} columns={5} />
    </Wrapper>
  ) : values ? (
    <Wrapper>
      <Layout />
    </Wrapper>
  ) : null;
};

export default Billing;
