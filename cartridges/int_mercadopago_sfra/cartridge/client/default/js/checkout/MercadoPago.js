module.exports = {
    init: function () {
        window.Mercadopago.setPublishableKey(window.MERCADOPAGO_PUBLICKEY);
        window.Mercadopago.getIdentificationTypes();

        function serializeData (form) {
            form.each(function (index, input) {
                if (input.id === 'MP_cardNumber') {
                    input.value = input.value.replace(/\s/g, '')
                }

                if (input.id === 'cardNumber') {
                    input.value = $(input).data('cleave').getRawValue()
                }
            });

            return form.serializeArray();
        }

        $('body')
            .off('checkout:serializeBilling')
            .on('checkout:serializeBilling', function (e, data) {
                var serializedForm = serializeData(data.form);
                console.log(serializedForm);

                data.callback(serializedForm);
            });

        $(document).on('change', '#MP_cardNumber', function () {
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

                document.getElementById('MP_cardType').value = paymentMethod.id;
                document.getElementById('MP_cardNumber').style.backgroundImage =
                    'url(' + paymentMethod.thumbnail + ')';

                getInstallments(
                    paymentMethod.id,
                    document.getElementById('amount').value
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
                console.log(response);
                document.getElementById('MP_installments').options.length = 0;
                response[0].payer_costs.forEach(function (payerCost) {
                    var opt = document.createElement('option');
                    opt.text = payerCost.recommended_message;
                    opt.value = payerCost.installments;
                    document.getElementById('MP_installments').appendChild(opt);
                });
            } else {
                alert('installments method info error: ', response);
            }
        }

        function cleanCardInfo() {
            document.getElementById('MP_cardNumber').style.backgroundImage = '';
            document.getElementById('MP_installments').options.length = 0;
        }
    }
};
