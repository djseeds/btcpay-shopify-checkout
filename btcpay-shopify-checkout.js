! function () {
  "use strict";
  const pageElements = document.querySelector.bind(document),
    insertElement = (document.querySelectorAll.bind(document),
      (e,
        n) => {
        n.parentNode.insertBefore(e,
          n.nextSibling)
      });

  let pageItems = {},
    pageheader = "Thank you!",
    buttonElement = null;

  const setPageItems = () => {
    pageItems = {
      mainHeader: pageElements("#main-header"),
      orderConfirmed: pageElements(".os-step__title"),
      orderConfirmedDescription: pageElements(".os-step__description"),
      continueButton: pageElements(".step__footer__continue-btn"),
      checkMarkIcon: pageElements(".os-header__hanging-icon"),
      orderStatus: pageElements(".os-header__title"),
      paymentMethod: pageElements(".payment-method-list__item__info"),
      price: pageElements(".payment-due__price"),
      finalPrice: pageElements(".total-recap__final-price"),
      orderNumber: pageElements(".os-order-number"),
    }
  },
    orderPaid = () => {
      pageItems.mainHeader.innerText = pageheader,
        pageItems.orderConfirmed && (pageItems.orderConfirmed.style.display = "block"),
        pageItems.orderConfirmedDescription && (pageItems.orderConfirmedDescription.style.display = "block"),
        pageItems.continueButton && (pageItems.continueButton.style.visibility = "visible"),
        pageItems.checkMarkIcon && (pageItems.checkMarkIcon.style.visibility = "visible"),
        buttonElement && (buttonElement.style.display = "none");
    };
  window.setOrderAsPaid = orderPaid,
    window.openNodeShopify = function waitForPaymentMethod() {
      if (setPageItems(),
        "Order canceled" === pageItems.orderStatus.innerText) return;

      const paymentMethod = pageItems.paymentMethod;

      if (null === paymentMethod) return void setTimeout(() => {
        waitForPaymentMethod();
      },
        10);

      if (-1 === paymentMethod.innerText.toLowerCase().indexOf("bitcoin")) return;

      // If payment method is bitcoin, display instructions and payment button.
      pageheader = pageItems.mainHeader.innerText,
        pageItems.mainHeader && (pageItems.mainHeader.innerText = "Review and pay!"),
        pageItems.continueButton && (pageItems.continueButton.style.visibility = "hidden"),
        pageItems.checkMarkIcon && (pageItems.checkMarkIcon.style.visibility = "hidden"),
        pageItems.orderConfirmed && (pageItems.orderConfirmed.style.display = "none"),
        pageItems.orderConfirmedDescription && (pageItems.orderConfirmedDescription.style.display = "none"),
        buttonElement = document.createElement("div");

      const priceElement = pageItems.finalPrice || pageItems.price;
      const price = priceElement.innerText.replace((typeof currencySymbol === 'undefined') ? "$" : currencySymbol, "");
      const orderId = pageItems.orderNumber.innerText.replace("Order #", "");

      const url = btcPayServerUrl + "/invoices" + "?storeId=" + storeId + "&orderId=" + orderId + "&status=complete";

      // Check if already paid.
      fetch(url, {
        method: "GET",
        mode: "cors", // no-cors, cors, *same-origin,
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          return json.data;
        })
        .then(function(data) {
          if(data.length != 0) {
            orderPaid();
          }
        });

      window.waitForPayment = function () {
        BtcPayServerModal.show(
          btcPayServerUrl,
          storeId,
          {
            price: price,
            currency: (typeof currency === 'undefined') ? 'USD': currency,
            orderId: orderId
          }
        )
          .then(function (invoice) {
            if (invoice != null) {
              orderPaid();
            }
          });
      }

      // Payment button that opens modal
      buttonElement.innerHTML = `\n    <button class="btn btn-primary" onclick="window.waitForPayment()"/>Pay with BTCPayServer</button>\n`,
        insertElement(buttonElement, pageItems.orderConfirmed);

    }
  window.openNodeShopify();
}();
