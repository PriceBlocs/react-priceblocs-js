const getLanguage = () =>
  typeof window !== "undefined" ? window.navigator.language : "en";
const PRESENTATION_STYLE = {
  ACCOUNTING: "accounting"
};
export const formatAmount = ({ currency, amount, presentation }) => {
  const ctxAmount = amount || 0;

  const result = new Intl.NumberFormat(getLanguage(), {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(Math.abs(ctxAmount) / 100);

  return ctxAmount < 0
    ? presentation === PRESENTATION_STYLE.ACCOUNTING
      ? `(${result})`
      : `-${result}`
    : result;
};
