import React, { Fragment } from "react";

const Loader = ({ groups = 2, rows = 3, columns = 2 }) => (
  <div className="w-full bg-white rounded">
    <div className="w-full bg-white rounded animate-pulse">
      {/* Desktop */}
      <div className="hidden lg:block w-full">
        <table className="w-full h-px table-fixed" cellSpacing="0">
          <tbody className="border-t border-gray-100 dark:border-gray-600 divide-y divide-gray-100 dark:divide-gray-600">
            {new Array(groups).fill("").map((_, groupIx) => (
              <Fragment key={groupIx}>
                <tr className="bg-gray-50 dark:bg-gray-800 py-3 pl-6 text-sm font-medium text-gray-900 dark:text-gray-200 text-left">
                  {new Array(columns + 1).fill("").map((_, rowIx) => (
                    <th
                      key={rowIx}
                      className="py-5 px-6 text-lg font-semibold text-black-500 dark:text-gray-300 text-left"
                    >
                      <div className="h-6 bg-gray-400 rounded w-16"></div>
                    </th>
                  ))}
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
                          <div className="pa2 flex items-center">
                            <div className="w-3/4 h-8 bg-gray-400 rounded"></div>
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
          <ul className="sm:hidden divide-y divide-gray-200">
            {new Array(rows).fill("").map((_, rowIx) => (
              <li key={rowIx}>
                <div className="block hover:bg-gray-50">
                  <div className="py-4">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium truncate h-6 w-1/5 bg-gray-400 rounded"></p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold h-6 bg-gray-400 rounded"></p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500 h-4 bg-gray-400 rounded"></p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6 h-4 bg-gray-400 rounded"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default Loader;
