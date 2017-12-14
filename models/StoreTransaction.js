module.exports = {
    attributes: [
        {
            name: 'shipping',
            label: 'Shipping Info',
            range: require('./Shipping').attributes
        }, {
            name: 'payment',
            label: 'Payment Info',
            klass: 'CreditCard',
            prompt: 'We accept credit and debit cards.',
            range: require('./CreditCard').attributes
        }
    ]
}