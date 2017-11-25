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
            range: 'List',
            itemView: 'form',
            itemRange: require('./GiftCardRecipient').attributes
        }, {
            name: 'payment',
            label: 'Payment Info',
            range: require('./CreditCard').attributes
        }
    ]
}