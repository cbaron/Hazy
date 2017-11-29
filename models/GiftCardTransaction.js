module.exports = {
    attributes: [
        require('./Name'),
        require('./Email'),
        require('./Phone'),
        {
            name: 'recipients',
            label: 'Recipients',
            range: 'List',
            itemView: 'form',
            prompt: 'You may purchase a gift card for one or more people. Enter the info for each recipient and leave a note if you please!',
            itemRange: require('./GiftCardRecipient').attributes
        }, {
            name: 'payment',
            label: 'Payment Info',
            klass: 'CreditCard',
            prompt: 'We currently only accept credit and debit cards. A $3.50 fee will be added to the cost.',
            range: require('./CreditCard').attributes
        }
    ]
}