module.exports = {
    /**
     * Generate installments according to configurations.
     * @param {dw.value.Money} total total of the basket
     * @returns {Array<Object>} { value<number>, displayValue<string> }
     */
    generateInstallments: function (total) {
        var Resource = require('dw/web/Resource');
        var configuration = require('./configuration');

        var MIN_VALUE = configuration.installments.MIN_VALUE;
        var MAX_QTY = configuration.installments.MAX_QTY;

        var installments = [];

        for (var i = 1; i <= MAX_QTY; ++i) {
            var installmentValue = total.divide(i);

            if (installmentValue < MIN_VALUE) {
                break;
            }

            installments.push({
                value: installmentValue.value,
                displayValue: Resource.msgf(
                    'label.payment.installment',
                    'creditCard',
                    null,
                    i,
                    installmentValue.toFormattedString()
                )
            });
        }

        return installments;
    }
};
