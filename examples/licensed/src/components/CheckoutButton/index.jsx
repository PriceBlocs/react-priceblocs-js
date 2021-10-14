import React, { Fragment, useState } from "react";
import { usePriceBlocsContext } from "@priceblocs/react-priceblocs-js";
import Spinner from "../Spinner";
import Overlay from "../Overlay";
import PreviewInvoice from "../PreviewInvoice";
import classNames from "../../utils/classNames";
import { useCartCheckout } from "../../hooks/useCartCheckout";

const DEFAULT_COPY = {
  value: "Buy now",
  loading: "Loading..."
};

const PREVIEW_INVOICE = "preview_invoice";
const OVERLAY_TYPE = {
  PREVIEW_INVOICE
};

const CheckoutButton = ({
  price,
  product,
  checkout: checkoutInput,
  copy: copyProps
}) => {
  const [overlay, setOverlay] = useState(null);

  const {
    action,
    checkout: cartCheckout,
    subscription,
    disabled
  } = useCartCheckout({
    price,
    product,
    checkout: checkoutInput
  });

  const {
    refetch,
    checkout,
    values: {
      form: { theme }
    }
  } = usePriceBlocsContext();

  const copy = { ...DEFAULT_COPY, ...action, ...copyProps };

  const primaryColor = theme.colors.primary;
  const [loading, setLoading] = useState(false);
  const buttonCopy = loading ? copy.loading : copy.value;

  const buttonClasses = classNames(
    `flex shadow-md justify-center items-center text-center mt-auto text-white bg-${primaryColor}-500 border-0 py-2 px-4 w-full focus:outline-none rounded-md transition duration-150 ease-in-out font-medium disabled:opacity-20`,
    !disabled ? `hover:bg-${primaryColor}-600` : "",
    disabled ? "cursor-not-allowed" : ""
  );

  const buttonProps = {
    type: "button",
    disabled: loading || disabled,
    className: buttonClasses
  };

  let trigger = (
    <button
      {...buttonProps}
      onClick={async () => {
        setLoading(true);
        await checkout(cartCheckout);
        setLoading(false);
      }}
    >
      {loading && <Spinner />}
      {buttonCopy}
    </button>
  );
  console.log("subscription", subscription);
  if (subscription) {
    trigger = (
      <button
        {...buttonProps}
        onClick={() => setOverlay(OVERLAY_TYPE.PREVIEW_INVOICE)}
      >
        {buttonCopy}
      </button>
    );
  }

  const OVERLAY_TITLE_MAP = {
    [OVERLAY_TYPE.PREVIEW_INVOICE]: "Update subscription"
  };

  return (
    <Fragment>
      {trigger}
      <Overlay open={Boolean(overlay)} setOpen={setOverlay}>
        {overlay === OVERLAY_TYPE.PREVIEW_INVOICE ? (
          <PreviewInvoice
            title={OVERLAY_TITLE_MAP[overlay]}
            setOpen={setOverlay}
            subscription={subscription}
            prices={cartCheckout.prices}
            afterConfirm={() => {
              setOverlay(null);
              refetch();
            }}
          />
        ) : null}
      </Overlay>
    </Fragment>
  );
};

export default CheckoutButton;