'use strict';

module.exports = {
    processForm: function (req, paymentForm, viewData) {
        var viewFormData = viewData;
        viewFormData.paymentMethod = {
            value: paymentForm.paymentMethod.value,
            htmlName: paymentForm.paymentMethod.value
        };

        var creditCardFields = paymentForm.creditCardFields;

        viewFormData.paymentInformation = {
            cardNumber: creditCardFields.cardNumber.value,
            cardType: creditCardFields.cardType.value,
            cardToken: creditCardFields.cardToken.value,
            expirationMonth: creditCardFields.expirationMonth.value,
            expirationYear: creditCardFields.expirationYear.value,
            installments: creditCardFields.installments.value || 1
        };

        return {
            error: false,
            viewData: viewFormData
        };
    },
    savePaymentInformation: function () {}
};
