import React, { Fragment } from "react";
import ReactTooltip from "react-tooltip";
import { TOOLTIP_POSITION } from "@constants/ui";

const DEFAULT_CLASSES = {
  tooltip: "bg-black-90 white"
};

const Tooltip = ({ tooltip, children, position, id, customClasses }) => {
  const classes = { ...DEFAULT_CLASSES, ...customClasses };
  if (!id && tooltip) {
    throw new Error("Tooltip needs a unique id");
  }

  const pos = position || TOOLTIP_POSITION.TOP;

  if (tooltip) {
    return (
      <Fragment>
        <div className="flex cursor-pointer" data-tip data-for={id}>
          {children}
        </div>
        <ReactTooltip
          id={id}
          className={classes.tooltip}
          effect="solid"
          place={pos}
        >
          {tooltip}
        </ReactTooltip>
      </Fragment>
    );
  } else {
    return children;
  }
};

export default Tooltip;
