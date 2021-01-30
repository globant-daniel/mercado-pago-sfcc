var checkout = require('./checkout/checkout');
var billing = require('./checkout/billing');
var MercadoPago = require('./checkout/MercadoPago');
var processInclude = require('base/util');

$(document).ready(function () { // eslint-disable-line
    processInclude(billing)
    processInclude(checkout);
    processInclude(MercadoPago);
});
