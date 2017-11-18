module.exports = {
    attributes: [
        {
            name: 'amount',
            label: 'Gift Card Amount',
            range: 'Select',
            metadata: {
                options: [
                    { label: '$25', value: 25 },
                    { label: '$50', value: 50 },
                    { label: '$100', value: 100 }
                ]
            }
        }, {
            name: 'name',
            label: 'Name',
            range: 'String',
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