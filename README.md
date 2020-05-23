This script serves as a basic integration between [BTCPayServer](https://btcpayserver.org) and [Shopify](shopify.com), allowing you to accept non-custodail Bitcoin and Cryptocurrency payments in your Shopify store.

Long-term, a more complete implementation should be possible in BTCPayServer. Work on this integration is tracked in this issue: https://github.com/btcpayserver/btcpayserver/issues/36

# Setup
1. In your BTCPayServer store, enable "Allow anyone to create invoice"
2. In Shopify Settings > Payment Providers > Manual Payment Methods add one which contains "Bitcoin"
3. In Shopify Settings > Checkout > Additional Scripts input the following script, with the details from your BTCPayServer instead of the placeholder values.

```
<script>
	const btcPayServerUrl = 'https://your-btcpay-server-url:port';
	const storeId = 'your-btcpayserver-store-id';
</script>
<script src="https://your-btcpay-server-url:port/modal/btcpay.js"></script> 
<script src="https://djseeds.github.io/btcpay-browser-client/btcpay-browser-client.js"></script>
<script src="https://djseeds.github.io/btcpay-shopify-checkout/btcpay-shopify-checkout.js"></script>
```

# Using Other Currencies
By default the script assumes your Shopify store's currency is USD -- if that's not the case you'll have to set the following variables as well, so that the script can scrape the correct value from the Shopify page and create the invoice in BTCPayServer with the correct currency.

```
const currencySymbol = '£';
const currency='GBP';
```

# Limitations

* Script will not automatically complete orders in Shopify, so you will have to manually crosscheck payments in BTCPayServer based on the order ID in Shopify
