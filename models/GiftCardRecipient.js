module.exports = {
    attributes: [
        {
            name: 'amount',
            label: 'Gift Card Amount',
            range: 'String',
            validate: val => {
                val = Number.parseFloat( val )
                return val && val > 0 && val <= 1000
            },
            error: 'Please choose a valid gift card amount.'
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