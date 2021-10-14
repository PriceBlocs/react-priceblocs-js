import { Switch } from "@headlessui/react";
import {
  usePriceBlocsContext,
  INTERVAL_LABELS_MAP
} from "@priceblocs/react-priceblocs-js";

const DEFAULT_CLASSES = {
  container: "flex flex-row items-center justify-center space-x-2"
};
/**
 * If interval count is 2 then use switch
 * Else use segmented control
 */
const Toggle = ({ customClasses }) => {
  const classes = { ...DEFAULT_CLASSES, ...customClasses };
  const {
    values: { form },
    setFieldValue
  } = usePriceBlocsContext();

  const { intervals, interval, theme } = form;
  const defaultInterval = intervals[0];

  const oppositeInterval = intervals.filter((intVal) => intVal !== interval)[0];

  const checked = interval === defaultInterval;

  const labels = {
    prefix: "Billed",
    checked: INTERVAL_LABELS_MAP[intervals[0]],
    unchecked: INTERVAL_LABELS_MAP[intervals[1]]
  };

  const primaryColor = theme.colors.primary;
  const switchProps = {
    checked,
    onChange: (enabled) =>
      !enabled
        ? setFieldValue("form.interval", oppositeInterval)
        : setFieldValue("form.interval", defaultInterval),
    className: `${
      checked ? `bg-${primaryColor}-600` : "bg-gray-200"
    } relative inline-flex items-center h-6 rounded-full w-11`
  };

  const toggleNode = (
    <Switch {...switchProps}>
      <span className="sr-only">Toggle interval</span>
      <span
        className={`${
          checked ? "translate-x-6" : "translate-x-1"
        } inline-block w-4 h-4 transform bg-white rounded-full`}
      />
    </Switch>
  );

  if (labels) {
    return (
      <div className={classes.container}>
        <div
          className={`text-sm text-${
            checked ? "gray-500" : "black"
          } font-medium`}
        >{`${labels.prefix} ${labels.unchecked}`}</div>
        {toggleNode}
        <div
          className={`text-sm text-${
            checked ? "black" : "gray-500"
          } font-medium`}
        >{`${labels.prefix} ${labels.checked}`}</div>
      </div>
    );
  } else {
    return toggleNode;
  }
};

export default Toggle;
