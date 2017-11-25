module.exports = {
    attributes: [
        {
            name: 'amount',
            label: 'Gift Card Amount',
            range: 'Select',
            metadata: {
                options: [
                    { name: 25, label: '$25' },
                    { name: 50, label: '$50' },
                    { name: 100, label: '$100' }
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