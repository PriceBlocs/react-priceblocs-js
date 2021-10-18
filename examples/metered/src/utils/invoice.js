import { v4 as uuidv4 } from "uuid";
import { formatAmount } from "./currency";
import { formatUTCTime } from "./date";
const PAYMENT_STATUS = {
  PAID: "paid"
};

const TS_FORMAT = {
  PERIOD: "MMM d, yyyy"
};

const getInvoiceLinePeriod = (period) => {
  let periodParts = [];
  if (period.start) {
    periodParts.push(formatUTCTime(period.start, TS_FORMAT.PERIOD));
  }
  if (period.end) {
    periodParts.push(formatUTCTime(period.end, TS_FORMAT.PERIOD));
  }

  return {
    uuid: uuidv4(),
    description: periodParts.join(" - ").toUpperCase(),
    unitAmount: "",
    quantity: "",
    amount: ""
  };
};

const getInvoiceLineAmount = ({ line, currency }) => ({
  uuid: uuidv4(),
  description: line.description,
  quantity: line.quantity,
  unitAmount: formatAmount({
    currency: currency,
    amount: line.price.unit_amount
  }),
  amount: formatAmount({
    currency: currency,
    amount: line.amount
  })
});

const getInvoiceAmountLine = ({ label, currency, amount }) => ({
  uuid: uuidv4(),
  label,
  amount: formatAmount({
    currency,
    amount
  })
});

export const prepareInvoice = ({ invoice }) => {
  const amountItems = [];
  const currency = invoice.currency;

  amountItems.push(
    getInvoiceAmountLine({
      label: "Subtotal",
      currency,
      amount: invoice.subtotal
    })
  );
  amountItems.push(
    getInvoiceAmountLine({
      label: "Total",
      currency,
      amount: invoice.total
    })
  );

  const balanceChange = invoice.starting_balance - invoice.ending_balance;
  const hasBalanceChange = Math.abs(balanceChange) > 0;

  if (hasBalanceChange) {
    amountItems.push(
      getInvoiceAmountLine({
        label: "Applied balance",
        currency,
        amount: balanceChange
      })
    );
  }

  if (invoice.status === PAYMENT_STATUS.PAID) {
    amountItems.push(
      getInvoiceAmountLine({
        label: "Amount paid",
        currency,
        amount: invoice.amount_paid
      })
    );
  } else {
    amountItems.push(
      getInvoiceAmountLine({
        label: "Amount due",
        currency,
        amount: invoice.amount_due
      })
    );
  }

  if (invoice.amount_remaining) {
    amountItems.push(
      getInvoiceAmountLine({
        label: "Amount remaining",
        currency,
        amount: invoice.amount_remaining
      })
    );
  }

  return {
    lineItems: invoice.lines.data.reduce((memo, line) => {
      memo.push(getInvoiceLinePeriod(line.period));
      memo.push(getInvoiceLineAmount({ line, currency: invoice.currency }));
      return memo;
    }, []),
    amountItems
  };
};
