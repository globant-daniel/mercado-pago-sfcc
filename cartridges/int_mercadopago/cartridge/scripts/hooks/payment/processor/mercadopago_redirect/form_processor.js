'use strict';

module.exports = {
    processForm: function (req, paymentForm, viewData) {
        var viewFormData = viewData;
        viewFormData.paymentMethod = {
            value: paymentForm.paymentMethod.value,
            htmlName: paymentForm.paymentMethod.value
        };

        return {
            error: false,
            viewData: viewFormData
        };
    },
    savePaymentInformation: function () {}
};
