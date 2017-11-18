module.exports = {
    attributes: [
        {
            name: 'name',
            label: 'Name',
            range: 'String'
        }, {
            name: 'email',
            label: 'Email',
            range: 'Email'
        }, {
            name: 'phone',
            label: 'Phone Number',
            range: 'String'
        }, {
            name: 'recipients',
            label: 'Recipients',
            range: 'GiftCardRecipient'
        }, {
            name: 'payment',
            label: 'Payment Info',
            range: require('./CreditCard').attributes
        }
    ]
}