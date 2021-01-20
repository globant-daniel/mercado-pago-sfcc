var checkout = require('./checkout/checkout');
var MercadoPago = require('./checkout/MercadoPago');
var processInclude = require('base/util');

$(document).ready(function () { // eslint-disable-line
    processInclude(checkout);
    processInclude(MercadoPago);
});
