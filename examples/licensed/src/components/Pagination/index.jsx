import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { classNames, getCursors, PAGINATION_STEP } from "@utils/ui";

const Pagination = ({ total, setPage, page }) => {
  const { start, end, prev, next, pages } = getCursors(
    page,
    total,
    PAGINATION_STEP
  );
  let stepNodes = [];
  for (let index = 0; index < pages; index++) {
    const indexLabel = index + 1;
    const isActive = page === index;
    const nodeProps = {
      onClick: () => setPage(index),
      className: classNames(
        isActive
          ? "z-10 bg-gray-50 border-gray-500 text-gray-600"
          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50",
        "relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer"
      )
    };
    if (isActive) {
      nodeProps["aria-current"] = "page";
    }

    stepNodes.push(
      <span key={index} {...nodeProps}>
        {indexLabel}
      </span>
    );
  }

  const goPrev = () => prev >= 0 && setPage(prev);
  const goNext = () => next < pages && setPage(next);

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between items-center sm:hidden">
        <span
          onClick={goPrev}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </span>
        <p className="text-sm text-gray-700">
          <span className="font-medium">{start}</span> -{" "}
          <span className="font-medium">{end}</span> of{" "}
          <span className="font-medium">{total}</span>
        </p>
        <span
          onClick={goNext}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Next
        </span>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{start}</span> to{" "}
            <span className="font-medium">{end}</span> of{" "}
            <span className="font-medium">{total}</span> results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <span
              onClick={goPrev}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            {stepNodes}
            <span
              onClick={goNext}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
