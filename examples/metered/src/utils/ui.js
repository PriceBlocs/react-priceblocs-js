export const PAGINATION_STEP = 10;

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const getCursors = (page, total, step) => {
  const start = page * step;
  let end = start + step;
  if (end > total) {
    end = total;
  }

  return {
    next: Number(page) + 1,
    prev: Number(page) - 1,
    start,
    end,
    pages: Math.ceil(total / step)
  };
};
