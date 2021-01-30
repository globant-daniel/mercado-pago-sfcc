module.exports = {
    init: () => {
        const cleave = require('base/components/cleave');

        window.Mercadopago.setPublishableKey(window.MERCADOPAGO_PUBLICKEY);
        window.Mercadopago.getIdentificationTypes();

        const mercadoPagoFields =
            '#dwfrm_billing .mercado-pago-content .payment-form-fields ';

        const selectors = {
            cardNumber: mercadoPagoFields + 'input[data-checkout="cardNumber"]',
            cardType: mercadoPagoFields + 'input#cardType',
            paymentMethod: mercadoPagoFields + 'input#paymentMethodId',
            installments: mercadoPagoFields + 'select#installments',
            transactionAmount: mercadoPagoFields + 'input#transactionAmount'
        };

        cleave.handleCreditCardNumber(selectors.cardNumber);

        function serializeData(form) {
            form.each(function (index, item) {
                if (item.name.indexOf('cardNumber') > -1) {
                    item.value = $(`#${item.id}`).data('cleave').getRawValue(); // eslint-disable-line
                }

                if (item.dataset.checkout === 'cardNumber') {
                    item.value = $(selectors.cardNumber)
                        .data('cleave')
                        .getRawValue(); // eslint-disable-line
                }
            });

            return form.serialize();
        }

        $('body')
            .off('checkout:serializeBilling')
            .on('checkout:serializeBilling', function (e, data) {
                const serializedForm = serializeData(data.form);
                data.callback(serializedForm);
            });

        $(document).on('change', selectors.cardNumber, function () {
            cleanCardInfo();
            const cardNumber = $(this).val().replace(/\s/g, '');
            if (cardNumber.length >= 6) {
                const bin = cardNumber.substring(0, 6);
                window.Mercadopago.getPaymentMethod({ bin: bin }, setCardType);
            }
        });

        function setCardType(status, response) {
            if (status == 200) {
                const paymentMethod = response[0];

                $(selectors.cardType).val(paymentMethod.id);
                $(selectors.paymentMethod).val(paymentMethod.id);
                $(selectors.cardNumber).css(
                    'backgroundImage',
                    'url(' + paymentMethod.thumbnail + ')'
                );

                getInstallments(
                    paymentMethod.id,
                    $(selectors.transactionAmount).val()
                );
            }
        }

        function getInstallments(paymentMethodId, amount) {
            window.Mercadopago.getInstallments(
                {
                    payment_method_id: paymentMethodId,
                    amount: parseFloat(amount)
                },
                setInstallments
            );
        }

        function setInstallments(status, response) {
            if (status == 200) {
                const installments = $(selectors.installments);
                installments.html('');
                response[0].payer_costs.forEach(function (payerCost) {
                    const opt = document.createElement('option');
                    opt.text = payerCost.recommended_message;
                    opt.value = payerCost.installments;
                    installments.append(opt);
                });
            }
        }

        function cleanCardInfo() {
            $(selectors.cardNumber).css('backgroundImage', '');
            $(selectors.installments).html('');
        }
    }
};
