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
            addText: 'Add Recipient',
            prompt: 'You may purchase a gift card (maximum $1000) for one or more people. Enter the info for each recipient and leave a note if you please! Amounts should be entered without dollar sign.',
            itemRange: require('./GiftCardRecipient').attributes
        }, {
            name: 'payment',
            label: 'Payment Info',
            klass: 'CreditCard',
            prompt: 'We accept credit and debit cards.',
            range: require('./CreditCard').attributes
        }
    ]
}