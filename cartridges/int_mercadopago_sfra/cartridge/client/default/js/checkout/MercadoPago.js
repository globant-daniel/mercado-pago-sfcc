module.exports = {
    init: function () {
        var $selector = '#dwfrm_billing .mercado-pago-content .payment-form-fields :input';
        window.Mercadopago.setPublishableKey(window.MERCADOPAGO_PUBLICKEY);
        window.Mercadopago.getIdentificationTypes();

        function serializeData (form) {
            var cloneForm = form.clone();
            cloneForm.each(function (index, input) {
                if (input.dataset.checkout === 'cardNumber') {
                    input.value = input.value.replace(/\s/g, '')
                } else if (input.id === 'cardNumber') {
                    input.value = $(input).data('cleave').getRawValue()
                }
            });

            return cloneForm.serialize();
        }

        $('body')
            .off('checkout:serializeBilling')
            .on('checkout:serializeBilling', function (e, data) {
                var serializedForm = serializeData(data.form);
                data.callback(serializedForm);
            });

        $(document).on('change', $selector + '[data-checkout="cardNumber"]', function () {
            cleanCardInfo();
            var cardNumber = $(this).val().replace(/\s/g, '');
            if (cardNumber.length >= 6) {
                var bin = cardNumber.substring(0, 6);
                window.Mercadopago.getPaymentMethod({ bin: bin }, setCardType);
            }
        });

        function setCardType(status, response) {
            if (status == 200) {
                var paymentMethod = response[0];

                $($selector + '#cardType').val(paymentMethod.id);
                $($selector + '#paymentMethodId').val(paymentMethod.id);
                $($selector + '#cardNumber').css('backgroundImage', 'url(' + paymentMethod.thumbnail + ')')

                getInstallments(
                    paymentMethod.id,
                    $($selector + '#transactionAmount').val()
                );
            } else {
                alert('payment method info error: ' + response);
            }
        }

        function getInstallments(paymentMethodId, amount, issuerId) {
            window.Mercadopago.getInstallments(
                {
                    payment_method_id: paymentMethodId,
                    amount: parseFloat(amount),
                    issuer_id: issuerId ? parseInt(issuerId) : undefined
                },
                setInstallments
            );
        }

        function setInstallments(status, response) {
            if (status == 200) {
                var $installments = $($selector + '#installments');
                $installments.html('');
                response[0].payer_costs.forEach(function (payerCost) {
                    var opt = document.createElement('option');
                    opt.text = payerCost.recommended_message;
                    opt.value = payerCost.installments;
                    installments.append(opt);
                });
            } else {
                alert('installments method info error: ', response);
            }
        }

        function cleanCardInfo() {
            $($selector + '#cardNumber').css('backgroundImage', '');
            $($selector + '#installments').html('');
        }
    }
};
