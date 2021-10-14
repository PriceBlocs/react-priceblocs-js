import React from "react";
import TableGroupRow from "./TableGroupRow";
import TableHeader from "./TableHeader";

const DesktopFeatureTable = ({
  entity,
  emphasisIndex,
  afterChange,
  thWidth,
  tdWidth,
  header,
  groups
}) => {
  return (
    <table
      className="w-full h-px table-fixed"
      cellSpacing="0"
      style={{
        borderCollapse: "separate",
        borderSpacing: 0,
        position: "relative"
      }}
    >
      <TableHeader
        header={header}
        entity={entity}
        emphasisIndex={emphasisIndex}
        afterChange={afterChange}
      />
      <tbody className="border-t border-gray-200 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600">
        {groups.map(({ columns, rows }, featureGroupIx) => (
          <TableGroupRow
            index={featureGroupIx}
            key={`groupHeader-${featureGroupIx}`}
            columns={columns}
            rows={rows}
            emphasisIndex={emphasisIndex}
            thWidth={thWidth}
            tdWidth={tdWidth}
          />
        ))}
      </tbody>
    </table>
  );
};

export default DesktopFeatureTable;
