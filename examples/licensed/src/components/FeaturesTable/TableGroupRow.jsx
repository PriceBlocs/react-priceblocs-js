import React, { Fragment } from "react";
import FeatureRow from "./FeatureRow";

const TableGroupRow = ({ index, columns, rows, thWidth, tdWidth }) => {
  return (
    <Fragment>
      <tr className="bg-gray-50 dark:bg-gray-800 py-3 pl-6 text-sm font-medium text-gray-900 dark:text-gray-200 text-left">
        <th
          className="py-5 px-6 text-lg font-semibold text-black-500 dark:text-gray-300 text-left"
          colSpan={columns.length}
        >
          <span>{columns[0].header}</span>
        </th>
      </tr>
      {rows.map((row, rowIx) => (
        <FeatureRow
          key={rowIx}
          groupIndex={index}
          rowIndex={rowIx}
          row={row}
          thWidth={thWidth}
          tdWidth={tdWidth}
        />
      ))}
    </Fragment>
  );
};

export default TableGroupRow;
