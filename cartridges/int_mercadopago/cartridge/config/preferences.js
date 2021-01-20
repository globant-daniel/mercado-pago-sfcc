var base = module.superModule;

/**
 * @param {dw.order.Order} order - customer order
 * @returns {Object} - { number<string>, type<string>  }
 */
base.getCustomerIdentification = function () {
    // placeholder
    return {
        number: '19119119100',
        type: 'CPF'
    };
};

module.exports = base;
