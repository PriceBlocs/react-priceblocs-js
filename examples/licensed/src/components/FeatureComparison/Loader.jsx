import React, { Fragment } from "react";

const Loader = ({ groups = 2, rows = 3, columns = 3 }) => (
  <div className="w-full bg-white rounded sm:p-4">
    <div className="w-full bg-white rounded p-4 animate-pulse">
      {/* Desktop */}
      <div className="hidden lg:block w-full">
        <div className="pb-8 animate-pulse">
          <div className="h-12 bg-gray-400 rounded w-full sm:w-1/3"></div>
        </div>
        <table
          className="w-full h-px table-fixed"
          cellSpacing="0"
          style={{
            borderCollapse: "separate",
            borderSpacing: 0,
            position: "relative"
          }}
        >
          <thead>
            <tr className="ph3 bg-white">
              <th className={`w-1/4`}>
                <div className="space-y-2 flex flex-col items-center mx-auto justify-center">
                  <div className="h-8 bg-gray-400 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-400 rounded w-8"></div>
                  <div className="h-8 bg-gray-400 rounded w-1/4"></div>
                </div>
              </th>
              {new Array(columns).fill("").map((_, colIx) => (
                <th
                  key={colIx}
                  className={`w-1/4 pb-4 px-6 text-lg leading-6 font-medium text-gray-900 dark:text-gray-200 text-left bg-white`}
                >
                  <div className="h-6 bg-gray-400 rounded w-1/4"></div>
                  <div className="space-y-2 py-5">
                    <div className="space-x-2 flex flex-row items-end">
                      <div className="h-8 bg-gray-400 rounded w-2/4"></div>
                      <div className="h-4 bg-gray-400 rounded w-6"></div>
                    </div>
                  </div>
                  <div className="h-12 bg-gray-400 rounded w-full mt-2"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border-t border-gray-200 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600">
            {new Array(groups).fill("").map((_, groupIx) => (
              <Fragment key={groupIx}>
                <tr className="bg-gray-50 dark:bg-gray-800 py-3 pl-6 text-sm font-medium text-gray-900 dark:text-gray-200 text-left">
                  <th
                    className="py-5 px-6 text-lg font-semibold text-black-500 dark:text-gray-300 text-left"
                    colSpan={columns + 1}
                  >
                    <div className="h-6 bg-gray-400 rounded w-16"></div>
                  </th>
                </tr>
                {new Array(rows).fill("").map((_, rowIx) => (
                  <tr key={rowIx}>
                    <th className="py-5 px-6 text-sm font-normal text-gray-500 dark:text-gray-300 text-left">
                      <div className="flex flex-row items-center w-full justify-between">
                        <div className="f5 dib pv3 pl3 user-select-n">
                          <div className="h-6 bg-gray-400 rounded w-36"></div>
                        </div>
                      </div>
                    </th>
                    {new Array(columns).fill("").map((_, rowIx) => (
                      <td key={rowIx} className="py-5 px-6">
                        <div className="f5 dib">
                          <div className="pa2 flex items-center justify-center">
                            <div className="h-6 w-6 bg-gray-400 rounded-full"></div>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile */}
      <div className="lg:hidden">
        <div className="w-full relative">
          <div className="pb-6">
            <div
              className={`w-full text-lg leading-6 font-medium text-gray-900 dark:text-gray-200 text-left bg-white`}
            >
              <div className="p-4">
                <div className="h-8 bg-gray-400 rounded w-full"></div>
              </div>

              <div className="space-x-2 flex flex-row items-center mx-auto justify-center mb-4">
                <div className="space-x-2 flex flex-row items-end">
                  <div className="h-8 bg-gray-400 rounded w-12"></div>
                  <div className="h-4 bg-gray-400 rounded w-6"></div>
                </div>
                <div className="h-8 bg-gray-400 rounded w-1/4"></div>
              </div>
              <div className="space-x-2 flex flex-row items-center mx-auto justify-center">
                <div className="h-8 bg-gray-400 rounded w-1/4"></div>
                <div className="h-8 bg-gray-400 rounded w-8"></div>
                <div className="h-8 bg-gray-400 rounded w-1/4"></div>
              </div>
            </div>
          </div>
          {new Array(groups).fill("").map((_, groupIx) => (
            <Fragment key={groupIx}>
              <div className="w-full">
                <div className="bg-gray-50 dark:bg-gray-800 px-2 text-sm font-medium text-gray-900 dark:text-gray-200 text-left">
                  <div className="p-4 text-lg font-semibold text-black-500 dark:text-gray-300 text-left">
                    <div className="h-6 bg-gray-400 rounded w-16"></div>
                  </div>
                </div>
                {new Array(rows).fill("").map((_, rowIx) => (
                  <div key={rowIx} className="flex flex-row">
                    <div className="py-3 px-6 text-sm font-normal text-gray-500 dark:text-gray-300 text-left">
                      <div className="flex flex-row items-center w-full justify-between">
                        <div className="f5 dib pv3 pl3 user-select-n">
                          <div className="h-6 bg-gray-400 rounded w-36"></div>
                        </div>
                      </div>
                    </div>
                    <div key={rowIx} className="py-3 px-6 w-full">
                      <div className="f5 dib">
                        <div className="pa2 flex items-center justify-center">
                          <div className="h-6 w-6 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Loader;
