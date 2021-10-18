import React, { Fragment } from 'react'
import { getCursors, PAGINATION_STEP } from '@utils/ui'
import Pagination from '@components/Pagination'

const Table = ({ summaries, setPage, page }) => {
  const total = summaries.length
  const { start, end } = getCursors(page, total, PAGINATION_STEP)
  const subset = summaries.slice(start, end)

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
                      Period
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                    >
                      Usage
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                    >
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subset.map((summary) => (
                    <tr
                      className="cursor-pointer hover:bg-gray-50"
                      key={summary.id}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 hover:text-gray-900">
                        {summary.period.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {summary.total_usage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {summary.total_cost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                setPage={setPage}
                page={page}
                total={summaries.length}
              />
            </div>
          </div>
        </div>
      </div>
      <ul className="sm:hidden divide-y divide-gray-200">
        {subset.map((summary) => {
          return (
            <li key={summary.id}>
              <div className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {summary.period.label}
                    </p>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">{`${
                        summary.total_usage
                      } unit${summary.total_usage > 1 ? 's' : ''}`}</p>
                      {summary.total_cost && (
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          {summary.total_cost}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
        <Pagination setPage={setPage} page={page} total={summaries.length} />
      </ul>
    </Fragment>
  )
}

export default Table
