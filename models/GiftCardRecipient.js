module.exports = {
    attributes: [
        {
            name: 'amount',
            label: 'Gift Card Amount',
            range: 'String',
            metadata: {
                options: [
                    { name: '25', label: '$25' },
                    { name: '50', label: '$50' },
                    { name: '100', label: '$100' }
                ]
            },
            validate: val => val !== '',
            error: 'Please choose a gift card amount.'
        }, {
            name: 'name',
            label: 'Recipient Name',
            range: 'String',
            validate: val => val !== '',
            error: "Please enter your recipient's name"
        }, {
            name: 'street',
            label: 'Street',
            range: 'String'
        }, {
            name: 'cityStateZip',
            label: 'City/State/Zip',
            range: 'String'
        }, {
            name: 'note',
            label: 'Personal Note',
            range: 'Text'
        }
    ]
}