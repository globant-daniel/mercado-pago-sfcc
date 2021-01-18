//REPLACE WITH YOUR PUBLIC KEY AVAILABLE IN: https://developers.mercadopago.com/panel/credentials

module.exports = {
    init: function () {
        window.Mercadopago.setPublishableKey(window.MERCADOPAGO_PUBLICKEY);
        window.Mercadopago.getIdentificationTypes();

        $(document).on('change', '#MP_cardNumber', function () {
            cleanCardInfo();
            var cardNumber = $(this).val().replace(/\s/g, '');;
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

        //Proceed with payment
        doSubmit = false;
        function getCardToken(event) {
            event.preventDefault();
            if (!doSubmit) {
                var $form = document.getElementById('paymentForm');
                window.Mercadopago.createToken($form, setCardTokenAndPay);

                return false;
            }
        }

        function setCardTokenAndPay(status, response) {
            if (status == 200 || status == 201) {
                var form = document.getElementById('paymentForm');
                var card = document.createElement('input');
                card.setAttribute('name', 'token');
                card.setAttribute('type', 'hidden');
                card.setAttribute('value', response.id);
                form.appendChild(card);
                doSubmit = true;
                form.submit(); //Submit form data to your backend
            } else {
                alert(
                    'Verify filled data!\n' + JSON.stringify(response, null, 4)
                );
            }
        }

        function cleanCardInfo() {
            document.getElementById('MP_cardNumber').style.backgroundImage = '';
            document.getElementById('MP_installments').options.length = 0;
        }
    }
};
