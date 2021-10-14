import React from "react";
import { ArrowSmLeftIcon } from "@heroicons/react/solid";
const NO_OP = () => {};

const Breadcrumbs = ({ onClickRoot, steps }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        <li>
          <div>
            <span
              onClick={onClickRoot}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <ArrowSmLeftIcon
                className="flex-shrink-0 h-5 w-5"
                aria-hidden="true"
              />
              <span className="sr-only">Home</span>
            </span>
          </div>
        </li>
        {steps.map((step) => (
          <li key={step.name}>
            <div className="flex items-center">
              <svg
                className="flex-shrink-0 h-5 w-5 text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <span
                onClick={step.onClick || NO_OP}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                aria-current={step.current ? "step" : undefined}
              >
                {step.name}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
